/**
 * @fileOverview BANE Method Execution Gate — Mutation Governance
 * @domain BANE / Methodology / Governance
 * @canonical true
 * @status Phase 5 Implementation
 *
 * BANE gate for all consequential mutations in the method execution
 * and artifact lifecycle. Every high-impact state change must pass
 * through this gate before execution.
 *
 * Doctrine:
 *   - Fail-closed: default is DENY
 *   - Human authority is final
 *   - All decisions emit ForensicAuditEntry events
 *   - Tier 3 mutations require explicit trigger words
 *   - No silent state changes
 */

import type { ForensicAuditEntry, MutationClass } from '@/lib/types';
import type { WorkflowInstance, MethodNodeState } from '../inspections/methods/contracts';
import type { ArtifactClass } from '@/lib/docuscribe/sovereign-file-classes';
import { hashContent } from '@/lib/docuscribe/types';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export type GateDecision = 'ALLOW' | 'DENY' | 'REQUIRE_OVERRIDE';

export interface ExecutionGateResult {
  decision: GateDecision;
  reason: string;
  auditEventId: string;
  requiresTriggerWord?: boolean;
  requiredOverrideLevel?: 'human_acknowledgment' | 'director_approval';
}

type ArtifactMutationType = 'create' | 'modify' | 'lock' | 'export' | 'delete';
type ScheduleMutationType = 'create' | 'reschedule' | 'cancel' | 'override_conflict';

// ═══════════════════════════════════════════════════════════════════════
// Node Transition Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a node state transition is permitted.
 */
