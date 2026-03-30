/**
 * LARI Pipeline Engine — Planner
 *
 * Decomposes requests into ordered reasoning steps.
 * Wraps existing scing/lari/planner/ modules into the pipeline facade.
 *
 * Canon constraints:
 * - Stateless per invocation.
 * - No tool execution, no database access, no governance authority.
 * - Returns a plan; does NOT execute it.
 */

import type {
  LariPipelineRequest,
  LariPipelineFinding,
  LariStageTrace,
} from '../contracts';
import type { ContextEnrichment } from './context';

// ---------------------------------------------------------------------------
// Plan Types
// ---------------------------------------------------------------------------

export interface PlanStep {
  /** Step ordinal (1-based). */
  order: number;
  /** Brief description of what this step accomplishes. */
  description: string;
  /** Engine or capability required for this step. */
  requiredCapability: string;
  /** Dependencies on prior steps (by ordinal). */
  dependsOn: number[];
}

export interface PlanOutput {
  /** Ordered steps for the reasoning task. */
  steps: PlanStep[];
  /** Estimated complexity (1–5 scale). */
  complexity: number;
  /** Planner-generated findings to carry forward. */
  findings: LariPipelineFinding[];
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/**
 * Decompose a request into reasoning steps based on context enrichment.
 */
function buildPlan(
  request: LariPipelineRequest,
  context: ContextEnrichment
): PlanOutput {
  const steps: PlanStep[] = [];
  const findings: LariPipelineFinding[] = [];

  // Universal first step: understand intent
  steps.push({
    order: 1,
    description: 'Parse and classify user intent.',
    requiredCapability: 'language',
    dependsOn: [],
  });

  // Domain-specific decomposition
  switch (context.domain) {
    case 'inspection':
      steps.push(
        {
          order: 2,
          description: 'Identify inspection scope and defect categories.',
          requiredCapability: 'domain-knowledge',
          dependsOn: [1],
        },
        {
          order: 3,
          description: 'Evaluate findings against applicable codes and standards.',
          requiredCapability: 'compliance-check',
          dependsOn: [2],
        },
        {
          order: 4,
          description: 'Synthesize inspection assessment.',
          requiredCapability: 'synthesis',
          dependsOn: [2, 3],
        }
      );
      break;

    case 'compliance':
      steps.push(
        {
          order: 2,
          description: 'Identify applicable codes and regulatory references.',
          requiredCapability: 'domain-knowledge',
          dependsOn: [1],
        },
        {
          order: 3,
          description: 'Cross-reference request against code requirements.',
          requiredCapability: 'compliance-check',
          dependsOn: [2],
        }
      );
      break;

    case 'reporting':
      steps.push(
        {
          order: 2,
          description: 'Gather and structure relevant data for report.',
          requiredCapability: 'data-aggregation',
          dependsOn: [1],
        },
        {
          order: 3,
          description: 'Generate report narrative.',
          requiredCapability: 'synthesis',
          dependsOn: [2],
        }
      );
      break;

    default:
      steps.push({
        order: 2,
        description: 'Process general query with available context.',
        requiredCapability: 'general-reasoning',
        dependsOn: [1],
      });
  }

  // High-keyword requests indicate complexity
  const complexity = Math.min(5, Math.ceil(context.keywords.length / 4));

  if (complexity >= 4) {
    findings.push({
      id: 'planner-high-complexity',
      title: 'High-complexity request detected',
      description: `Request contains ${context.keywords.length} significant keywords across ${steps.length} planned steps.`,
      confidence: 0.8,
      source: 'planner',
    });
  }

  return { steps, complexity, findings };
}

/**
 * Run the planner engine.
 */
export function runPlannerEngine(
  request: LariPipelineRequest,
  context: ContextEnrichment
): { plan: PlanOutput; trace: LariStageTrace } {
  const t0 = Date.now();
  const plan = buildPlan(request, context);

  return {
    plan,
    trace: {
      stage: 'planner',
      engineId: 'lari-planner',
      durationMs: Date.now() - t0,
      inputSummary: `domain=${context.domain}, keywords=${context.keywords.length}`,
      outputSummary: `steps=${plan.steps.length}, complexity=${plan.complexity}`,
    },
  };
}
