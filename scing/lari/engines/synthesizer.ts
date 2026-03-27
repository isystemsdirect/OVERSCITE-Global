/**
 * LARI Pipeline Engine — Synthesizer
 *
 * Merges outputs from context, planner, and critic engines into a final
 * unified reasoning artifact for return to Scing orchestrator.
 *
 * Canon constraints:
 * - Stateless per invocation.
 * - No tool execution, no database access, no governance authority.
 * - Combines; does NOT create new side effects.
 */

import type {
  LariPipelineRequest,
  LariPipelineResponse,
  LariPipelineFinding,
  LariStageTrace,
} from '../contracts';
import type { ContextEnrichment } from './context';
import type { PlanOutput } from './planner';
import type { CriticEvaluation } from './critic';

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/**
 * Merge all pipeline outputs into a final reasoning response.
 */
function synthesize(params: {
  request: LariPipelineRequest;
  context: ContextEnrichment;
  plan: PlanOutput;
  criticEval: CriticEvaluation;
  priorTraces: LariStageTrace[];
  anaFindings?: LariPipelineFinding[];
  retFindings?: LariPipelineFinding[];
  rawCaptures?: any[];
}): LariPipelineResponse {
  const t0 = Date.now();
  const { request, context, plan, criticEval, priorTraces, anaFindings, retFindings, rawCaptures } = params;

  // Collect all findings, applying critic retention decisions
  const retainedIds = new Set(
    criticEval.evaluations.filter((e) => e.retain).map((e) => e.findingId)
  );

  const allFindings: LariPipelineFinding[] = [
    // Analysis findings
    ...(anaFindings || []).filter((f) => retainedIds.has(f.id)),
    // Grounding findings
    ...(retFindings || []).filter((f) => retainedIds.has(f.id)),
    // Planner findings
    ...plan.findings.filter((f) => retainedIds.has(f.id)),
    // Critic meta-findings
    ...criticEval.findings,
  ];

  // Apply critic confidence adjustments
  for (const finding of allFindings) {
    const adj = criticEval.evaluations.find((e) => e.findingId === finding.id);
    if (adj?.adjustedConfidence !== undefined) {
      finding.confidence = adj.adjustedConfidence;
    }
  }

  // Compute overall pipeline confidence
  const findingConfidences = allFindings.map((f) => f.confidence);
  const avgConfidence = findingConfidences.length > 0
    ? findingConfidences.reduce((a, b) => a + b, 0) / findingConfidences.length
    : criticEval.qualityScore;

  const overallConfidence = Math.min(1, (avgConfidence + criticEval.qualityScore) / 2);

  // Synthesize reasoning text
  const reasoningParts: string[] = [];

  reasoningParts.push(`[Domain: ${context.domain}]`);
  reasoningParts.push(`[Plan: ${plan.steps.length} steps, complexity ${plan.complexity}/5]`);
  reasoningParts.push(`[Quality: ${criticEval.qualityScore.toFixed(2)}]`);

  if (allFindings.length > 0) {
    reasoningParts.push(`[Findings: ${allFindings.length}]`);
    for (const f of allFindings) {
      reasoningParts.push(`  - ${f.title} (Source: ${f.source}, confidence: ${f.confidence.toFixed(2)})`);
    }
  }

  if (context.warnings.length > 0 || criticEval.warnings.length > 0) {
    const allWarnings = [...context.warnings, ...criticEval.warnings];
    reasoningParts.push(`[Warnings: ${allWarnings.join(', ')}]`);
  }

  // Build synthesizer trace
  const synthTrace: LariStageTrace = {
    stage: 'synthesizer',
    engineId: 'lari-synthesizer',
    durationMs: Date.now() - t0,
    inputSummary: `ana=${anaFindings?.length}, ret=${retFindings?.length}, plan=${plan.findings.length}`,
    outputSummary: `merged=${allFindings.length}, confidence=${overallConfidence.toFixed(2)}`,
  };

  // Compute total pipeline duration
  const totalDuration = priorTraces.reduce((sum, t) => sum + t.durationMs, 0) + synthTrace.durationMs;

  return {
    traceId: request.traceId,
    reasoning: reasoningParts.join('\n'),
    findings: allFindings,
    confidence: overallConfidence,
    durationMs: totalDuration,
    warnings: [...context.warnings, ...criticEval.warnings],
    stageTrace: [...priorTraces, synthTrace],
    rawCaptures,
  };
}

/**
 * Run the synthesizer engine.
 */
export function runSynthesizerEngine(params: {
  request: LariPipelineRequest;
  context: ContextEnrichment;
  plan: PlanOutput;
  criticEval: CriticEvaluation;
  priorTraces: LariStageTrace[];
  anaFindings?: LariPipelineFinding[];
  retFindings?: LariPipelineFinding[];
  rawCaptures?: any[];
}): LariPipelineResponse {
  return synthesize(params);
}
