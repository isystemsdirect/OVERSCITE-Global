/**
 * issueDispatchOffer — Issue a governed dispatch offer to a field agent.
 * UTCB-S V1.0 | BANE Gate 2 — Assignment/Purchase Readiness
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 * Agent eligibility check and availability verification require
 * full agent profile and availability data in Firestore.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const issueDispatchOffer = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated to issue a dispatch offer.');
  }

  const { job_id, recipient_agent_id, actor_role, org_id, offer_type, offered_payout } = data as {
    job_id: string;
    recipient_agent_id: string;
    actor_role: string;
    org_id: string;
    offer_type: 'directed' | 'open_market' | 'invited';
    offered_payout: { gross_amount: number; currency: string; payout_model: string };
  };

  if (!job_id || !recipient_agent_id || !org_id) {
    throw new functions.https.HttpsError('invalid-argument', 'job_id, recipient_agent_id, and org_id are required.');
  }

  const dispatchRoles = ['dispatch_manager', 'org_scheduler', 'marketplace_admin', 'platform_super_admin'];
  if (!dispatchRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot issue dispatch offers.`);
  }

  const db = admin.firestore();

  // Validate job exists and is in live state
  const jobSnap = await db.collection('market_jobs').doc(job_id).get();
  if (!jobSnap.exists || !['live', 'partial'].includes(jobSnap.data()!.status)) {
    throw new functions.https.HttpsError('failed-precondition', 'Job must be in live state to receive a dispatch offer.');
  }

  const batch = db.batch();

  // Create offer record
  const offerRef = db.collection('market_job_offers').doc();
  batch.set(offerRef, {
    job_id,
    org_id,
    issuer_arc_id: context.auth.uid,
    recipient_agent_id,
    offer_type,
    status: 'offered',
    offered_payout,
    offered_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update job status
  batch.update(db.collection('market_jobs').doc(job_id), {
    status: 'offered',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Audit event
  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'dispatch_offer',
    entity_id: offerRef.id,
    event_type: 'offer_issued',
    before_state_ref: 'live',
    after_state_ref: 'offered',
    bane_gate_passed: 'gate_2_assignment_purchase_readiness',
    policy_version: POLICY_VERSION,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { ok: true, offer_id: offerRef.id, job_id, audit_event_id: auditRef.id };
});
