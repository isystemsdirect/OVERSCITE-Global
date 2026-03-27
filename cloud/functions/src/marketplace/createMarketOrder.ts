/**
 * createMarketOrder — Create a commercial order for either marketplace plane.
 * UTCB-S V1.0 | BANE Gate 2 — Assignment/Purchase Readiness
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 * Order record creation is wired. Payment capture integration (Stripe, etc.) required for production.
 * Order status will be 'pending_payment' until payment provider confirms capture.
 * Entitlement activation is NOT triggered by order creation — see activateEntitlement.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const createMarketOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { order_plane, buyer_org_id, line_items, actor_role } = data as {
    order_plane: 'field_market' | 'marketplace';
    buyer_org_id: string;
    line_items: Array<{ product_id?: string; job_id?: string; description: string; quantity: number; unit_price: number }>;
    actor_role: string;
  };

  if (!order_plane || !buyer_org_id || !line_items?.length) {
    throw new functions.https.HttpsError('invalid-argument', 'order_plane, buyer_org_id, and line_items are required.');
  }

  const db = admin.firestore();
  const batch = db.batch();
  const orderRef = db.collection('market_orders').doc();

  const subtotal = line_items.reduce((sum, li) => sum + li.unit_price * li.quantity, 0);

  // SCAFFOLD: pricing computation placeholder — server-authoritative price computation required
  const orderData = {
    order_plane,
    buyer_arc_id: context.auth.uid,
    buyer_org_id,
    line_items: line_items.map((li, i) => ({
      line_id: `${orderRef.id}-li-${i}`,
      ...li,
      total_price: li.unit_price * li.quantity,
    })),
    subtotal,
    platform_fee: 0, // SCAFFOLD: fee computation required
    tax_amount: 0,   // SCAFFOLD: tax computation required
    total_amount: subtotal,
    currency: 'USD',
    status: 'pending_payment',
    approval_required: false,
    audit_event_id: 'pending_audit_write',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  };

  batch.set(orderRef, orderData);

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'order_record',
    entity_id: orderRef.id,
    event_type: 'order_created',
    after_state_ref: 'pending_payment',
    bane_gate_passed: 'gate_2_assignment_purchase_readiness',
    policy_version: POLICY_VERSION,
    metadata: { order_plane, subtotal },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  const billingRef = db.collection('market_billing_events').doc();
  batch.set(billingRef, {
    order_id: orderRef.id,
    event_type: 'price_computed',
    amount: subtotal,
    currency: 'USD',
    actor_id: context.auth.uid,
    metadata: { scaffold: true, note: 'Server-authoritative price computation required for production' },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  await db.collection('market_orders').doc(orderRef.id).update({ audit_event_id: auditRef.id });

  return {
    ok: true,
    order_id: orderRef.id,
    status: 'pending_payment',
    scaffold_note: 'Payment capture requires payment provider integration. pending_payment ≠ payment_captured.',
    audit_event_id: auditRef.id,
  };
});
