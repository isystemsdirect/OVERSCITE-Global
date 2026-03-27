/**
 * OVERSCITE Global — LARI-Monitor: buildAlertPacket Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function.
 * Accepts one or more source event IDs, builds a MonitorAlertPacket,
 * determines board target based on lane policy, and writes to monitor_alert_packets.
 *
 * Alert packets are synthesized board signals — they are NOT raw event dumps.
 * Board surfaces show alert packets. Raw events remain in lane collections.
 *
 * Implementation Status: LIVE — packet building logic.
 * Board surface display: PARTIAL — UI routes in Phase 2.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import type { MonitorAlertPacket, MonitorLaneId } from '../../../../src/lib/types/monitor';
import { MONITOR_SHARED_COLLECTIONS } from '../../../../src/lib/types/monitor';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// CALLABLE
// ---------------------------------------------------------------------------

export const buildAlertPacket = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'monitor.buildAlertPacket',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const {
    source_event_ids,
    lane,
    correlation_summary,
    severity,
    actionability,
    board_target,
  } = data as {
    source_event_ids: string[];
    lane: MonitorLaneId;
    correlation_summary: string;
    severity: MonitorAlertPacket['severity'];
    actionability: MonitorAlertPacket['actionability'];
    board_target: MonitorAlertPacket['board_target'];
  };

  if (!source_event_ids?.length || !lane || !correlation_summary || !severity || !actionability || !board_target) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'buildAlertPacket: source_event_ids, lane, correlation_summary, severity, actionability, and board_target are required.',
    );
  }

  const alert_packet_id = `ap_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const packet: MonitorAlertPacket = {
    alert_packet_id,
    lane,
    source_event_ids,
    correlation_summary,
    severity,
    actionability,
    board_target,
    status: 'open',
    created_at: now as any,
  };

  await db
    .collection(MONITOR_SHARED_COLLECTIONS.alert_packets)
    .doc(alert_packet_id)
    .set(packet);

  // Audit record
  const auditId = `aud_${alert_packet_id}`;
  await db.collection(MONITOR_SHARED_COLLECTIONS.audit_events).doc(auditId).set({
    audit_event_id:  auditId,
    source_event_id: source_event_ids[0],
    action:          'alert_packet_built',
    actor_id:        gate.uid,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    metadata: { alert_packet_id, lane, board_target, severity, actionability },
    timestamp: now,
  });

  functions.logger.info(`[buildAlertPacket] Built packet ${alert_packet_id}`, {
    lane,
    board_target,
    severity,
    actionability,
    event_count: source_event_ids.length,
  });

  return { ok: true, alert_packet_id, lane, board_target };
});
