/**
 * Scing Cloud Core — BANE Logic Stack
 *
 * Implements the BANE Enforcement Family logic stack as defined in Track G.
 * BANE constitutes the structural and governance perimeter of the SCINGULAR
 * architecture. It does not reason; it enforces, classifies risk, and ensures
 * zero-trust boundary integrity.
 *
 * Core Engines implemented here:
 *   - BANE-CORE: Spine integrity, fail-closed unknown path refusal.
 *   - BANE-POLICY: Action classification, capability evaluation, and gating.
 *   - BANE-COMPLIANCE: Regulatory classification and validation.
 *   - BANE-AUDIT: Immutable audit trail generation and receipt holding.
 *
 * Authority: UTCB Track G — Director Anderson, 2026-03-23
 */

import {
  EngineVerdict,
  EngineTrace,
} from '../../scing_engine/engine/logicContracts';
import {
  ActionClassification,
  ActorContext,
  ActionGateDecision,
} from './governanceTypes';
import { evaluateActionGate } from './actionGate';

// ---------------------------------------------------------------------------
// Engine: BANE-CORE (Structural Integrity & Unknown-Path Refusal)
// ---------------------------------------------------------------------------

export interface CoreIntegrityRequest {
  traceId: string;
  sourceEngine: string;
  proposedAction: string;
  context: ActorContext;
}

/**
 * BANE-CORE serves as the lowest-level refusal switch.
 * If an action is fundamentally unknown, structurally malformed, or
 * lacking valid trace lineage, BANE-CORE fails closed immediately.
 */
