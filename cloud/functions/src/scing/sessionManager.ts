/**
 * Scing Cloud Core — Session Manager
 *
 * Firestore-backed session lifecycle: create, restore, message append,
 * history retrieval, and context patching. Uses Firebase Admin SDK only.
 *
 * Collections:
 *   scingSessions/{sessionId}            — session metadata
 *   scingSessions/{sessionId}/messages/{} — ordered conversation messages
 */

import * as admin from 'firebase-admin';
import {
  ScingSession,
  ScingSessionCreate,
  ScingSessionStatus,
  ScingMessage,
  ScingMessageAppend,
} from './types';

const db = () => admin.firestore();

const SESSIONS_COL = 'scingSessions';
const MESSAGES_SUB = 'messages';

// ---------------------------------------------------------------------------
// Session lifecycle
// ---------------------------------------------------------------------------

/**
 * Create a new Scing session for the given user.
 * Returns the Firestore-generated session ID.
 */
export async function createSession(params: ScingSessionCreate): Promise<string> {
  const ref = db().collection(SESSIONS_COL).doc();
  const session: Omit<ScingSession, 'id'> = {
    userId: params.userId,
    title: params.title || 'Untitled Session',
    status: 'active',
    context: params.context ?? {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await ref.set(session);
  return ref.id;
}

/**
 * Restore an existing session. Validates that the caller owns it.
 * Throws if session does not exist or ownership check fails.
 */
export async function getSession(sessionId: string, userId: string): Promise<ScingSession> {
  const snap = await db().collection(SESSIONS_COL).doc(sessionId).get();
  if (!snap.exists) {
    throw new Error(`Session ${sessionId} not found.`);
  }
  const data = snap.data() as Omit<ScingSession, 'id'>;
  if (data.userId !== userId) {
    throw new Error('Session ownership validation failed.');
  }
  return { id: snap.id, ...data };
}

/**
 * Update session status.
 */
export async function setSessionStatus(
  sessionId: string,
  status: ScingSessionStatus,
): Promise<void> {
  await db()
    .collection(SESSIONS_COL)
    .doc(sessionId)
    .update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}

/**
 * Patch session context metadata (shallow merge).
 */
export async function updateSessionContext(
  sessionId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const prefixed: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    prefixed[`context.${k}`] = v;
  }
  prefixed['updatedAt'] = admin.firestore.FieldValue.serverTimestamp();
  await db().collection(SESSIONS_COL).doc(sessionId).update(prefixed);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

/**
 * Append a message to the session's message subcollection.
 * Returns the Firestore-generated message ID.
 */
export async function appendMessage(params: ScingMessageAppend): Promise<string> {
  const ref = db()
    .collection(SESSIONS_COL)
    .doc(params.sessionId)
    .collection(MESSAGES_SUB)
    .doc();

  await ref.set({
    sessionId: params.sessionId,
    role: params.role,
    content: params.content,
    toolCalls: params.toolCalls ?? [],
    auditRef: params.auditRef ?? null,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Touch session updatedAt
  await db()
    .collection(SESSIONS_COL)
    .doc(params.sessionId)
    .update({ updatedAt: admin.firestore.FieldValue.serverTimestamp() });

  return ref.id;
}

/**
 * Retrieve recent messages from a session, ordered oldest-first.
 */
export async function getHistory(
  sessionId: string,
  limitCount = 50,
): Promise<ScingMessage[]> {
  const snap = await db()
    .collection(SESSIONS_COL)
    .doc(sessionId)
    .collection(MESSAGES_SUB)
    .orderBy('timestamp', 'asc')
    .limit(limitCount)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScingMessage));
}
