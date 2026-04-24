/**
 * @fileOverview Scing Phase-Aware Guidance Engine
 * @domain Guidance / Methodology / Scing
 * @canonical true
 * @status Phase 3 Implementation
 *
 * Transforms Scing from generic conversation into a method-execution-aligned
 * operational guide. All guidance is derived from the active method graph
 * state, registered guidance hooks, and evidence requirements.
 *
 * Doctrine:
 *   - Guidance aligns with active phase only
 *   - Missing evidence detection generates contextual prompts
 *   - Step enforcement prevents unauthorized skipping
 *   - Voice-first format: concise, actionable, no HTML
 *   - No hallucinated authority — guidance reflects real state
 */

import type {
  MethodGraph,
  MethodNode,
  WorkflowInstance,
  MethodNodeState,
} from '../inspections/methods/contracts';
import type { AnalysisProfile } from '../inspections/methods/contracts';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export interface GuidancePrompt {
  type: 'phase_guidance' | 'missing_evidence' | 'step_enforcement' | 'uncertainty_disclosure';
  content: string;
  nodeId?: string;
  severity: 'info' | 'warning' | 'blocking';
  voiceOptimized: boolean;
}

export interface SkipEvaluation {
  canSkip: boolean;
  reason: string;
  overrideRequired?: 'human_acknowledgment' | 'director_approval';
}

// ═══════════════════════════════════════════════════════════════════════
// Phase Guidance
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns guidance based on the current active nodes and their phase membership.
 * Guidance hooks from the method registry are resolved and composed.
 */
export function getPhaseGuidance(
  instance: WorkflowInstance,
  graph: MethodGraph
): GuidancePrompt[] {
  const prompts: GuidancePrompt[] = [];

  const activeNodes = graph.nodes.filter(
    n => ['ready', 'in_progress'].includes(instance.nodeStates[n.nodeId]?.state)
  );

  if (activeNodes.length === 0) {
    if (instance.status === 'completed') {
      prompts.push({
        type: 'phase_guidance',
        content: 'All inspection steps are complete. You may now generate the final report.',
        severity: 'info',
        voiceOptimized: true,
      });
    } else {
      prompts.push({
        type: 'phase_guidance',
        content: 'No steps are currently active. Check for blocked dependencies.',
        severity: 'warning',
        voiceOptimized: true,
      });
    }
    return prompts;
  }

  // Build guidance for each active node
  for (const node of activeNodes) {
    const state = instance.nodeStates[node.nodeId]?.state;
    const guidance = buildNodeGuidance(node, state);
    prompts.push(guidance);
  }

  // If multiple active nodes (parallel branches), add coordination guidance
  if (activeNodes.length > 1) {
    const titles = activeNodes.map(n => n.title).join(' and ');
    prompts.push({
      type: 'phase_guidance',
      content: `Multiple steps available in parallel: ${titles}. You may work these in any order.`,
      severity: 'info',
      voiceOptimized: true,
    });
  }

  return prompts;
}

/**
 * Builds guidance for a single node based on its class and state.
 */
