/**
 * @fileOverview Method Graph Audit — Forensic Event Factory
 * @domain Inspections / Methodology / Audit
 * @canonical true
 * @status Phase 2 Implementation
 *
 * Produces cryptographically chained ForensicAuditEntry events for
 * every state transition in the method graph execution lifecycle.
 * Uses SHA-256 chain-hashing consistent with existing BANE audit patterns.
 */

import type { ForensicAuditEntry, MutationClass } from '@/lib/types';
import type { WorkflowInstance } from '../inspections/methods/contracts';
import { hashContent } from '@/lib/docuscribe/types';

// ─── Audit Chain State ───────────────────────────────────────────────

let lastEventHash: string = 'GENESIS';

/**
 * Core audit event builder. All graph audit events pass through here
 * to ensure chain integrity and consistent structure.
 */
async function buildAuditEvent(
  mutationClass: MutationClass,
  actor: string,
  instance: WorkflowInstance,
  details: {
    linkedEntityType?: string;
    linkedEntityId?: string;
    truthStateBefore?: unknown;
    truthStateAfter?: unknown;
    chainOfCustodyNotes?: string;
  }
): Promise<ForensicAuditEntry> {
  const eventId = `mge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();
  const priorHash = lastEventHash;

  const checksumInput = `${eventId}:${mutationClass}:${timestamp}:${priorHash}`;
  const eventHash = await hashContent(checksumInput);
  lastEventHash = eventHash;

  return {
    event_id: eventId,
    prior_event_hash: priorHash,
    event_hash: eventHash,
    checksum: await hashContent(`${eventHash}:${actor}:${instance.instanceId}`),
    timestamp,
    actor_type: 'human',
    actor_id: actor,
    role: 'inspector',
    policy_version: '1.0.0',
    engine_version: '2.0.0',
    success_state: true,
    mutation_class: mutationClass,
    linkedEntityType: details.linkedEntityType || instance.linkedEntityType,
    linkedEntityId: details.linkedEntityId || instance.linkedEntityId,
    linkedMethodId: instance.methodId,
    truthStateBefore: details.truthStateBefore,
    truthStateAfter: details.truthStateAfter,
    provenance: {
      source: 'MethodGraphEngine',
      origin_id: instance.instanceId,
      chain_of_custody_notes: details.chainOfCustodyNotes,
    },
  };
}

// ─── Public Audit Emitters ───────────────────────────────────────────

export async function emitGraphInitialized(
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('method_graph_initialized', actor, instance, {
    truthStateAfter: { status: instance.status, nodeCount: Object.keys(instance.nodeStates).length },
    chainOfCustodyNotes: `Graph ${instance.methodId}@${instance.graphVersion} initialized`,
  });
}

export async function emitNodeStarted(
  nodeId: string,
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('node_started', actor, instance, {
    linkedEntityId: nodeId,
    truthStateBefore: 'ready',
    truthStateAfter: 'in_progress',
    chainOfCustodyNotes: `Node ${nodeId} transitioned to in_progress`,
  });
}

export async function emitNodeCompleted(
  nodeId: string,
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('node_completed', actor, instance, {
    linkedEntityId: nodeId,
    truthStateBefore: 'in_progress',
    truthStateAfter: 'completed',
    chainOfCustodyNotes: `Node ${nodeId} completed by ${actor}`,
  });
}

export async function emitNodeBlocked(
  nodeId: string,
  reason: string,
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('node_blocked', actor, instance, {
    linkedEntityId: nodeId,
    truthStateAfter: 'blocked',
    chainOfCustodyNotes: `Node ${nodeId} blocked: ${reason}`,
  });
}

export async function emitBranchOpened(
  branchEdgeIds: string[],
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('branch_opened', actor, instance, {
    chainOfCustodyNotes: `Parallel branches opened: ${branchEdgeIds.join(', ')}`,
  });
}

export async function emitBranchClosed(
  branchEdgeIds: string[],
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('branch_closed', actor, instance, {
    chainOfCustodyNotes: `Parallel branches closed: ${branchEdgeIds.join(', ')}`,
  });
}

export async function emitGraphCompleted(
  instance: WorkflowInstance,
  actor: string
): Promise<ForensicAuditEntry> {
  return buildAuditEvent('graph_completed', actor, instance, {
    truthStateBefore: { status: 'active' },
    truthStateAfter: { status: 'completed' },
    chainOfCustodyNotes: `Graph ${instance.methodId} execution completed`,
  });
}

/**
 * Resets the audit chain (for testing purposes only).
 */
export function resetAuditChain(): void {
  lastEventHash = 'GENESIS';
}
