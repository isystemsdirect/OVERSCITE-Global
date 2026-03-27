/**
 * Scing Cloud Core — Audit Emitter
 *
 * Structured event emission scaffolding for governance traceability.
 * Writes append-only events to Firestore. Designed for later BANE wrapping.
 *
 * Collection: audit/scingEvents/events/{eventId}
 */

import * as admin from 'firebase-admin';
import { createHash } from 'crypto';
import { ScingAuditEvent, ScingEventType } from './types';

const db = () => admin.firestore();

const AUDIT_COLLECTION = 'audit/scingEvents/events';

/**
 * Emit a structured Scing audit event with cryptographic lineage protection.
 * Returns the Firestore-generated event ID.
 */
export async function emitScingEvent(params: {
  type: ScingEventType;
  sessionId: string;
  userId: string;
  metadata?: Record<string, unknown>;
  /** Reference to a governance receipt ID, if action was governed */
  governanceRef?: string;
}): Promise<string> {
  const ref = db().collection(AUDIT_COLLECTION).doc();

  // Prepare metadata including governance reference
  const metadata = {
    ...params.metadata,
    ...(params.governanceRef ? { governanceRef: params.governanceRef } : {}),
  };

  // Generate SHA-256 hash for lineage protection
  // Hashing structure: type | sessionId | userId | json(metadata)
  const hashInput = `${params.type}|${params.sessionId}|${params.userId}|${JSON.stringify(
    metadata,
  )}`;
  const hash = createHash('sha256').update(hashInput).digest('hex');

  const event: Omit<ScingAuditEvent, 'id'> & { hash: string } = {
    type: params.type,
    sessionId: params.sessionId,
    userId: params.userId,
    metadata,
    hash,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(event);
  return ref.id;
}

/**
 * Emit multiple audit events in a batch with cryptographic lineage protection.
 * Returns the generated event IDs.
 */
export async function emitScingEventBatch(
  events: Array<{
    type: ScingEventType;
    sessionId: string;
    userId: string;
    metadata?: Record<string, unknown>;
  }>,
): Promise<string[]> {
  const batch = db().batch();
  const ids: string[] = [];

  for (const params of events) {
    const ref = db().collection(AUDIT_COLLECTION).doc();
    ids.push(ref.id);

    const metadata = params.metadata ?? {};
    const hashInput = `${params.type}|${params.sessionId}|${params.userId}|${JSON.stringify(
      metadata,
    )}`;
    const hash = createHash('sha256').update(hashInput).digest('hex');

    batch.set(ref, {
      type: params.type,
      sessionId: params.sessionId,
      userId: params.userId,
      metadata,
      hash,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  return ids;
}