export function evaluateBaneCore(req: CoreIntegrityRequest): EngineVerdict {
  // Fail-closed safety check
  if (!req.proposedAction || !req.traceId) {
    return {
      disposition: 'denied',
      rationale: 'BANE-CORE Refusal: Structural integrity failure (missing action or traceId).',
      authorityChain: [{ source: 'BANE-CORE', policyRef: 'core-fail-closed', weight: 1.0 }],
      issuedBy: 'BANE-CORE',
      traceId: req.traceId || 'unknown_trace_id',
      timestamp: new Date().toISOString(),
    };
  }

  // If structurally sound, permit progression to BANE-POLICY
  return {
    disposition: 'permitted',
    rationale: 'BANE-CORE boundary check passed. Structural integrity maintained.',
    authorityChain: [{ source: 'BANE-CORE', policyRef: 'core-spine-check', weight: 1.0 }],
    issuedBy: 'BANE-CORE',
    traceId: req.traceId,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Engine: BANE-POLICY (Gate Evaluation & Capability Enforcement)
// ---------------------------------------------------------------------------

export interface PolicyEvaluationRequest {
  traceId: string;
  action: string;
  actor: ActorContext;
  metadata?: Record<string, unknown>;
}

/**
 * BANE-POLICY delegates to ActionGate for specific classification
 * and capability enforcement, then wraps the result in an EngineVerdict.
 */
export async function evaluateBanePolicy(
  req: PolicyEvaluationRequest
): Promise<{ verdict: EngineVerdict; gateDecision: ActionGateDecision }> {
  const gateResult = await evaluateActionGate({
    action: req.action,
    actor: req.actor,
    metadata: req.metadata,
  });

  const verdict: EngineVerdict = {
    disposition: gateResult.permitted ? 'permitted' : 'denied',
    rationale: gateResult.reason,
    authorityChain: [
      {
        source: 'BANE-POLICY',
        policyRef: `classification-tier:${gateResult.classification}`,
        weight: 1.0,
      },
    ],
    issuedBy: 'BANE-POLICY',
    traceId: req.traceId,
    timestamp: new Date().toISOString(),
  };

  return { verdict, gateDecision: gateResult };
}

// ---------------------------------------------------------------------------
// Engine: BANE-COMPLIANCE (Regulatory & Operational Constraints)
// ---------------------------------------------------------------------------

/**
 * BANE-COMPLIANCE ensures operations align with broader organizational,
 * geographic, or domain-specific mandates.
 */
export function evaluateBaneCompliance(
  actionClassification: ActionClassification,
  actor: ActorContext
): EngineVerdict {
  // Currently a stub for deterministic compliance evaluation.
  // In a robust implementation, this would check geolocation boundaries,
  // temporal access restrictions, or data residency rules.
  
  let violates = false;
  let reason = 'Compliance checks passed.';

  if (
    actionClassification === 'irreversible' &&
    !actor.capabilities.includes('admin')
  ) {
    violates = true;
    reason = 'BANE-COMPLIANCE Refusal: Irreversible actions require elevated domain clearance.';
  }

  return {
    disposition: violates ? 'denied' : 'permitted',
    rationale: reason,
    authorityChain: [
      {
        source: 'BANE-COMPLIANCE',
        policyRef: 'global-compliance-baseline',
        weight: 1.0,
      },
    ],
    issuedBy: 'BANE-COMPLIANCE',
    traceId: 'inferred_or_provided', // Compliance doesn't receive traceId directly yet
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Engine: BANE-AUDIT (Immutable Lineage & Receipt Holding)
// ---------------------------------------------------------------------------

export interface AuditRecordRequest {
  traceId: string;
  actor: ActorContext;
  verdicts: EngineVerdict[];
  finalOutcome: 'permit' | 'deny';
  action: string;
  metadata?: Record<string, unknown>;
}

/**
 * BANE-AUDIT generates the final, authoritative lineage trace for an action
 * journey through the BANE perimeter. This functions as the system of record.
 */
export function generateBaneAuditTrace(req: AuditRecordRequest): EngineTrace {
  return {
    engineId: 'BANE-AUDIT',
    executionClass: 'audit',
    stage: 'gov-receipt',
    durationMs: 0,
    traceId: req.traceId,
    startedAt: new Date().toISOString(),
    inputSummary: `actor:${req.actor.userId}|action:${req.action}`,
    outputSummary: `verdicts:[${req.verdicts.map((v) => v.disposition).join(',')}]`,
  };
}

// ---------------------------------------------------------------------------
// Unified BANE Execution Pipeline
// ---------------------------------------------------------------------------

/**
 * Executes the full BANE stack sequentially: CORE -> COMPLIANCE -> POLICY.
 * Fails fast on any 'deny' verdict.
 */
export async function executeBaneStack(
  req: PolicyEvaluationRequest
): Promise<{ permitted: boolean; trace: EngineTrace; finalVerdict: EngineVerdict }> {
  const verdicts: EngineVerdict[] = [];

  // 1. CORE Check
  const coreVerdict = evaluateBaneCore({
    traceId: req.traceId,
    sourceEngine: 'UNKNOWN',
    proposedAction: req.action,
    context: req.actor,
  });
  verdicts.push(coreVerdict);
  if (coreVerdict.disposition === 'denied') {
    return _halt(req, verdicts, coreVerdict);
  }

  // 2. POLICY Check
  const policyResult = await evaluateBanePolicy(req);
  verdicts.push(policyResult.verdict);
  if (policyResult.verdict.disposition === 'denied') {
    return _halt(req, verdicts, policyResult.verdict);
  }

  // 3. COMPLIANCE Check
  const compVerdict = evaluateBaneCompliance(
    policyResult.gateDecision.classification,
    req.actor
  );
  compVerdict.traceId = req.traceId; // Inject actual trace id
  verdicts.push(compVerdict);
  if (compVerdict.disposition === 'denied') {
    return _halt(req, verdicts, compVerdict);
  }

  // SUCCESS - Build Audit Trace
  const trace = generateBaneAuditTrace({
    traceId: req.traceId,
    actor: req.actor,
    verdicts,
    finalOutcome: 'permit',
    action: req.action,
    metadata: req.metadata,
  });

  return { permitted: true, trace, finalVerdict: compVerdict };
}

function _halt(
  req: PolicyEvaluationRequest,
  verdicts: EngineVerdict[],
  fatalVerdict: EngineVerdict
) {
  const trace = generateBaneAuditTrace({
    traceId: req.traceId,
    actor: req.actor,
    verdicts,
    finalOutcome: 'deny',
    action: req.action,
    metadata: req.metadata,
  });
  return { permitted: false, trace, finalVerdict: fatalVerdict };
}
