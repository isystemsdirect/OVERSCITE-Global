/**
 * LARI Pipeline Router
 *
 * Canonical multi-engine orchestration pipeline.
 * Sequences engine execution: Context → Planner → Critic → Synthesizer.
 * Receives input from Scing orchestrator; returns structured output.
 *
 * Canon constraints:
 * - LARI is a bounded reasoning federation — no tool execution, no DB mutation.
 * - All actions must still route through Scing → BANE.
 * - No reasoning logic may be embedded into BANE.
 * - Pipeline execution is auditable via stageTrace.
 */

import type { LariPipelineRequest, LariPipelineResponse } from './contracts';
import { runContextEngine } from './engines/context';
import { runRetrieverEngine } from './engines/retriever';
import { runAnalystEngine } from './engines/analyst';
import { runPlannerEngine } from './engines/planner';
import { runCriticEngine } from './engines/critic';
import { runSynthesizerEngine } from './engines/synthesizer';

// ---------------------------------------------------------------------------
// Pipeline Execution
// ---------------------------------------------------------------------------

/**
 * Execute the full LARI reasoning pipeline.
 *
 * Flow:
 *   1. Context engine enriches the request with domain/keyword/session context
 *   2. Planner engine decomposes the request into ordered reasoning steps
 *   3. Critic engine evaluates the plan and findings for quality
 *   4. Synthesizer engine merges everything into a final structured response
 *   5. Response returned to Scing orchestrator
 *
 * All stages are synchronous and bounded. No tool calls, no external services.
 */
export function executeLariPipeline(
  request: LariPipelineRequest
): LariPipelineResponse {
  // Stage 1: Context enrichment
  const { enrichment: context, trace: contextTrace } = runContextEngine(request);

  // Stage 1.5: Grounding and Pattern Analysis
  const { findings: retFindings, trace: retTrace, rawCaptures } = runRetrieverEngine(request, [context]);
  const { findings: anaFindings, trace: anaTrace } = runAnalystEngine(request, [context], rawCaptures);

  // Stage 2: Plan decomposition
  const { plan, trace: plannerTrace } = runPlannerEngine(request, context);

  // Stage 3: Critic evaluation
  const criticInputFindings = [...plan.findings, ...retFindings, ...anaFindings];
  const { evaluation: criticEval, trace: criticTrace } = runCriticEngine(
    plan,
    context,
    criticInputFindings
  );

  // Stage 4: Synthesis
  const response = runSynthesizerEngine({
    request,
    context,
    plan,
    criticEval,
    priorTraces: [contextTrace, retTrace, anaTrace, plannerTrace, criticTrace],
    anaFindings,
    retFindings,
    rawCaptures,
  });

  return response;
}
