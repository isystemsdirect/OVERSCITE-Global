/**
 * Scing Cloud Core — Governance Module
 *
 * Barrel export for the governance hardening layer.
 * Separable from orchestration logic — can be imported independently.
 */

// Type system
export type {
  ActionClassification,
  ClassificationPolicy,
  ActorContext,
  ActionGateDecision,
  GovernanceReceipt,
  GovernancePolicy,
} from './governanceTypes';

// Action classification
export {
  classifyAction,
  isClassified,
  getAllClassifications,
  DEFAULT_CLASSIFICATION_POLICIES,
  buildDefaultPolicy,
} from './actionClassification';

// Action gate
export {
  evaluateActionGate,
  emitPostGateReceipt,
  buildActorContext,
} from './actionGate';

// Governance audit
export {
  emitGovernanceReceipt,
  emitGovernanceReceiptBatch,
} from './governanceAudit';
