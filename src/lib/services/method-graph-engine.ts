/**
 * @fileOverview Method Graph Engine — SCINGULAR™ Methodology Stack
 * @domain Inspections / Methodology / Workflow
 * @canonical true
 * @status Phase 2 Implementation
 *
 * Engine for executing governed method graphs. Handles state transitions,
 * dependency evaluation, parallel branch activation, completion gating,
 * failed-state propagation, evidence validation, and audit emission.
 *
 * Doctrine:
 *   - Every state transition emits a ForensicAuditEntry
 *   - Blocked nodes cannot be completed
 *   - Required evidence must be captured before completion
 *   - Completion gates require all upstream paths to finish
 *   - Failed nodes propagate blocking to downstream hard dependencies
 */

import {
  MethodGraph,
  MethodNode,
  WorkflowInstance,
  MethodNodeState,
  MethodBlockReasonCode,
} from '../inspections/methods/contracts';
import {
  emitGraphInitialized,
  emitNodeStarted,
  emitNodeCompleted,
  emitNodeBlocked,
  emitBranchOpened,
  emitGraphCompleted,
} from './method-graph-audit';
import type { ForensicAuditEntry } from '@/lib/types';

/**
 * Transition validation result.
 */
export interface TransitionResult {
  success: boolean;
  reason?: string;
  auditEvent?: ForensicAuditEntry;
}

