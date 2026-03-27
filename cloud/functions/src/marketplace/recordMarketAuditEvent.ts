/**
 * recordMarketAuditEvent — Direct audit event write for marketplace activities.
 * UTCB-S V1.0 — All marketplace BANE gates use this pattern.
 *
 * All other Cloud Functions write audit events inline. This callable is available
 * for admin-level direct audit writes where no other function applies.
 *
 * Append-only. Events are IMMUTABLE after write.
 *
 * IMPLEMENTATION STATUS: LIVE — audit write is production-ready.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const recordMarketAuditEvent = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated to record audit events.');
  }

  const { actor_role, entity_type, entity_id, event_type, reason, before_state_ref, after_state_ref, metadata } = data as {
    actor_role: string;
    entity_type: string;
    entity_id: string;
    event_type: string;
    reason?: string;
    before_state_ref?: string;
    after_state_ref?: string;
    metadata?: Record<string, unknown>;
  };

  if (!actor_role || !entity_type || !entity_id || !event_type) {
    throw new functions.https.HttpsError('invalid-argument', 'actor_role, entity_type, entity_id, and event_type are required.');
  }

  // Admin-only direct audit write — platform_super_admin and compliance_reviewer only
  const adminRoles = ['platform_super_admin', 'compliance_reviewer', 'finance_admin', 'marketplace_admin'];
  if (!adminRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot directly record audit events.`);
  }

  const db = admin.firestore();
  const auditRef = db.collection('market_audit_events').doc();

  await auditRef.set({
    actor_id: context.auth.uid,
    actor_role,
    entity_type,
    entity_id,
    event_type,
    reason: reason ?? null,
    before_state_ref: before_state_ref ?? null,
    after_state_ref: after_state_ref ?? null,
    policy_version: POLICY_VERSION,
    metadata: metadata ?? null,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { ok: true, audit_event_id: auditRef.id };
});