function buildNodeGuidance(node: MethodNode, state: MethodNodeState): GuidancePrompt {
  const prefix = state === 'in_progress' ? 'Continue with' : 'Ready to begin';

  // Class-specific guidance tone
  const classGuidance: Record<string, string> = {
    intake: 'Review property and client information before proceeding to field work.',
    setup: 'Verify equipment readiness and safety conditions.',
    capture: 'Perform field data capture. Ensure all required evidence items are documented.',
    analysis: 'Review captured data. Flag any anomalies or areas requiring further investigation.',
    verification: 'Validate findings against applicable codes and standards.',
    decision_gate: 'A decision is required before the workflow can advance.',
    report_binding: 'Bind captured evidence and analysis to the inspection report.',
    completion: 'Finalize the inspection and prepare for submission.',
  };

  const classHint = classGuidance[node.nodeClass] || '';

  return {
    type: 'phase_guidance',
    content: `${prefix}: ${node.title}. ${classHint}`.trim(),
    nodeId: node.nodeId,
    severity: 'info',
    voiceOptimized: true,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Missing Evidence Prompts
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detects which required evidence items are missing for current nodes
 * and generates contextual prompts.
 */
export function getMissingEvidencePrompts(
  instance: WorkflowInstance,
  graph: MethodGraph
): GuidancePrompt[] {
  const prompts: GuidancePrompt[] = [];

  const inProgressNodes = graph.nodes.filter(
    n => instance.nodeStates[n.nodeId]?.state === 'in_progress'
  );

  for (const node of inProgressNodes) {
    if (node.requiredEvidenceIds.length === 0) continue;

    const capturedForNode = instance.evidenceCaptured[node.nodeId] || [];
    const missing = node.requiredEvidenceIds.filter(
      eid => !capturedForNode.includes(eid)
    );

    if (missing.length > 0) {
      const evidenceList = missing.join(', ');
      prompts.push({
        type: 'missing_evidence',
        content: `${node.title} requires the following evidence before completion: ${evidenceList}. Capture these items to proceed.`,
        nodeId: node.nodeId,
        severity: 'warning',
        voiceOptimized: true,
      });
    }
  }

  return prompts;
}

// ═══════════════════════════════════════════════════════════════════════
// Step Enforcement
// ═══════════════════════════════════════════════════════════════════════

/**
 * If a user attempts to skip a required step, returns a blocking prompt
 * requiring explicit override acknowledgment.
 */
export function getStepEnforcementPrompt(
  nodeId: string,
  instance: WorkflowInstance,
  graph: MethodGraph
): GuidancePrompt | null {
  const node = graph.nodes.find(n => n.nodeId === nodeId);
  if (!node) return null;

  const nodeState = instance.nodeStates[nodeId];
  if (!nodeState) return null;

  // Only enforce on nodes that are ready or in_progress (not completed or blocked)
  if (nodeState.state !== 'ready' && nodeState.state !== 'in_progress') {
    return null;
  }

  // Check if this node has required evidence that hasn't been captured
  const capturedForNode = instance.evidenceCaptured[nodeId] || [];
  const missing = node.requiredEvidenceIds.filter(
    eid => !capturedForNode.includes(eid)
  );

  if (missing.length > 0) {
    return {
      type: 'step_enforcement',
      content: `Cannot skip ${node.title}. ${missing.length} evidence item(s) are required: ${missing.join(', ')}. To override, provide explicit acknowledgment of incomplete evidence.`,
      nodeId,
      severity: 'blocking',
      voiceOptimized: true,
    };
  }

  // Check if downstream nodes have hard dependencies on this one
  const dependents = graph.edges.filter(
    e => e.fromNodeId === nodeId && e.edgeType === 'hard_dependency'
  );
  if (dependents.length > 0) {
    const depTitles = dependents
      .map(e => graph.nodes.find(n => n.nodeId === e.toNodeId)?.title)
      .filter(Boolean)
      .join(', ');
    return {
      type: 'step_enforcement',
      content: `Skipping ${node.title} will block downstream steps: ${depTitles}. Explicit override acknowledgment is required.`,
      nodeId,
      severity: 'blocking',
      voiceOptimized: true,
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// Skip Evaluation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns whether a node can be skipped and what override is required.
 */
export function canSkipNode(
  nodeId: string,
  instance: WorkflowInstance,
  graph: MethodGraph,
): SkipEvaluation {
  const node = graph.nodes.find(n => n.nodeId === nodeId);
  if (!node) return { canSkip: false, reason: 'Node not found' };

  // Completion and report_binding nodes cannot be skipped
  if (node.nodeClass === 'completion' || node.nodeClass === 'report_binding') {
    return { canSkip: false, reason: `${node.nodeClass} nodes are mandatory and cannot be skipped` };
  }

  // Decision gates cannot be skipped
  if (node.nodeClass === 'decision_gate') {
    return { canSkip: false, reason: 'Decision gates require explicit resolution' };
  }

  // Nodes with hard dependents require human acknowledgment
  const hardDependents = graph.edges.filter(
    e => e.fromNodeId === nodeId && e.edgeType === 'hard_dependency'
  );
  if (hardDependents.length > 0) {
    return {
      canSkip: true,
      reason: 'Node has hard dependents — skipping will block downstream steps',
      overrideRequired: 'human_acknowledgment',
    };
  }

  // Soft-dependency nodes can be skipped with acknowledgment
  return {
    canSkip: true,
    reason: 'Node may be skipped with acknowledgment',
    overrideRequired: 'human_acknowledgment',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Uncertainty Disclosure
// ═══════════════════════════════════════════════════════════════════════

/**
 * When analysis confidence is reduced, generates an uncertainty
 * disclosure statement for truthful reporting.
 */
export function getUncertaintyDisclosure(
  analysisProfile: AnalysisProfile | undefined
): GuidancePrompt | null {
  if (!analysisProfile) return null;

  // Check if any confidence constraints or QA flags suggest reduced confidence
  const hasReducedConfidence =
    analysisProfile.confidenceConstraints.length > 0 ||
    analysisProfile.qaFlags.length > 0;

  if (!hasReducedConfidence) return null;

  const flagSummary = [
    ...analysisProfile.confidenceConstraints,
    ...analysisProfile.qaFlags,
  ].slice(0, 3).join('; ');

  return {
    type: 'uncertainty_disclosure',
    content: `Reduced confidence detected: ${flagSummary}. These constraints may require additional field verification or manual review before inclusion in a formal report.`,
    severity: 'warning',
    voiceOptimized: true,
  };
}
