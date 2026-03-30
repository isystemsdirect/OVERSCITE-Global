/**
 * OVERSCITE Global — LARI-Monitor: routeToReviewQueue Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function.
 * Accepts an alert packet ID, evaluates its actionability, and if
 * approval_required / block / escalate — creates a MonitorReviewQueue record.
 *
 * BANE Gate 3: finance or governance threshold, safety-critical escalation.
 * BANE Gate 4: mutation-bearing outcomes — any path to payout/entitlement/
 *              override/compliance change requires BANE-reviewed termination.
 *
 * LARI-Monitor may route to the queue. BANE decides and records gate outcomes.
 * The review queue itself does NOT finalize mutations; human review is required.
 *
 * Implementation Status: LIVE — routing logic.
 * Review queue UI: PARTIAL — admin console in Phase 3.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import type { MonitorReviewQueue, ReviewQueueType } from '../types/monitor';
import {
  MONITOR_SHARED_COLLECTIONS,
} from '../types/monitor';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// Actionability values that require a review queue entry
const ROUTABLE_ACTIONABILITY = new Set([
  'approval_required',
  'block',
  'escalate',
]);

// Maps alert severity + governance-routable lanes to queue type
function resolveQueueType(
  actionability: string,
  lane: string,
  severity: string,
): ReviewQueueType {
  if (severity === 'safety_critical' || severity === 'critical') {
    if (lane === 'MON_SAFE') return 'safety_escalation';
    if (lane === 'MON_GOV' || lane === 'MON_IDENT') return 'governance_review';
  }
  if (lane === 'MON_FIN' || lane === 'MON_COMP') return 'finance_review';
  if (lane === 'MON_GOV' || lane === 'MON_IDENT') return 'governance_review';
  if (actionability === 'block') return 'manual_override_record';
  return 'support_escalation';
}

export const routeToReviewQueue = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'monitor.routeToReviewQueue',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const {
    alert_packet_id,
    notification_ids,
    reason,
    assigned_role,
  } = data as {
    alert_packet_id: string;
    notification_ids?: string[];
    reason: string;
    assigned_role?: string;
  };

  if (!alert_packet_id || !reason) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'routeToReviewQueue: alert_packet_id and reason are required.',
    );
  }

  // Read the alert packet to evaluate actionability
  const packetSnap = await db
    .collection(MONITOR_SHARED_COLLECTIONS.alert_packets)
    .doc(alert_packet_id)
    .get();

  if (!packetSnap.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      `routeToReviewQueue: alert packet '${alert_packet_id}' not found.`,
    );
  }

  const packet = packetSnap.data() as {
    actionability: string;
    lane: string;
    severity: string;
  };

  // Evaluate whether this packet warrants review queue routing
  if (!ROUTABLE_ACTIONABILITY.has(packet.actionability)) {
    return {
      ok: true,
      routed: false,
      reason: `Actionability '${packet.actionability}' does not require review queue routing.`,
    };
  }

  const queue_type = resolveQueueType(packet.actionability, packet.lane, packet.severity);
  const review_id = `rev_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const reviewRecord: MonitorReviewQueue = {
    review_id,
    queue_type,
    related_alert_packet_id: alert_packet_id,
    related_notification_ids: notification_ids ?? [],
    assigned_role: assigned_role ?? 'governance_admin',
    status: 'pending',
    reason,
    created_at: now as any,
  };

  await db
    .collection(MONITOR_SHARED_COLLECTIONS.review_queues)
    .doc(review_id)
    .set(reviewRecord);

  // Update packet status to escalated
  await db
    .collection(MONITOR_SHARED_COLLECTIONS.alert_packets)
    .doc(alert_packet_id)
    .update({
      status: 'escalated',
      review_queue_ref: review_id,
      updated_at: now,
    });

  // Audit
  const auditId = `aud_${review_id}`;
  await db.collection(MONITOR_SHARED_COLLECTIONS.audit_events).doc(auditId).set({
    audit_event_id:  auditId,
    source_event_id: alert_packet_id,
    action:          'review_queue_routed',
    actor_id:        gate.uid,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    metadata: { review_id, queue_type, alert_packet_id },
    timestamp: now,
  });

  functions.logger.info(`[routeToReviewQueue] Routed packet ${alert_packet_id} → review ${review_id}`, {
    queue_type,
    actionability: packet.actionability,
  });

  return {
    ok: true,
    routed: true,
    review_id,
    queue_type,
  };
});
