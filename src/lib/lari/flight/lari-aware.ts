/**
 * @classification LARI_SITUATIONAL_AWARENESS
 * @engine LARI-AWARE
 * @purpose Situational Awareness Engine. Converts raw telemetry, sensor data, and context into situational truth and confidence-bounded risk posture.
 */

import { TelemetryData } from '@/context/LiveFlightContext';

export interface ConfidenceState {
  level: 'HIGH' | 'MODERATE' | 'LOW' | 'DEGRADED';
  score: number; // 0 to 100
}

export interface RiskZoneState {
  status: 'CLEAR' | 'PROXIMITY_WARNING' | 'COLLISION_IMMINENT';
  distanceToNearestObstacle: number; // meters, 0 if unknown
}

export interface SituationalTruthState {
  confidence: ConfidenceState;
  risk: RiskZoneState;
  navigationContext: 'NOMINAL' | 'DEVIATING' | 'LOST';
}

export interface ObservedFlightState {
  rawTelemetry: TelemetryData;
  timestamp: number;
}

export class LariawareEngine {
  public evaluateTruth(observed: ObservedFlightState): SituationalTruthState {
    const { rawTelemetry } = observed;
    
    // Confidence based on link quality and sats
    let confidenceLevel: ConfidenceState['level'] = 'HIGH';
    let score = 100;
    
    if (rawTelemetry.linkQuality < 40 || rawTelemetry.satellites < 6) {
      confidenceLevel = 'DEGRADED';
      score = 40;
    } else if (rawTelemetry.linkQuality < 70 || rawTelemetry.satellites < 10) {
      confidenceLevel = 'MODERATE';
      score = 75;
    }

    // Abstracted risk state
    const riskStatus: RiskZoneState['status'] = rawTelemetry.altitude < 2 && rawTelemetry.velocity > 10 ? 'PROXIMITY_WARNING' : 'CLEAR';

    return {
      confidence: { level: confidenceLevel, score },
      risk: { status: riskStatus, distanceToNearestObstacle: 0 },
      navigationContext: 'NOMINAL'
    };
  }
}
