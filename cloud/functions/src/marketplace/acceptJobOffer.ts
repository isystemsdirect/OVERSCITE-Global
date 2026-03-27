/**
 * acceptJobOffer — Agent accepts a dispatch offer.
 * UTCB-S V1.0 | BANE Gate 2 — Assignment/Purchase Readiness
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const acceptJobOffer = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { offer_id } = data as { offer_id: string; org_id?: string };

  if (!offer_id) {
    throw new functions.https.HttpsError('invalid-argument', 'offer_id is required.');
  }

  const db = admin.firestore();
  const offerSnap = await db.collection('market_job_offers').doc(offer_id).get();

  if (!offerSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Offer ${offer_id} not found.`);
  }

  const offer = offerSnap.data()!;

  if (offer.recipient_agent_id !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Only the designated recipient may accept this offer.');
  }

  if (offer.status !== 'offered') {
    throw new functions.https.HttpsError('failed-precondition', `Offer status '${offer.status}' cannot be accepted.`);
  }

  const batch = db.batch();

  batch.update(db.collection('market_job_offers').doc(offer_id), {
    status: 'accepted',
    accepted_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.update(db.collection('market_jobs').doc(offer.job_id), {
    status: 'accepted',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role: 'field_agent',
    entity_type: 'dispatch_offer',
    entity_id: offer_id,
    event_type: 'offer_accepted',
    before_state_ref: 'offered',
    after_state_ref: 'accepted',
    bane_gate_passed: 'gate_2_assignment_purchase_readiness',
    policy_version: POLICY_VERSION,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { ok: true, offer_id, job_id: offer.job_id, new_status: 'accepted', audit_event_id: auditRef.id };
});
