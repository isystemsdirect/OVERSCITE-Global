/**
 * publishJob — Publish a job listing to the Field Market.
 * UTCB-S V1.0 | BANE Gate 1 — Listing Visibility
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 * Gate logic and audit event write are wired. State machine transition is implemented.
 * Production: no additional dependencies required beyond Firestore.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const publishJob = functions.https.onCall(async (data, context) => {
  // 1. Actor identity validation (Gate 1 pre-condition)
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated to publish a job.');
  }

  const { job_id, actor_role } = data as { job_id: string; actor_role: string };

  if (!job_id || !actor_role) {
    throw new functions.https.HttpsError('invalid-argument', 'job_id and actor_role are required.');
  }

  const publishRoles = ['marketplace_admin', 'platform_super_admin', 'dispatch_manager'];
  if (!publishRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot publish job listings.`);
  }

  const db = admin.firestore();
  const jobRef = db.collection('market_jobs').doc(job_id);
  const jobSnap = await jobRef.get();

  if (!jobSnap.exists) {
    throw new functions.https.HttpsError('not-found', `Job ${job_id} not found.`);
  }

  const job = jobSnap.data()!;
  const allowedFromStates = ['draft', 'review_required'];
  if (!allowedFromStates.includes(job.status)) {
    throw new functions.https.HttpsError('failed-precondition', `Job status '${job.status}' cannot be published.`);
  }

  const batch = db.batch();

  // 2. State transition
  batch.update(jobRef, {
    status: 'live',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 3. Audit event (immutable, append-only)
  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'job_listing',
    entity_id: job_id,
    event_type: 'job_published',
    before_state_ref: job.status,
    after_state_ref: 'live',
    bane_gate_passed: 'gate_1_listing_visibility',
    policy_version: POLICY_VERSION,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return { ok: true, job_id, new_status: 'live', audit_event_id: auditRef.id };
});
