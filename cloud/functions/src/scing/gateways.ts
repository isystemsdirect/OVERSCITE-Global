import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * UTCB-S (STRICT) GATEWAY: scing_record_asset
 * Replaces direct firestore().collection('assets').add()
 */
export const scing_record_asset = functions.https.onCall(async (data, context) => {
  const { traceId, uid } = await enforceBaneCallable({
    name: 'scing_record_asset',
    data,
    ctx: context
  });

  const assetData = {
    ...data,
    owner_id: uid,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    _utc_at: Date.now(),
    _bane_trace: traceId,
    _governance_status: 'RECORDED'
  };

  const ref = await admin.firestore().collection('assets').add(assetData);
  
  return {
    ok: true,
    id: ref.id,
    traceId
  };
});

/**
 * UTCB-S (STRICT) GATEWAY: scing_log_security_event
 * Replaces direct firestore().collection('security_events').add()
 */
export const scing_log_security_event = functions.https.onCall(async (data, context) => {
  const { traceId, uid } = await enforceBaneCallable({
    name: 'scing_log_security_event',
    data,
    ctx: context
  });

  const eventData = {
    ...data,
    reporter_id: uid,
    occurred_at: admin.firestore.FieldValue.serverTimestamp(),
    _utc_at: Date.now(),
    _bane_trace: traceId,
    _protocol: 'UTCB-S'
  };

  await admin.firestore().collection('security_events').add(eventData);

  return {
    ok: true,
    traceId
  };
});

/**
 * UTCB-S (STRICT) GATEWAY: scing_update_integrity_status
 * Governance-only status updates
 */
export const scing_update_integrity_status = functions.https.onCall(async (data, context) => {
  const { traceId } = await enforceBaneCallable({
    name: 'scing_update_integrity_status',
    data,
    ctx: context
  });

  // Example implementation for system health updates
  await admin.firestore().collection('system_status').doc('integrity').set({
    last_verified: Date.now(),
    traceId,
    status: data.status || 'OK'
  }, { merge: true });

  return { ok: true, traceId };
});

/**
 * UTCB-S (STRICT) GATEWAY: scing_create_conversation_session
 */
export const scing_create_conversation_session = functions.https.onCall(async (data, context) => {
  const { traceId, uid } = await enforceBaneCallable({
    name: 'scing_create_conversation_session',
    data,
    ctx: context
  });

  const sessionData = {
    ...data,
    userId: uid,
    startTime: admin.firestore.FieldValue.serverTimestamp(),
    messageCount: 0,
    _utc_at: Date.now(),
    _bane_trace: traceId
  };

  const ref = await admin.firestore().collection('conversationSessions').add(sessionData);
  return { ok: true, id: ref.id, traceId };
});

/**
 * UTCB-S (STRICT) GATEWAY: scing_record_conversation_message
 */
export const scing_record_conversation_message = functions.https.onCall(async (data, context) => {
  const { traceId, uid } = await enforceBaneCallable({
    name: 'scing_record_conversation_message',
    data,
    ctx: context
  });

  const { sessionId, type, content, metadata } = data;

  const messageData = {
    sessionId,
    userId: uid,
    type,
    content,
    metadata: metadata || {},
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    _utc_at: Date.now(),
    _bane_trace: traceId
  };

  const msgRef = await admin.firestore().collection('conversations').add(messageData);

  // Atomic increment for message count
  const sessionRef = admin.firestore().collection('conversationSessions').doc(sessionId);
  await sessionRef.update({
    messageCount: admin.firestore.FieldValue.increment(1),
    lastActivity: admin.firestore.FieldValue.serverTimestamp()
  });

  return { ok: true, id: msgRef.id, traceId };
});

/**
 * UTCB-S (STRICT) GATEWAY: scing_end_conversation_session
 */
export const scing_end_conversation_session = functions.https.onCall(async (data, context) => {
  const { traceId } = await enforceBaneCallable({
    name: 'scing_end_conversation_session',
    data,
    ctx: context
  });

  const { sessionId } = data;
  const sessionRef = admin.firestore().collection('conversationSessions').doc(sessionId);
  await sessionRef.update({
    endTime: admin.firestore.FieldValue.serverTimestamp(),
    _utc_end: Date.now(),
    _bane_trace: traceId
  });

  return { ok: true, traceId };
});
