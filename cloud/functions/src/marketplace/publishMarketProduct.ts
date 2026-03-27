/**
 * publishMarketProduct — Publish a capability product to the Marketplace.
 * UTCB-S V1.0 | BANE Gate 1 — Listing Visibility
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const publishMarketProduct = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { product_id, actor_role } = data as { product_id: string; actor_role: string };

  if (!product_id || !actor_role) {
    throw new functions.https.HttpsError('invalid-argument', 'product_id and actor_role are required.');
  }

  const publishRoles = ['module_publisher', 'marketplace_admin', 'platform_super_admin', 'enterprise_sales_admin'];
  if (!publishRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot publish capability products.`);
  }

  const db = admin.firestore();
  const productRef = db.collection('market_products').doc(product_id);
  const productSnap = await productRef.get();

  if (!productSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Product ${product_id} not found.`);
  }

  const product = productSnap.data()!;
  const allowedFromStates = ['draft', 'review_required'];
  if (!allowedFromStates.includes(product.status)) {
    throw new functions.https.HttpsError('failed-precondition', `Product status '${product.status}' cannot be published.`);
  }

  const batch = db.batch();

  batch.update(productRef, {
    status: 'live',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'capability_product',
    entity_id: product_id,
    event_type: 'product_published',
    before_state_ref: product.status,
    after_state_ref: 'live',
    bane_gate_passed: 'gate_1_listing_visibility',
    policy_version: POLICY_VERSION,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { ok: true, product_id, new_status: 'live', audit_event_id: auditRef.id };
});
