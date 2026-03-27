/**
 * Scing Cloud Core — Global Orchestrator (SCING_ORCH)
 *
 * Implements Track D: The global routing, action gating, and LARI off-loading layer.
 * This file wraps the "Scing Interface" (orchestrator.ts), managing the full
 * lifecycle of a user request from BANE ingress to SCING-REPORT egress.
 *
 * Authority: UTCB Track D
 */

import { ScingOrchestratorRequest, ScingOrchestratorResponse } from './types';
import * as sessionManager from './sessionManager';
import { evaluateActionGate, emitPostGateReceipt, buildActorContext } from './governance';
import { emitScingEvent } from './auditEmitter';
import { orchestrateScingInterface } from './orchestrator';
import { executeLariPipeline } from '../../../../scing/lari/lariOrch';
import { compileScingReport } from './governance/reportCompiler';
import { EngineFinding, EngineTrace, EngineVerdict } from '../../../../scing/engine/logicContracts';
import { EngineId } from '../../../../scing/engine/engineTypes';

export async function globalOrchestrate(params: {
  request: ScingOrchestratorRequest;
  userId: string;
  capabilities: string[];
}): Promise<ScingOrchestratorResponse> {
  const { request, userId, capabilities } = params;

  // 1. Session & Governance Gate (BANE)
  const session = await sessionManager.getSession(request.sessionId, userId);
  const actor = buildActorContext({ userId, sessionId: session.id, capabilities });
  const gateDecision = await evaluateActionGate({
    action: 'scing.chat',
    actor,
    metadata: { messagePreview: request.message.slice(0, 200) },
  });

  const verdicts: EngineVerdict[] = [];

  if (!gateDecision.permitted) {
    return {
      message: `Request blocked by governance policy: ${gateDecision.reason}`,
      toolInvocations: [],
      auditTrail: [gateDecision.receiptId],
      sessionMutations: {},
    };
  }

  // 2. Emit Request Audit
  const requestAuditId = await emitScingEvent({
    type: 'orchestrate.request',
    sessionId: session.id,
    userId,
    metadata: { messagePreview: request.message.slice(0, 200) },
  });

  // 3. LARI Off-loading (Reasoning Federation) — Execute BEFORE interface
  const traces: EngineTrace[] = [];
  const findings: EngineFinding[] = [];
  let rawCaptures: Record<string, unknown>[] = [];

  try {
    const history = await sessionManager.getHistory(session.id, 10);
    const lariOutput = executeLariPipeline({
      traceId: requestAuditId,
      text: request.message,
      sessionId: session.id,
      userId,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    });

    rawCaptures = lariOutput.rawCaptures || [];
    
    if (lariOutput.stageTrace) {
      traces.push(...lariOutput.stageTrace.map(t => ({
        engineId: t.engineId as EngineId,
        executionClass: 'reasoning' as const,
        stage: t.stage,
        durationMs: t.durationMs,
        traceId: lariOutput!.traceId,
        startedAt: new Date().toISOString(),
        inputSummary: t.inputSummary,
        outputSummary: t.outputSummary,
      })));
    }
    
    if (lariOutput.findings) {
      findings.push(...lariOutput.findings.map(f => ({
        id: `lari_${Date.now()}_${Math.random()}`,
        title: f.title,
        description: f.description,
        severity: 'R1-low' as const,
        confidence: 0.85,
        sourceEngineId: f.source as EngineId,
        evidenceRefs: [],
        timestamp: new Date().toISOString(),
        traceId: lariOutput!.traceId,
        requiresHumanReview: false,
      })));
    }

  } catch (lariErr: unknown) {
    console.warn(`LARI pipeline error (non-blocking): ${lariErr}`);
  }

  // 4. Execute Scing Interface (`orchestrator.ts` running Genkit)
  // Now passing lariContext (findings + rawCaptures) for authentic reasoning
  const interfaceResult = await orchestrateScingInterface({
    request,
    session,
    userId,
    capabilities,
    auditRef: requestAuditId,
    lariContext: { findings, rawCaptures }
  });

  // 5. Compile SCING-REPORT
  const reportOutput = compileScingReport({
    traceId: requestAuditId,
    findings,
    traces,
    verdicts,
    sessionContext: session.context
  });

  // 6. Post-execution governance receipt
  const postReceiptId = await emitPostGateReceipt({
    action: 'scing.chat',
    classification: gateDecision.classification,
    actor,
    traceId: gateDecision.traceId,
    success: true,
    metadata: { 
      responseLength: interfaceResult.message.length, 
      toolCallCount: interfaceResult.toolInvocations.length 
    },
  });

  const finalAuditTrail = [requestAuditId, ...interfaceResult.auditTrail];
  if (postReceiptId) finalAuditTrail.push(postReceiptId);

  return {
    message: interfaceResult.message,
    toolInvocations: interfaceResult.toolInvocations,
    auditTrail: finalAuditTrail,
    sessionMutations: {},
    findings,
    traces,
    reportBlocks: reportOutput.reportBlocks,
    verdicts
  };
}
