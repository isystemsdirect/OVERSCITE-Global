/**
 * @classification BANE_TELEMETRY_INTAKE_GATE
 * @authority BANE Governance Layer
 * @purpose Evaluates inbound telemetry frames for schema integrity, freshness, and trust state.
 */

import type { SCIMEGATelemetryFrame, TelemetryTrustState } from './scimega-telemetry-types';

export interface TelemetryIntakeResult {
  finalTrustState: TelemetryTrustState;
  reasons: string[];
  isValid: boolean;
}

export class BaneTelemetryIntakeGate {
  /**
   * Validates inbound telemetry frame.
   */
  static evaluate(frame: SCIMEGATelemetryFrame): TelemetryIntakeResult {
    const result: TelemetryIntakeResult = {
      finalTrustState: frame.trustState,
      reasons: [],
      isValid: true
    };

    // 1. Validate Core Schema
    if (!frame.frameId || !frame.timestamp || !frame.source) {
      result.isValid = false;
      result.finalTrustState = 'rejected';
      result.reasons.push('FATAL: Malformed telemetry frame missing core routing metadata.');
      return result;
    }

    // 2. Validate Freshness (mocking 5-second stale threshold for Phase 4)
    const frameTime = new Date(frame.timestamp).getTime();
    const now = Date.now();
    const ageMs = now - frameTime;

    if (ageMs > 5000) {
      result.finalTrustState = 'stale';
      result.reasons.push(`Telemetry is stale. Age: ${ageMs}ms exceeds 5000ms limit.`);
    }

    // 3. Sensor Integrity Checks
    if (frame.battery && frame.battery.voltage < 10.0) { // Arbitrary critical threshold
      if (result.finalTrustState !== 'stale') {
         result.finalTrustState = 'degraded';
      }
      result.reasons.push('CRITICAL: Battery voltage below safe telemetry threshold.');
    }

    if (frame.gps && frame.gps.fixType < 3) {
      if (result.finalTrustState !== 'stale') {
         result.finalTrustState = 'degraded';
      }
      result.reasons.push(`WARNING: GPS Fix Type degraded (Current: ${frame.gps.fixType}).`);
    }

    return result;
  }
}
