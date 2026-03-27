/**
 * closeJobAndPreparePayout — Close a completed job and create the payout record.
 * UTCB-S V1.0 | BANE Gate 3 — Mutation Integrity
 *
 * IMPLEMENTATION STATUS: SCAFFOLD
 * Payout computation is wired. Payment provider disbursement integration required for
 * actual funds transfer. Release state will be 'ready_for_release' pending finance authorization.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const closeJobAndPreparePayout = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { job_id, offer_id, actor_role, reason } = data as {
    job_id: string;
    offer_id: string;
    actor_role: string;
    reason: string;
  };

  if (!job_id || !offer_id || !reason) {
    throw new functions.https.HttpsError('invalid-argument', 'job_id, offer_id, and reason are required.');
  }

  const mutationRoles = ['dispatch_manager', 'marketplace_admin', 'finance_admin', 'platform_super_admin'];
  if (!mutationRoles.includes(actor_role)) {
    throw new functions.https.HttpsError('permission-denied', `Role ${actor_role} cannot close jobs and prepare payouts.`);
  }

  const db = admin.firestore();

  const [jobSnap, offerSnap] = await Promise.all([
    db.collection('market_jobs').doc(job_id).get(),
    db.collection('market_job_offers').doc(offer_id).get(),
  ]);

  if (!jobSnap.exists || !offerSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Job or offer not found.');
  }

  const job = jobSnap.data()!;
  const offer = offerSnap.data()!;

  if (job.status !== 'completed') {
    throw new functions.https.HttpsError('failed-precondition', `Job must be 'completed' to prepare payout. Current: ${job.status}`);
  }

  // Compute payout — SCAFFOLD: payment provider integration not yet wired
  const grossAmount: number = offer.offered_payout?.gross_amount ?? job.payout_terms?.gross_amount ?? 0;
  const platformFeeRate: number = job.platform_fee_model?.fee_value ?? 10;
  const platformFee = Math.round(grossAmount * (platformFeeRate / 100) * 100) / 100;
  const netAmount = Math.round((grossAmount - platformFee) * 100) / 100;
  const holdPeriodDays: number = offer.offered_payout?.hold_period_days ?? job.payout_terms?.hold_period_days ?? 0;

  const batch = db.batch();

  // Close job
  batch.update(db.collection('market_jobs').doc(job_id), {
    status: 'closed',
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create payout record — release requires finance_admin action + payment provider
  const payoutRef = db.collection('market_payouts').doc();
  batch.set(payoutRef, {
    job_id,
    offer_id,
    recipient_id: offer.recipient_agent_id,
    org_id: job.org_id,
    gross_amount: grossAmount,
    platform_fee: platformFee,
    net_amount: netAmount,
    currency: offer.offered_payout?.currency ?? 'USD',
    hold_state: holdPeriodDays > 0,
    hold_reason: holdPeriodDays > 0 ? `Standard ${holdPeriodDays}-day hold period.` : null,
    release_state: holdPeriodDays > 0 ? 'on_hold' : 'ready_for_release',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
    audit_event_id: 'pending_audit_write', // updated below
  });

  // Billing event (completed work ≠ payout released)
  const billingRef = db.collection('market_billing_events').doc();
  batch.set(billingRef, {
    order_id: job_id,
    event_type: 'payout_computed',
    amount: netAmount,
    currency: offer.offered_payout?.currency ?? 'USD',
    actor_id: context.auth.uid,
    metadata: { gross_amount: grossAmount, platform_fee: platformFee, hold_period_days: holdPeriodDays },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role,
    entity_type: 'payout_record',
    entity_id: payoutRef.id,
    event_type: 'payout_prepared',
    reason,
    bane_gate_passed: 'gate_3_mutation_integrity',
    policy_version: POLICY_VERSION,
    metadata: { job_id, offer_id, gross_amount: grossAmount, net_amount: netAmount },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  // Update payout with audit event ref
  await db.collection('market_payouts').doc(payoutRef.id).update({ audit_event_id: auditRef.id });

  return {
    ok: true,
    payout_id: payoutRef.id,
    net_amount: netAmount,
    release_state: holdPeriodDays > 0 ? 'on_hold' : 'ready_for_release',
    audit_event_id: auditRef.id,
    scaffold_note: 'Payout disbursement: payment provider integration required for production.',
  };
});
