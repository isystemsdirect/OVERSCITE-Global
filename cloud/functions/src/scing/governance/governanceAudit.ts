/**
 * Scing Cloud Core — Governance Audit
 *
 * Provenance-rich audit receipts for governance decisions.
 * Separate from operational audit events — receipts record *policy decisions*,
 * while events record *execution*.
 *
 * Collection: audit/scingGovernance/receipts/{receiptId}
 *
 * Canon: Append-only. No update or delete paths exist.
 * Designed for later BANE WORM integrity wrapping and
 * cryptographic attestation.
 */

import * as admin from 'firebase-admin';
import {
  GovernanceReceipt,
  ActorContext,
  ActionClassification,
} from './governanceTypes';

const db = () => admin.firestore();
const GOVERNANCE_COLLECTION = 'audit/scingGovernance/receipts';

// ---------------------------------------------------------------------------
// Receipt emission
// ---------------------------------------------------------------------------

/**
 * Emit a governance receipt — the permanent record of a gate decision.
 * Returns the Firestore-generated receipt ID.
 */
export async function emitGovernanceReceipt(params: {
  action: string;
  classification: ActionClassification;
  phase: 'pre' | 'post';
  decision: 'permit' | 'deny';
  reason: string;
  actor: ActorContext;
  traceId: string;
  metadata?: Record<string, unknown>;
}): Promise<string> {
  const ref = db().collection(GOVERNANCE_COLLECTION).doc();

  const receipt: Omit<GovernanceReceipt, 'id'> = {
    action: params.action,
    classification: params.classification,
    phase: params.phase,
    decision: params.decision,
    reason: params.reason,
    actor: params.actor,
    traceId: params.traceId,
    metadata: params.metadata ?? {},
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(receipt);
  return ref.id;
}

/**
 * Emit a batch of governance receipts in a single transaction.
 * Returns the generated receipt IDs.
 */
export async function emitGovernanceReceiptBatch(
  receipts: Array<{
    action: string;
    classification: ActionClassification;
    phase: 'pre' | 'post';
    decision: 'permit' | 'deny';
    reason: string;
    actor: ActorContext;
    traceId: string;
    metadata?: Record<string, unknown>;
  }>,
): Promise<string[]> {
  const batch = db().batch();
  const ids: string[] = [];

  for (const params of receipts) {
    const ref = db().collection(GOVERNANCE_COLLECTION).doc();
    ids.push(ref.id);
    batch.set(ref, {
      action: params.action,
      classification: params.classification,
      phase: params.phase,
      decision: params.decision,
      reason: params.reason,
      actor: params.actor,
      traceId: params.traceId,
      metadata: params.metadata ?? {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  return ids;
}
