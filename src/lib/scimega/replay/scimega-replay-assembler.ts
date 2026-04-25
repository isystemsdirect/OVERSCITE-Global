/**
 * @classification SCIMEGA_REPLAY_ASSEMBLER
 * @authority SCIMEGA Read-Only Telemetry Replay Unit
 * @purpose Merges telemetry frames, audit records, and training events into a chronological timeline.
 * @warning Does not mutate original audit records. Read-only assembly only.
 */

import type { SCIMEGAReplaySession, SCIMEGAReplayFrame, SCIMEGATimelineEvent } from './scimega-replay-types';
import type { SCIMEGASimulationAuditRecord } from '../audit/scimega-simulation-audit-types';

export class ScimegaReplayAssembler {
  /**
   * Assembles a replay session from telemetry frames, audit records, and training events.
   * All inputs are consumed read-only. Original records are never mutated.
   */
  static assemble(
    proposalId: string,
    frames: SCIMEGAReplayFrame[],
    auditRecord: SCIMEGASimulationAuditRecord | null,
    trainingEvents: SCIMEGATimelineEvent[]
  ): SCIMEGAReplaySession {
    const validFrames = frames.filter(f => f.timestamp && f.frameId);
    const allEvents: SCIMEGATimelineEvent[] = [];

    // Convert audit events to timeline events
    if (auditRecord) {
      for (const evt of auditRecord.events) {
        allEvents.push({
          eventId: evt.eventId,
          timestamp: evt.timestamp,
          eventClass: ScimegaReplayAssembler.classifyAuditEvent(evt.eventType),
          source: 'audit',
          label: evt.eventType.replace(/_/g, ' ').toUpperCase(),
          detail: evt.detail,
          riskLevel: 'none',
          auditHash: evt.eventHash
        });
      }
    }

    // Merge training events
    for (const te of trainingEvents) {
      if (te.timestamp && te.eventId) {
        allEvents.push(te);
      }
    }

    // Sort all events chronologically
    allEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    validFrames.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const trustSummary = { trustedCount: 0, simulatedCount: 0, degradedCount: 0, staleCount: 0, rejectedCount: 0 };
    for (const f of validFrames) {
      if (f.trustState === 'trusted') trustSummary.trustedCount++;
      else if (f.trustState === 'simulated') trustSummary.simulatedCount++;
      else if (f.trustState === 'degraded') trustSummary.degradedCount++;
      else if (f.trustState === 'stale') trustSummary.staleCount++;
      else if (f.trustState === 'rejected') trustSummary.rejectedCount++;
    }

    const timestamps = [...validFrames.map(f => new Date(f.timestamp).getTime()), ...allEvents.map(e => new Date(e.timestamp).getTime())];
    const totalDurationMs = timestamps.length > 1 ? Math.max(...timestamps) - Math.min(...timestamps) : 0;

    return {
      sessionId: `REPLAY-${Date.now()}`,
      proposalId,
      createdAt: new Date().toISOString(),
      frames: validFrames,
      events: allEvents,
      totalDurationMs,
      trustSummary
    };
  }

  private static classifyAuditEvent(eventType: string): SCIMEGATimelineEvent['eventClass'] {
    if (eventType.includes('bane')) return 'bane';
    if (eventType.includes('arc')) return 'arc';
    if (eventType.includes('terminal')) return 'terminal';
    if (eventType.includes('telemetry')) return 'telemetry';
    if (eventType.includes('operator')) return 'operator';
    if (eventType.includes('boundary')) return 'boundary';
    return 'proposal';
  }
}
