/**
 * Scing Cloud Core — Governance Type System
 *
 * Typed contracts for the governance hardening layer.
 * These types are separable from orchestration types and define the
 * action classification, gate decision, audit receipt, and actor context
 * contracts used by the governance perimeter.
 *
 * Canon: Scing coordinates; Scing does not self-govern.
 * BANE enforces boundaries and integrity; it does not become an independent ruler.
 * Human authority remains final.
 */

// ---------------------------------------------------------------------------
// Action Classification
// ---------------------------------------------------------------------------

/**
 * Classification of an action by its operational consequence.
 * Used to determine governance gate policy level.
 *
 * - read:         No mutation. Information retrieval only.
 * - write:        Creates or updates data. Reversible.
 * - sensitive:    Involves identity, auth, config, or compliance-adjacent data.
 * - irreversible: Cannot be undone (deletes, external calls, deployments).
 */
export type ActionClassification = 'read' | 'write' | 'sensitive' | 'irreversible';

/**
 * The governance gate policy applied per classification level.
 */
export interface ClassificationPolicy {
  /** Minimum capabilities required beyond the tool's own requirement */
  requiredCapabilities: string[];
  /** Whether a governance receipt must be emitted before execution */
  requiresPreReceipt: boolean;
  /** Whether a governance receipt must be emitted after execution */
  requiresPostReceipt: boolean;
  /** Whether to emit a detailed provenance snapshot (actor + capabilities) */
  captureProvenance: boolean;
  /** Whether rate/quota limits apply */
  rateLimited: boolean;
}

// ---------------------------------------------------------------------------
// Actor Context (provenance)
// ---------------------------------------------------------------------------

/**
 * Snapshot of the actor at the time of a governance decision.
 * Captures who did what, with what capabilities, in what session.
 * Designed for later BANE SDR (Structured Decision Record) integration.
 */
export interface ActorContext {
  /** Firebase Auth UID */
  userId: string;
  /** Active Scing session ID */
  sessionId: string;
  /** Capabilities resolved at gate entry */
  capabilities: string[];
  /** IP hash if available (from Cloud Functions context) */
  ipHash?: string;
  /** Timestamp of capability resolution */
  resolvedAt: string;
}

// ---------------------------------------------------------------------------
// Action Gate Decision
// ---------------------------------------------------------------------------

/**
 * The result of an action gate evaluation.
 * Every meaningful action passes through the gate and receives a decision.
 */
export interface ActionGateDecision {
  /** Whether the action is permitted */
  permitted: boolean;
  /** Human-readable reason for the decision */
  reason: string;
  /** Classification of the evaluated action */
  classification: ActionClassification;
  /** Unique trace ID for this gate evaluation */
  traceId: string;
  /** Reference to the governance receipt document */
  receiptId: string;
  /** If denied, optional error code for structured client response */
  errorCode?: string;
}

// ---------------------------------------------------------------------------
// Governance Receipt (audit trail)
// ---------------------------------------------------------------------------

/**
 * A governance receipt is an append-only structured record of a governance
 * decision. It captures full provenance and is distinct from operational
 * audit events — receipts record *policy decisions*, events record *execution*.
 *
 * Collection: audit/scingGovernance/receipts/{receiptId}
 */
export interface GovernanceReceipt {
  /** Firestore document ID */
  id?: string;
  /** The action being governed */
  action: string;
  /** Classification determined for this action */
  classification: ActionClassification;
  /** Pre or post execution receipt */
  phase: 'pre' | 'post';
  /** Gate decision */
  decision: 'permit' | 'deny';
  /** Reason for the decision */
  reason: string;
  /** Actor context snapshot at decision time */
  actor: ActorContext;
  /** Trace ID linking to BANE enforcement layer */
  traceId: string;
  /** Additional metadata (tool input preview, error info, etc.) */
  metadata: Record<string, unknown>;
  /** Server timestamp */
  timestamp: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

// ---------------------------------------------------------------------------
// Governance Policy (configurable per deployment)
// ---------------------------------------------------------------------------

/**
 * Top-level governance policy parameters.
 * Designed for later feature-flag and staging control.
 */
export interface GovernancePolicy {
  /** Whether the action gate is active (false = audit-only mode) */
  enforceGate: boolean;
  /** Whether to emit governance receipts even in audit-only mode */
  emitReceipts: boolean;
  /** Default classification for unknown actions (fail-safe) */
  defaultClassification: ActionClassification;
  /** Per-classification policies */
  classificationPolicies: Record<ActionClassification, ClassificationPolicy>;
}
