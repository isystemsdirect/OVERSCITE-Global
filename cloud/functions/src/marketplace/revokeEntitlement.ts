/**
 * revokeEntitlement — Permanently revoke an active entitlement.
 * UTCB-S V1.0 | BANE Gate 3 — Mutation Integrity
 *
 * Revocation is IMMUTABLE. Required fields: revoked_by_arc_id, revoked_reason, audit event.
 * No silent revocations are permitted.
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const revokeEntitlement = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { entitlement_id, actor_role, reason } = data as {
    entitlement_id: string;
    actor_role: string;
    reason: string;
  };

  if (!entitlement_id || !reason) {
    throw new functions.https.HttpsError('invalid-argument', 'entitlement_id and reason are required. Revocation requires an explicit reason.');
  }

  const revocationRoles = ['marketplace_admin', 'platform_super_admin', 'key_manager', 'license_auditor', 'compliance_reviewer'];
  if (!revocationRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot revoke entitlements.`);
  }

  const db = admin.firestore();
  const entitlementRef = db.collection('market_entitlements').doc(entitlement_id);
  const entSnap = await entitlementRef.get();

  if (!entSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Entitlement ${entitlement_id} not found.`);
  }

  const ent = entSnap.data()!;
  const revokeableStates = ['active', 'trial', 'suspended'];
  if (!revokeableStates.includes(ent.status)) {
    throw new functions.https.HttpsError('failed-precondition', `Entitlement status '${ent.status}' cannot be revoked.`);
  }

  const batch = db.batch();

  batch.update(entitlementRef, {
    status: 'revoked',
    revoked_at: new Date().toISOString(),
    revoked_reason: reason,
    revoked_by_arc_id: context.auth.uid,
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'entitlement_record',
    entity_id: entitlement_id,
    event_type: 'entitlement_revoked',
    before_state_ref: ent.status,
    after_state_ref: 'revoked',
    reason,
    bane_gate_passed: 'gate_3_mutation_integrity',
    policy_version: POLICY_VERSION,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { ok: true, entitlement_id, new_status: 'revoked', audit_event_id: auditRef.id };
});
