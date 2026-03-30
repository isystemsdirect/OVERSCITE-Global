/**
 * LARI Pipeline Engine — Critic
 *
 * Evaluates reasoning outputs for correctness, consistency, and quality.
 * Wraps existing scing/lari/critic/ modules into the pipeline facade.
 *
 * Canon constraints:
 * - Stateless per invocation.
 * - No tool execution, no database access, no governance authority.
 * - Evaluates; does NOT modify source data.
 */

import type {
  LariPipelineFinding,
  LariStageTrace,
} from '../contracts';
import type { PlanOutput } from './planner';
import type { ContextEnrichment } from './context';

// ---------------------------------------------------------------------------
// Critic Output
// ---------------------------------------------------------------------------

export interface CriticEvaluation {
  /** Overall quality score [0.0 – 1.0]. */
  qualityScore: number;
  /** Individual finding evaluations. */
  evaluations: CriticFindingEvaluation[];
  /** Critic-generated findings (meta-observations). */
  findings: LariPipelineFinding[];
  /** Warnings about reasoning quality. */
  warnings: string[];
}

export interface CriticFindingEvaluation {
  findingId: string;
  /** Whether this finding should be retained. */
  retain: boolean;
  /** Reason for decision. */
  reason: string;
  /** Adjusted confidence score (if applicable). */
  adjustedConfidence?: number;
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/**
 * Evaluate a plan for structural soundness.
 */
function evaluatePlan(plan: PlanOutput): {
  score: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let score = 1.0;

  // Penalize empty plans
  if (plan.steps.length === 0) {
    warnings.push('EMPTY_PLAN');
    return { score: 0.1, warnings };
  }

  // Check for dependency integrity
  const stepIds = new Set(plan.steps.map((s) => s.order));
  for (const step of plan.steps) {
    for (const dep of step.dependsOn) {
      if (!stepIds.has(dep)) {
        warnings.push(`BROKEN_DEPENDENCY: step ${step.order} depends on missing step ${dep}`);
        score -= 0.2;
      }
    }
  }

  // Check for circular dependency (simple: step can't depend on itself or later steps)
  for (const step of plan.steps) {
    if (step.dependsOn.some((d) => d >= step.order)) {
      warnings.push(`CIRCULAR_DEPENDENCY: step ${step.order}`);
      score -= 0.3;
    }
  }

  // High complexity plans get a mild penalty
  if (plan.complexity >= 4) {
    score -= 0.1;
  }

  return { score: Math.max(0, score), warnings };
}

/**
 * Evaluate individual findings for quality.
 */
function evaluateFindings(
  findings: LariPipelineFinding[]
): CriticFindingEvaluation[] {
  return findings.map((f) => {
    // Low-confidence findings should be flagged
    if (f.confidence < 0.3) {
      return {
        findingId: f.id,
        retain: false,
        reason: 'Confidence below minimum threshold (0.3).',
        adjustedConfidence: f.confidence,
      };
    }

    // Mid-confidence findings get adjusted
    if (f.confidence < 0.6) {
      return {
        findingId: f.id,
        retain: true,
        reason: 'Retained with reduced confidence.',
        adjustedConfidence: f.confidence * 0.9,
      };
    }

    return {
      findingId: f.id,
      retain: true,
      reason: 'Confidence acceptable.',
    };
  });
}

/**
 * Run the critic engine.
 */
export function runCriticEngine(
  plan: PlanOutput,
  context: ContextEnrichment,
  upstreamFindings: LariPipelineFinding[]
): { evaluation: CriticEvaluation; trace: LariStageTrace } {
  const t0 = Date.now();

  const planEval = evaluatePlan(plan);
  const findingEvals = evaluateFindings(upstreamFindings);
  const criticFindings: LariPipelineFinding[] = [];

  // Generate meta-findings based on evaluation
  const retainedCount = findingEvals.filter((e) => e.retain).length;
  const rejectedCount = findingEvals.filter((e) => !e.retain).length;

  if (rejectedCount > 0) {
    criticFindings.push({
      id: 'critic-rejections',
      title: `${rejectedCount} finding(s) rejected by quality gate`,
      description: `${rejectedCount} of ${findingEvals.length} findings did not meet confidence threshold.`,
      confidence: 0.95,
      source: 'critic',
    });
  }

  // Check for missing domain context
  if (context.domain === 'general' && plan.steps.length > 2) {
    criticFindings.push({
      id: 'critic-domain-ambiguity',
      title: 'Domain ambiguity with multi-step plan',
      description: 'Request classified as general but plan has multiple steps; domain may be misclassified.',
      confidence: 0.6,
      source: 'critic',
    });
  }

  const qualityScore = Math.max(
    0,
    Math.min(1, (planEval.score + (retainedCount / Math.max(1, findingEvals.length))) / 2)
  );

  return {
    evaluation: {
      qualityScore,
      evaluations: findingEvals,
      findings: criticFindings,
      warnings: planEval.warnings,
    },
    trace: {
      stage: 'critic',
      engineId: 'lari-critic',
      durationMs: Date.now() - t0,
      inputSummary: `plan.steps=${plan.steps.length}, findings=${upstreamFindings.length}`,
      outputSummary: `quality=${qualityScore.toFixed(2)}, retained=${retainedCount}, rejected=${rejectedCount}`,
    },
  };
}
