/**
 * @classification SCIMEGA_TELEMETRY_REPLAY_SERVICE
 * @authority SCIMEGA Read-Only Telemetry Replay Unit
 * @purpose Provides read-only playback state for SCIMEGA™ mission timeline review.
 * @warning No command transmission. No live device connection. No outbound writes.
 */

import type { SCIMEGAReplaySession, SCIMEGAReplayFrame, SCIMEGATimelineEvent } from './scimega-replay-types';

export type ReplayPlaybackState = 'stopped' | 'playing' | 'paused';

export interface ReplayViewState {
  playbackState: ReplayPlaybackState;
  currentFrameIndex: number;
  currentEventIndex: number;
  currentFrame: SCIMEGAReplayFrame | null;
  currentEvent: SCIMEGATimelineEvent | null;
  totalFrames: number;
  totalEvents: number;
  sessionId: string;
}

export class ScimegaTelemetryReplayService {
  private session: SCIMEGAReplaySession;
  private frameIndex: number = 0;
  private eventIndex: number = 0;
  private playbackState: ReplayPlaybackState = 'stopped';

  constructor(session: SCIMEGAReplaySession) {
    this.session = session;
  }

  getViewState(): ReplayViewState {
    return {
      playbackState: this.playbackState,
      currentFrameIndex: this.frameIndex,
      currentEventIndex: this.eventIndex,
      currentFrame: this.session.frames[this.frameIndex] || null,
      currentEvent: this.session.events[this.eventIndex] || null,
      totalFrames: this.session.frames.length,
      totalEvents: this.session.events.length,
      sessionId: this.session.sessionId
    };
  }

  play(): void { this.playbackState = 'playing'; }
  pause(): void { this.playbackState = 'paused'; }
  stop(): void { this.playbackState = 'stopped'; this.frameIndex = 0; this.eventIndex = 0; }

  stepForward(): void {
    if (this.frameIndex < this.session.frames.length - 1) this.frameIndex++;
    if (this.eventIndex < this.session.events.length - 1) this.eventIndex++;
  }

  stepBackward(): void {
    if (this.frameIndex > 0) this.frameIndex--;
    if (this.eventIndex > 0) this.eventIndex--;
  }

  seekFrame(index: number): void {
    if (index >= 0 && index < this.session.frames.length) this.frameIndex = index;
  }

  seekEvent(index: number): void {
    if (index >= 0 && index < this.session.events.length) this.eventIndex = index;
  }

  getSession(): SCIMEGAReplaySession { return this.session; }
}
