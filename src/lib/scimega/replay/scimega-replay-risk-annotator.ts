/**
 * @classification SCIMEGA_REPLAY_RISK_ANNOTATOR
 * @authority SCIMEGA Read-Only Telemetry Replay Unit
 * @purpose Annotates replay frames and events with advisory risk observations.
 * @warning Returns advisory notes only. No execution or control authority.
 */

import type { SCIMEGAReplayFrame, SCIMEGATimelineEvent, SCIMEGAReplaySession } from './scimega-replay-types';

export interface ReplayRiskAnnotation {
  targetId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  annotation: string;
  category: string;
}

export class ScimegaReplayRiskAnnotator {
  /**
   * Generates advisory risk annotations for a replay session.
   */
  static annotate(session: SCIMEGAReplaySession): ReplayRiskAnnotation[] {
    const annotations: ReplayRiskAnnotation[] = [];

    // Annotate stale telemetry frames
    for (const frame of session.frames) {
      if (frame.trustState === 'stale') {
        annotations.push({ targetId: frame.frameId, riskLevel: 'high', annotation: `Telemetry frame [${frame.frameId}] is STALE. Data may not reflect current device state.`, category: 'telemetry_freshness' });
      }
      if (frame.trustState === 'degraded') {
        annotations.push({ targetId: frame.frameId, riskLevel: 'medium', annotation: `Telemetry frame [${frame.frameId}] is DEGRADED. Partial data loss detected.`, category: 'telemetry_integrity' });
      }
      if (frame.trustState === 'rejected') {
        annotations.push({ targetId: frame.frameId, riskLevel: 'critical', annotation: `Telemetry frame [${frame.frameId}] was REJECTED. Frame should not be used for decisions.`, category: 'telemetry_rejected' });
      }
      if (frame.telemetry.batteryPercent < 15) {
        annotations.push({ targetId: frame.frameId, riskLevel: 'critical', annotation: `Battery critically low (${frame.telemetry.batteryPercent}%) at frame [${frame.frameId}].`, category: 'battery_critical' });
      }
    }

    // Annotate blocked BANE events
    for (const event of session.events) {
      if (event.eventClass === 'bane' && event.detail.includes('BLOCKED')) {
        annotations.push({ targetId: event.eventId, riskLevel: 'critical', annotation: `BANE gate returned BLOCKED verdict: ${event.detail}`, category: 'bane_block' });
      }
      if (event.eventClass === 'arc' && event.detail.includes('MISSING')) {
        annotations.push({ targetId: event.eventId, riskLevel: 'high', annotation: `ARC authorization missing at event [${event.eventId}].`, category: 'arc_missing' });
      }
      if (event.eventClass === 'terminal' && event.riskLevel === 'high') {
        annotations.push({ targetId: event.eventId, riskLevel: 'high', annotation: `Terminal simulation contains safety-critical commands at [${event.eventId}].`, category: 'terminal_safety' });
      }
    }

    // Session-level trust summary
    if (session.trustSummary.staleCount > 0) {
      annotations.push({ targetId: session.sessionId, riskLevel: 'high', annotation: `Session contains ${session.trustSummary.staleCount} stale frame(s). Review data freshness.`, category: 'session_staleness' });
    }
    if (session.trustSummary.rejectedCount > 0) {
      annotations.push({ targetId: session.sessionId, riskLevel: 'critical', annotation: `Session contains ${session.trustSummary.rejectedCount} rejected frame(s). Data integrity compromised.`, category: 'session_rejection' });
    }

    return annotations;
  }
}
