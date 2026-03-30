/**
 * OVERSCITE Global — LARI-Monitor: aggregateTrendRollups Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Scheduled or callable Cloud Function (admin-triggered).
 * Reads lane collections, computes trend rollup records per lane,
 * and writes to monitor_trend_rollups.
 *
 * Read-only observational — does not modify source event records.
 * Rollups summarize without distorting. They must not hide critical signal.
 *
 * Implementation Status: PARTIAL — aggregation logic operational.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import type { MonitorLaneId, MonitorTrendRollup } from '../types/monitor';
import {
  MONITOR_COLLECTION_MAP,
  MONITOR_SHARED_COLLECTIONS,
} from '../types/monitor';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// Lanes to aggregate — all 12
const LANES_TO_AGGREGATE: Array<{ lane_id: MonitorLaneId; domain: string }> = [
  { lane_id: 'MON_FIN',      domain: 'finance' },
  { lane_id: 'MON_MARKET',   domain: 'marketplace' },
  { lane_id: 'MON_DISPATCH', domain: 'dispatch' },
  { lane_id: 'MON_INSPECT',  domain: 'inspection' },
  { lane_id: 'MON_GEO',      domain: 'geo' },
  { lane_id: 'MON_SRT',      domain: 'srt' },
  { lane_id: 'MON_SAFE',     domain: 'safety' },
  { lane_id: 'MON_IDENT',    domain: 'identity' },
  { lane_id: 'MON_NOTIFY',   domain: 'notification' },
  { lane_id: 'MON_COMP',     domain: 'compliance' },
  { lane_id: 'MON_GOV',      domain: 'governance' },
  { lane_id: 'MON_ADMIN',    domain: 'admin_ops' },
];

export const aggregateTrendRollups = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({
    name: 'monitor.aggregateTrendRollups',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  // Default: aggregate last 24 hours
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);
  const periodStartIso = periodStart.toISOString();
  const periodEndIso = periodEnd.toISOString();

  const rollups: MonitorTrendRollup[] = [];

  for (const { lane_id, domain } of LANES_TO_AGGREGATE) {
    const collection = (MONITOR_COLLECTION_MAP as Record<string, string>)[domain];
    if (!collection) continue;

    // Query events in the period
    const snap = await db
      .collection(collection)
      .where('timestamp', '>=', periodStartIso)
      .where('timestamp', '<=', periodEndIso)
      .get();

    const events = snap.docs.map((d) => d.data() as any);
    const criticalCount = events.filter(
      (e) => e.severity === 'critical' || e.severity === 'safety_critical',
    ).length;

    // Count open alert packets for this lane
    const alertSnap = await db
      .collection(MONITOR_SHARED_COLLECTIONS.alert_packets)
      .where('lane', '==', lane_id)
      .where('status', '==', 'open')
      .get();

    // Open review queues referencing this lane's packets
    const openReviewCount = 0; // [SCAFFOLD] cross-reference via alert_packet_id requires compound index

    // Tally event types
    const typeCounts: Record<string, number> = {};
    for (const e of events) {
      const t = e.event_type ?? 'unknown';
      typeCounts[t] = (typeCounts[t] ?? 0) + 1;
    }
    const topEventTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([event_type, count]) => ({ event_type, count }));

    const rollup_id = `rollup_${lane_id}_${periodEnd.getTime()}`;
    const rollup: MonitorTrendRollup = {
      rollup_id,
      lane: lane_id,
      period_start: periodStartIso,
      period_end:   periodEndIso,
      event_count:  events.length,
      alert_count:  alertSnap.size,
      critical_count: criticalCount,
      open_review_count: openReviewCount,
      top_event_types: topEventTypes,
      generated_at: now as any,
    };

    await db
      .collection(MONITOR_SHARED_COLLECTIONS.trend_rollups)
      .doc(rollup_id)
      .set(rollup);

    rollups.push(rollup);
  }

  functions.logger.info(`[aggregateTrendRollups] Generated ${rollups.length} lane rollups for period`, {
    period_start: periodStartIso,
    period_end: periodEndIso,
    engine: ENGINE_VERSION,
    policy: POLICY_VERSION,
  });

  return {
    ok: true,
    period_start: periodStartIso,
    period_end: periodEndIso,
    lanes_aggregated: rollups.length,
    rollup_ids: rollups.map((r) => r.rollup_id),
  };
});
