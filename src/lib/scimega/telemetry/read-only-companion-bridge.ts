/**
 * @classification READ_ONLY_COMPANION_BRIDGE
 * @authority SCIMEGA Telemetry Bridge Unit
 * @purpose A strict inbound-only bridge for receiving companion computer telemetry.
 * @warning THIS BRIDGE DOES NOT SUPPORT OUTBOUND COMMANDS. NO C2 AUTHORIZED.
 */

import type { SCIMEGATelemetryFrame, CompanionTelemetrySource } from './scimega-telemetry-types';

export type BridgeStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export class ReadOnlyCompanionBridge {
  private status: BridgeStatus = 'disconnected';
  private onFrameReceived?: (frame: SCIMEGATelemetryFrame) => void;

  constructor(private bridgeEndpoint: string) {}

  /**
   * Initializes the inbound listener.
   */
  connect(onFrame: (frame: SCIMEGATelemetryFrame) => void) {
    this.status = 'connecting';
    this.onFrameReceived = onFrame;
    
    // In Phase 4, we simulate the inbound socket for architectural testing.
    // Real implementation would be a strictly read-only WebSocket or MQTT sub.
    this.status = 'connected';
    
    console.log(`[SCIMEGA_BRIDGE] Read-Only Telemetry Bridge connected to ${this.bridgeEndpoint}`);
  }

  /**
   * Internal mechanism to simulate incoming data.
   * In production, this would be the WebSocket `onmessage` handler.
   */
  _simulateInboundFrame(source: CompanionTelemetrySource, partialFrame: Partial<SCIMEGATelemetryFrame>) {
    if (this.status !== 'connected' || !this.onFrameReceived) return;

    const frame: SCIMEGATelemetryFrame = {
      frameId: `FRM-${Date.now()}`,
      source: source,
      timestamp: new Date().toISOString(),
      trustState: source === 'simulated_mock' ? 'simulated' : 'observed',
      ...partialFrame
    };

    // Forward to handler
    this.onFrameReceived(frame);
  }

  getStatus(): BridgeStatus {
    return this.status;
  }

  disconnect() {
    this.status = 'disconnected';
    this.onFrameReceived = undefined;
  }

  /**
   * @fatal INTENTIONAL COMPILER TRAP.
   * The sendCommand method does not exist. The bridge is intentionally inbound-only.
   */
  // sendCommand(command: any) { throw new Error("C2 NOT AUTHORIZED"); }
}
