/**
 * requestStandaloneAuthorization — Submit a standalone deployment authorization request.
 * UTCB-S V1.0 | BANE Gate 4 — High Risk Review
 *
 * This is NOT a self-service purchase. It enters the standalone_authorization_queue.
 * Full approval requires enterprise_sales_admin review, reason + evidence, contract execution.
 *
 * IMPLEMENTATION STATUS: SCAFFOLD — request submission wired; approval pipeline not yet implemented.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const POLICY_VERSION = 'UTCB-S-V1.0';

export const requestStandaloneAuthorization = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Actor must be authenticated.');
  }

  const { requester_org_id, deployment_description, commercial_context, qualification_evidence } = data as {
    requester_org_id: string;
    deployment_description: string;
    commercial_context: string;
    qualification_evidence: string[];
  };

  if (!requester_org_id || !deployment_description || !commercial_context) {
    throw new functions.https.HttpsError('invalid-argument', 'requester_org_id, deployment_description, and commercial_context are required.');
  }

  if (!qualification_evidence?.length) {
    throw new functions.https.HttpsError('invalid-argument', 'At least one qualification evidence reference is required for standalone authorization requests.');
  }

  const db = admin.firestore();
  const batch = db.batch();

  // Create moderation record in standalone_authorization_queue
  const moderationRef = db.collection('market_moderation_records').doc();
  batch.set(moderationRef, {
    entity_type: 'capability_product',
    entity_id: 'standalone_deployment_tier',
    queue_type: 'standalone_authorization_queue',
    review_type: 'commercial_review',
    status: 'pending',
    requester_arc_id: context.auth.uid,
    requester_org_id,
    deployment_description,
    commercial_context,
    qualification_evidence,
    evidence_refs: qualification_evidence,
    audit_event_id: 'pending_audit_write',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const auditRef = db.collection('market_audit_events').doc();
  batch.set(auditRef, {
    actor_id: context.auth.uid,
    actor_role: 'org_buyer',
    entity_type: 'moderation_record',
    entity_id: moderationRef.id,
    event_type: 'standalone_authorization_requested',
    reason: deployment_description,
    bane_gate_passed: 'gate_4_high_risk_review',
    policy_version: POLICY_VERSION,
    metadata: { requester_org_id, qualification_evidence_count: qualification_evidence.length, scaffold: true },
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  await moderationRef.update({ audit_event_id: auditRef.id });

  return {
    ok: true,
    request_id: moderationRef.id,
    status: 'submitted',
    scaffold_note: 'Full approval pipeline (Gate 4 review, contract execution) requires enterprise_sales_admin workflow — currently SCAFFOLD.',
    audit_event_id: auditRef.id,
  };
});
