/**
 * activateEntitlement — Server-authoritative entitlement activation after order fulfillment.
 * UTCB-S V1.0 | BANE Gate 3 — Mutation Integrity
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 * Entitlement record creation is wired. Production requires confirmed payment_captured state.
 * CRITICAL: pending ≠ active. This function is the ONLY valid path to 'active' status.
 * Client-side optimistic entitlement state is PROHIBITED.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const activateEntitlement = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { order_id, product_id, owner_type, owner_id, actor_role, reason } = data as {
    order_id: string;
    product_id: string;
    owner_type: 'user' | 'org';
    owner_id: string;
    actor_role: string;
    reason: string;
  };

  if (!order_id || !product_id || !owner_id || !owner_type || !reason) {
    throw new functions.https.HttpsError('invalid-argument', 'order_id, product_id, owner_type, owner_id, and reason are required.');
  }

  const activationRoles = ['marketplace_admin', 'platform_super_admin', 'key_manager'];
  if (!activationRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot activate entitlements.`);
  }

  const db = admin.firestore();

  // Verify order was paid (scaffold: check payment_captured state)
  const orderSnap = await db.collection('market_orders').doc(order_id).get();
  if (!orderSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Order ${order_id} not found.`);
  }
  const order = orderSnap.data()!;
  // Production: require 'payment_captured' | 'fulfilled' — SCAFFOLD accepts pending for development
  const validOrderStates = ['payment_captured', 'fulfillment_pending', 'pending_payment']; // TODO: remove pending_payment in production
  if (!validOrderStates.includes(order.status)) {
    throw new functions.https.HttpsError('failed-precondition', `Order status '${order.status}' does not permit entitlement activation.`);
  }

  // Fetch product for entitlement scope
  const productSnap = await db.collection('market_products').doc(product_id).get();
  if (!productSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Product ${product_id} not found.`);
  }
  const product = productSnap.data()!;
  const entitlementScope = product.entitlement_scope ?? {};
  const now = new Date();
  const expiresAt = entitlementScope.access_duration_days
    ? new Date(now.getTime() + entitlementScope.access_duration_days * 86400000).toISOString()
    : null;

  const batch = db.batch();

  const entitlementRef = db.collection('market_entitlements').doc();
  batch.set(entitlementRef, {
    owner_type,
    owner_id,
    source_order_id: order_id,
    source_product_id: product_id,
    status: 'active',
    feature_flags: entitlementScope.feature_flags ?? [],
    issued_at: now.toISOString(),
    expires_at: expiresAt,
    renewal_state: entitlementScope.renewable ? 'auto_renew' : 'none',
    audit_event_id: 'pending_audit_write',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update order to fulfilled
  batch.update(db.collection('market_orders').doc(order_id), {
    status: 'fulfilled',
    entitlement_ref: entitlementRef.id,
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'entitlement_record',
    entity_id: entitlementRef.id,
    event_type: 'entitlement_activated',
    after_state_ref: 'active',
    reason,
    bane_gate_passed: 'gate_3_mutation_integrity',
    policy_version: POLICY_VERSION,
    metadata: { order_id, product_id, owner_type, owner_id, expires_at: expiresAt },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  await entitlementRef.update({ audit_event_id: auditRef.id });

  return {
    ok: true,
    entitlement_id: entitlementRef.id,
    status: 'active',
    feature_flags: entitlementScope.feature_flags ?? [],
    expires_at: expiresAt,
    audit_event_id: auditRef.id,
  };
});
