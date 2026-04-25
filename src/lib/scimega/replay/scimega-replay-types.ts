/**
 * @classification SCIMEGA_REPLAY_TYPES
 * @authority SCIMEGA Read-Only Telemetry Replay Unit
 * @purpose Defines types for the SCIMEGA™ mission timeline and telemetry replay system.
 * @warning Replay is observation-only. No command, control, or execution authority exists.
 */

export type SCIMEGAReplayFrameSource = 'simulated' | 'observed' | 'audit' | 'training';

export type SCIMEGAReplayTrustState = 'trusted' | 'simulated' | 'degraded' | 'stale' | 'rejected';

export type SCIMEGATimelineEventClass =
  | 'telemetry'
  | 'proposal'
  | 'bane'
  | 'arc'
  | 'terminal'
  | 'operator'
  | 'boundary';

export interface SCIMEGAReplayFrame {
  frameId: string;
  timestamp: string;
  source: SCIMEGAReplayFrameSource;
  trustState: SCIMEGAReplayTrustState;
  telemetry: {
    batteryVoltage: number;
    batteryPercent: number;
    gpsFix: string;
    satelliteCount: number;
    signalDbm: number;
    altitudeMeters: number;
    groundSpeedMps: number;
  };
}

export interface SCIMEGATimelineEvent {
  eventId: string;
  timestamp: string;
  eventClass: SCIMEGATimelineEventClass;
  source: SCIMEGAReplayFrameSource;
  label: string;
  detail: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  auditHash?: string;
}

export interface SCIMEGAReplaySession {
  sessionId: string;
  proposalId: string;
  createdAt: string;
  frames: SCIMEGAReplayFrame[];
  events: SCIMEGATimelineEvent[];
  totalDurationMs: number;
  trustSummary: {
    trustedCount: number;
    simulatedCount: number;
    degradedCount: number;
    staleCount: number;
    rejectedCount: number;
  };
}
