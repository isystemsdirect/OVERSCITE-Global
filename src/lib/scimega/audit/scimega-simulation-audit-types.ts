/**
 * @classification SCIMEGA_SIMULATION_AUDIT_TYPES
 * @authority BANE Audit Layer
 * @purpose Defines audit record types for SCIMEGA simulation lifecycle traceability.
 * @warning Audit records are observational evidence only. They do not confer execution authority.
 */

export type SCIMEGAProposalLifecycleState =
  | 'draft'
  | 'reviewed'
  | 'arc_authorized'
  | 'simulated'
  | 'rejected'
  | 'revoked'
  | 'archived';

export type SCIMEGAAuditEventType =
  | 'proposal_generated'
  | 'bane_gate_evaluated'
  | 'arc_authorization_applied'
  | 'terminal_simulation_generated'
  | 'telemetry_trust_state_changed'
  | 'operator_review_action'
  | 'lifecycle_state_transition'
  | 'boundary_acknowledgment';

export interface SCIMEGAAuditEvent {
  eventId: string;
  eventType: SCIMEGAAuditEventType;
  timestamp: string;
  proposalId: string;
  actor: string;
  detail: string;
  priorHash: string;
  eventHash: string;
}

export interface SCIMEGAOperatorReviewAction {
  actionId: string;
  proposalId: string;
  operator: string;
  action: 'acknowledged' | 'flagged' | 'deferred' | 'rejected';
  checklistItemId: string;
  timestamp: string;
  notes: string;
}

export interface SCIMEGASimulationAuditRecord {
  proposalId: string;
  lifecycleState: SCIMEGAProposalLifecycleState;
  events: SCIMEGAAuditEvent[];
  operatorActions: SCIMEGAOperatorReviewAction[];
  boundaryAcknowledged: boolean;
  createdAt: string;
  lastUpdatedAt: string;
}