export class MethodGraphEngine {
  /**
   * Initializes a new workflow instance from a method graph.
   * Emits a `method_graph_initialized` audit event.
   */
  static async initializeInstance(
    graph: MethodGraph,
    entityType: 'PIP' | 'CIP' | 'Project',
    entityId: string,
    actor: string
  ): Promise<{ instance: WorkflowInstance; auditEvent: ForensicAuditEntry }> {
    const nodeStates: WorkflowInstance['nodeStates'] = {};

    graph.nodes.forEach(node => {
      nodeStates[node.nodeId] = {
        state: 'not_started' as MethodNodeState,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
      };
    });

    const instance: WorkflowInstance = {
      instanceId: `wf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      methodId: graph.methodId,
      graphVersion: graph.version,
      linkedEntityType: entityType,
      linkedEntityId: entityId,
      currentNodeIds: graph.entryNodeIds,
      nodeStates,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedBy: actor,
      status: 'active',
      lastAuditEventId: '',
      evidenceCaptured: {},
      phaseCompletions: {},
      artifactBindings: {},
    };

    // Evaluate ready states for entry nodes
    this.evaluateGraph(instance, graph);

    // Emit initialization audit event
    const auditEvent = await emitGraphInitialized(instance, actor);
    instance.lastAuditEventId = auditEvent.event_id;

    // Detect and report parallel branch openings
    const parallelEdges = graph.edges.filter(e => e.edgeType === 'parallel_branch');
    if (parallelEdges.length > 0) {
      await emitBranchOpened(
        parallelEdges.map(e => e.edgeId),
        instance,
        actor
      );
    }

    return { instance, auditEvent };
  }

  /**
   * Refreshes the state of all nodes based on current completions and dependencies.
   * Deterministic — iterates until no further state changes occur.
   */
  static evaluateGraph(instance: WorkflowInstance, graph: MethodGraph): void {
    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 50;

    while (changed && iterations < MAX_ITERATIONS) {
      changed = false;
      iterations++;

      graph.nodes.forEach(node => {
        const currentState = instance.nodeStates[node.nodeId];
        if (
          currentState.state === 'completed' ||
          currentState.state === 'skipped_by_rule' ||
          currentState.state === 'failed'
        ) {
          return;
        }

        const newState = this.evaluateNodeState(node.nodeId, instance, graph);

        if (newState.state !== currentState.state || newState.reasonCode !== currentState.reasonCode) {
          instance.nodeStates[node.nodeId] = {
            ...currentState,
            state: newState.state,
            reasonCode: newState.reasonCode,
            updatedAt: new Date().toISOString(),
          };
          changed = true;
        }
      });
    }

    // Update active frontier
    instance.currentNodeIds = graph.nodes
      .filter(n => ['ready', 'in_progress', 'blocked'].includes(instance.nodeStates[n.nodeId].state))
      .map(n => n.nodeId);

    // Detect instance completion
    const allTerminal = graph.nodes.every(n => {
      const state = instance.nodeStates[n.nodeId].state;
      return state === 'completed' || state === 'skipped_by_rule';
    });

    if (allTerminal && instance.status === 'active') {
      instance.status = 'completed';
    }

    instance.updatedAt = new Date().toISOString();
  }

  /**
   * Evaluates the deterministic state of a node based on its inbound edges.
   */
  private static evaluateNodeState(
    nodeId: string,
    instance: WorkflowInstance,
    graph: MethodGraph
  ): { state: MethodNodeState; reasonCode?: MethodBlockReasonCode } {
    const inboundEdges = graph.edges.filter(e => e.toNodeId === nodeId);

    if (inboundEdges.length === 0) {
      return { state: 'ready' };
    }

    const dependencies = inboundEdges.map(edge => ({
      edgeType: edge.edgeType,
      parentState: instance.nodeStates[edge.fromNodeId]?.state || 'not_started',
    }));

    // Hard dependencies must be completed
    const hasIncompleteHardDep = dependencies.some(
      d => d.edgeType === 'hard_dependency' && d.parentState !== 'completed'
    );
    if (hasIncompleteHardDep) {
      // Check if any hard dep has failed — propagate blocking
      const hasFailedDep = dependencies.some(
        d => d.edgeType === 'hard_dependency' && d.parentState === 'failed'
      );
      return {
        state: 'blocked',
        reasonCode: hasFailedDep ? 'prerequisite_incomplete' : 'prerequisite_incomplete',
      };
    }

    // Completion gates: ALL upstream paths must complete
    const completionGateDeps = dependencies.filter(d => d.edgeType === 'completion_gate');
    if (completionGateDeps.length > 0) {
      const allGatesMet = completionGateDeps.every(d => d.parentState === 'completed');
      if (!allGatesMet) {
        return { state: 'blocked', reasonCode: 'prerequisite_incomplete' };
      }
    }

    // Parallel branches: ready if at least one parent completed
    const parallelDeps = dependencies.filter(d => d.edgeType === 'parallel_branch');
    if (parallelDeps.length > 0) {
      const anyCompleted = parallelDeps.some(d => d.parentState === 'completed');
      if (anyCompleted) return { state: 'ready' };
    }

    // Soft dependencies warn but don't block
    const hasAnyReadyOrCompletedParent = dependencies.some(
      d => d.parentState === 'completed' || d.parentState === 'ready' || d.parentState === 'in_progress'
    );
    if (hasAnyReadyOrCompletedParent) {
      return { state: 'ready' };
    }

    return { state: 'not_started' };
  }

  /**
   * Validates whether a node can be completed based on required evidence.
   */
  static canCompleteNode(
    nodeId: string,
    instance: WorkflowInstance,
    graph: MethodGraph
  ): { canComplete: boolean; missingEvidence: string[] } {
    const node = graph.nodes.find(n => n.nodeId === nodeId);
    if (!node) return { canComplete: false, missingEvidence: [] };

    const capturedForNode = instance.evidenceCaptured[nodeId] || [];
    const missingEvidence = node.requiredEvidenceIds.filter(
      eid => !capturedForNode.includes(eid)
    );

    return {
      canComplete: missingEvidence.length === 0,
      missingEvidence,
    };
  }

  /**
   * Transitions a node to a new state with validation and audit emission.
   */
  static async transitionNode(
    nodeId: string,
    newState: MethodNodeState,
    instance: WorkflowInstance,
    graph: MethodGraph,
    actor: string
  ): Promise<TransitionResult> {
    const nodeState = instance.nodeStates[nodeId];
    if (!nodeState) {
      return { success: false, reason: `Node ${nodeId} not found in instance` };
    }

    const currentState = nodeState.state;

    // ─── Transition Guards ─────────────────────────────────────────
    if (currentState === 'blocked' && newState === 'completed') {
      return { success: false, reason: 'Cannot complete a blocked node' };
    }
    if (currentState === 'not_started' && newState === 'completed') {
      return { success: false, reason: 'Cannot complete a node that has not started' };
    }
    if (currentState === 'failed' && newState !== 'ready') {
      return { success: false, reason: 'Failed nodes can only be retried (transition to ready)' };
    }
    if (currentState === 'completed') {
      return { success: false, reason: 'Completed nodes cannot be re-transitioned' };
    }

    // ─── Evidence check for completion ─────────────────────────────
    if (newState === 'completed') {
      const evidenceCheck = this.canCompleteNode(nodeId, instance, graph);
      if (!evidenceCheck.canComplete) {
        return {
          success: false,
          reason: `Missing required evidence: ${evidenceCheck.missingEvidence.join(', ')}`,
        };
      }
    }

    // ─── Apply transition ──────────────────────────────────────────
    instance.nodeStates[nodeId] = {
      ...nodeState,
      state: newState,
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
    };

    // ─── Emit audit event ──────────────────────────────────────────
    let auditEvent: ForensicAuditEntry;
    if (newState === 'in_progress') {
      auditEvent = await emitNodeStarted(nodeId, instance, actor);
    } else if (newState === 'completed') {
      auditEvent = await emitNodeCompleted(nodeId, instance, actor);
    } else if (newState === 'blocked') {
      auditEvent = await emitNodeBlocked(nodeId, nodeState.reasonCode || 'prerequisite_incomplete', instance, actor);
    } else {
      auditEvent = await emitNodeStarted(nodeId, instance, actor);
    }

    instance.nodeStates[nodeId].auditEventId = auditEvent.event_id;
    instance.lastAuditEventId = auditEvent.event_id;

    // ─── Re-evaluate graph ─────────────────────────────────────────
    this.evaluateGraph(instance, graph);

    // ─── Check for graph completion ────────────────────────────────
    if (instance.status === 'completed') {
      const completionEvent = await emitGraphCompleted(instance, actor);
      instance.lastAuditEventId = completionEvent.event_id;
    }

    return { success: true, auditEvent };
  }

  /**
   * Gets Scing-optimized guidance for the current workflow state.
   */
  static getGuidance(instance: WorkflowInstance, graph: MethodGraph): string {
    const readyNodes = graph.nodes.filter(n => instance.nodeStates[n.nodeId].state === 'ready');
    const blockedNodes = graph.nodes.filter(n => instance.nodeStates[n.nodeId].state === 'blocked');
    const inProgressNodes = graph.nodes.filter(n => instance.nodeStates[n.nodeId].state === 'in_progress');

    if (instance.status === 'completed') {
      return 'All workflow steps are complete. Ready for report generation.';
    }

    if (inProgressNodes.length > 0) {
      const titles = inProgressNodes.map(n => n.title).join(', ');
      return `Currently executing: ${titles}. Complete active steps before proceeding.`;
    }

    if (readyNodes.length > 0) {
      const titles = readyNodes.map(n => n.title).join(', ');
      return `Ready to proceed with: ${titles}. Select a node to begin capture.`;
    }

    if (blockedNodes.length > 0) {
      const blockers = blockedNodes.map(n => {
        const reason = instance.nodeStates[n.nodeId].reasonCode === 'prerequisite_incomplete'
          ? 'missing prerequisites'
          : instance.nodeStates[n.nodeId].reasonCode || 'unknown constraint';
        return `${n.title} is blocked by ${reason}`;
      }).join('; ');
      return `Workflow is restricted: ${blockers}. Resolve upstream steps first.`;
    }

    return 'Workflow initialized. Waiting for task selection.';
  }

  /**
   * Extracts the current active phase context based on in-progress/ready nodes.
   */
  static getActivePhaseContext(
    instance: WorkflowInstance,
    graph: MethodGraph
  ): { activeNodeClasses: string[]; activeNodeIds: string[]; completedCount: number; totalCount: number } {
    const activeNodeIds = graph.nodes
      .filter(n => ['ready', 'in_progress'].includes(instance.nodeStates[n.nodeId]?.state))
      .map(n => n.nodeId);

    const activeNodeClasses = graph.nodes
      .filter(n => activeNodeIds.includes(n.nodeId))
      .map(n => n.nodeClass);

    const completedCount = graph.nodes.filter(
      n => instance.nodeStates[n.nodeId]?.state === 'completed'
    ).length;

    return {
      activeNodeClasses: [...new Set(activeNodeClasses)],
      activeNodeIds,
      completedCount,
      totalCount: graph.nodes.length,
    };
  }
}