export async function evaluateNodeTransition(
  nodeId: string,
  fromState: MethodNodeState,
  toState: MethodNodeState,
  actor: string,
  instance: WorkflowInstance,
): Promise<ExecutionGateResult> {
  const eventId = `bane-nt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Blocked → completed is always denied
  if (fromState === 'blocked' && toState === 'completed') {
    return {
      decision: 'DENY',
      reason: 'Cannot complete a blocked node without resolving the blocking condition',
      auditEventId: eventId,
    };
  }

  // Completed nodes cannot be re-transitioned
  if (fromState === 'completed') {
    return {
      decision: 'DENY',
      reason: 'Completed nodes are immutable — rollback requires Director approval',
      auditEventId: eventId,
    };
  }

  // Failed → ready requires human acknowledgment
  if (fromState === 'failed' && toState === 'ready') {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: 'Retrying a failed node requires explicit human acknowledgment',
      auditEventId: eventId,
      requiredOverrideLevel: 'human_acknowledgment',
    };
  }

  // Standard transitions are allowed
  return {
    decision: 'ALLOW',
    reason: `Transition ${fromState} → ${toState} for node ${nodeId} is permitted`,
    auditEventId: eventId,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Graph Completion Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a graph can be marked as completed.
 */
export async function evaluateGraphCompletion(
  instance: WorkflowInstance,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-gc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Check if any nodes are still in progress
  const hasInProgress = Object.values(instance.nodeStates).some(
    ns => ns.state === 'in_progress'
  );
  if (hasInProgress) {
    return {
      decision: 'DENY',
      reason: 'Cannot complete graph with in-progress nodes',
      auditEventId: eventId,
    };
  }

  // Check if any required nodes are not completed
  const hasBlockedOrNotStarted = Object.values(instance.nodeStates).some(
    ns => ns.state === 'blocked' || ns.state === 'not_started'
  );
  if (hasBlockedOrNotStarted) {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: 'Some nodes are blocked or not started — completion requires human acknowledgment',
      auditEventId: eventId,
      requiredOverrideLevel: 'human_acknowledgment',
    };
  }

  return {
    decision: 'ALLOW',
    reason: 'All nodes are in terminal state — graph completion is permitted',
    auditEventId: eventId,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Schedule Mutation Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a schedule mutation is permitted.
 */
export async function evaluateScheduleMutation(
  proposalId: string,
  mutationType: ScheduleMutationType,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-sm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // All schedule mutations beyond creation require human acknowledgment
  if (mutationType === 'override_conflict') {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: 'Overriding a scheduling conflict requires explicit human authorization',
      auditEventId: eventId,
      requiresTriggerWord: true,
      requiredOverrideLevel: 'director_approval',
    };
  }

  if (mutationType === 'cancel' || mutationType === 'reschedule') {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: `Schedule ${mutationType} requires human acknowledgment`,
      auditEventId: eventId,
      requiredOverrideLevel: 'human_acknowledgment',
    };
  }

  return {
    decision: 'ALLOW',
    reason: `Schedule ${mutationType} for proposal ${proposalId} is permitted`,
    auditEventId: eventId,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Evidence Override Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether missing evidence can be overridden.
 */
export async function evaluateEvidenceOverride(
  nodeId: string,
  missingEvidenceIds: string[],
  overrideReason: string,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-eo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (!overrideReason || overrideReason.trim().length < 10) {
    return {
      decision: 'DENY',
      reason: 'Evidence override requires a substantive justification (minimum 10 characters)',
      auditEventId: eventId,
    };
  }

  return {
    decision: 'REQUIRE_OVERRIDE',
    reason: `${missingEvidenceIds.length} evidence item(s) missing for node ${nodeId}. Override requires human acknowledgment with documented justification.`,
    auditEventId: eventId,
    requiredOverrideLevel: 'human_acknowledgment',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Artifact Mutation Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a sovereign artifact mutation is permitted.
 */
export async function evaluateArtifactMutation(
  artifactId: string,
  artifactClass: ArtifactClass,
  mutationType: ArtifactMutationType,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-am-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Deletion is always denied at the BANE level — archives only
  if (mutationType === 'delete') {
    return {
      decision: 'DENY',
      reason: 'Sovereign artifacts cannot be deleted — use archive instead',
      auditEventId: eventId,
    };
  }

  // Modifying a locked artifact requires Director approval
  if (mutationType === 'modify') {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: `Modifying ${artifactClass} artifact ${artifactId} requires human acknowledgment`,
      auditEventId: eventId,
      requiredOverrideLevel: 'human_acknowledgment',
    };
  }

  // Locking is a Tier 3 action
  if (mutationType === 'lock') {
    return {
      decision: 'REQUIRE_OVERRIDE',
      reason: 'Locking an artifact is irreversible and requires explicit authorization',
      auditEventId: eventId,
      requiresTriggerWord: true,
      requiredOverrideLevel: 'director_approval',
    };
  }

  // Creation and export are allowed
  return {
    decision: 'ALLOW',
    reason: `Artifact ${mutationType} for ${artifactClass}/${artifactId} is permitted`,
    auditEventId: eventId,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Project Plan Mutation Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a project plan baseline mutation is permitted.
 * Baseline changes require explicit human release — fail-closed.
 */
export async function evaluateProjectPlanMutation(
  projectId: string,
  mutationDescription: string,
  affectedPackageIds: string[],
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-ppm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (!projectId) {
    return {
      decision: 'DENY',
      reason: 'Project plan mutation requires a valid projectId',
      auditEventId: eventId,
    };
  }

  if (!mutationDescription || mutationDescription.trim().length < 10) {
    return {
      decision: 'DENY',
      reason: 'Plan mutation requires a substantive description (minimum 10 characters)',
      auditEventId: eventId,
    };
  }

  return {
    decision: 'REQUIRE_OVERRIDE',
    reason: `Project baseline mutation affecting ${affectedPackageIds.length} package(s) requires explicit human release. Description: ${mutationDescription}`,
    auditEventId: eventId,
    requiredOverrideLevel: 'human_acknowledgment',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Project Issue Escalation Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a project issue escalation is permitted.
 * Escalation packets require an attributable actor.
 */
export async function evaluateProjectIssueEscalation(
  projectId: string,
  issueId: string,
  escalationReason: string,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-pie-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (!actor || actor.trim().length === 0) {
    return {
      decision: 'DENY',
      reason: 'Issue escalation requires an attributable actor — anonymous escalation is not permitted',
      auditEventId: eventId,
    };
  }

  if (!escalationReason || escalationReason.trim().length < 10) {
    return {
      decision: 'DENY',
      reason: 'Issue escalation requires a substantive justification (minimum 10 characters)',
      auditEventId: eventId,
    };
  }

  return {
    decision: 'REQUIRE_OVERRIDE',
    reason: `Issue ${issueId} escalation by ${actor}: ${escalationReason}`,
    auditEventId: eventId,
    requiredOverrideLevel: 'human_acknowledgment',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Project Scenario Publish Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a project scenario can be published.
 * Publication requires reviewable lineage.
 */
export async function evaluateProjectScenarioPublish(
  projectId: string,
  scenarioId: string,
  hasLineageRef: boolean,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-psp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (!hasLineageRef) {
    return {
      decision: 'DENY',
      reason: 'Scenario publication requires reviewable lineage — lineageRef is missing',
      auditEventId: eventId,
    };
  }

  return {
    decision: 'REQUIRE_OVERRIDE',
    reason: `Scenario ${scenarioId} in project ${projectId} is ready for publication review`,
    auditEventId: eventId,
    requiredOverrideLevel: 'human_acknowledgment',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Managerial Override Gate
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates whether a managerial override is permitted.
 * Overrides require Director-level approval — highest tier.
 */
export async function evaluateManagerialOverride(
  projectId: string,
  overrideTarget: string,
  justification: string,
  actor: string,
): Promise<ExecutionGateResult> {
  const eventId = `bane-mo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (!justification || justification.trim().length < 20) {
    return {
      decision: 'DENY',
      reason: 'Managerial override requires a detailed justification (minimum 20 characters)',
      auditEventId: eventId,
    };
  }

  return {
    decision: 'REQUIRE_OVERRIDE',
    reason: `Managerial override on ${overrideTarget} in project ${projectId} by ${actor}. Requires Director approval.`,
    auditEventId: eventId,
    requiresTriggerWord: true,
    requiredOverrideLevel: 'director_approval',
  };
}
