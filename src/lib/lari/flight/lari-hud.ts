/**
 * @classification LARI_COGNITIVE_DISPLAY
 * @engine LARI-HUD
 * @purpose Cognitive Display Engine. Governs display priority, symbology, and cognitive density. Differentiates observed vs advisory states.
 */

import { SituationalTruthState, ObservedFlightState } from './lari-aware';

export interface TelemetryPriorityState {
  primary: string[]; // keys of telemetry to emphasize
  secondary: string[];
  hidden: string[];
}

export interface HUDSymbologyState {
  observed: ObservedFlightState;
  advisory: SituationalTruthState;
  priority: TelemetryPriorityState;
  alertDisplayState: 'NOMINAL' | 'WARNING_OVERLAY' | 'CRITICAL_TAKEOVER';
}

export class LariHUDEngine {
  public resolveDisplay(observed: ObservedFlightState, truth: SituationalTruthState): HUDSymbologyState {
    
    let alertState: HUDSymbologyState['alertDisplayState'] = 'NOMINAL';
    if (truth.risk.status === 'COLLISION_IMMINENT') {
      alertState = 'CRITICAL_TAKEOVER';
    } else if (truth.risk.status === 'PROXIMITY_WARNING' || truth.confidence.level === 'DEGRADED') {
      alertState = 'WARNING_OVERLAY';
    }

    // Dynamic priority resolution based on flight context
    // E.g., if battery is low, prioritize battery
    const priority: TelemetryPriorityState = {
      primary: ['altitude', 'velocity'],
      secondary: ['satellites', 'linkQuality'],
      hidden: ['vibration', 'windComp', 'yawDrift', 'imuSync']
    };

    if (observed.rawTelemetry.battery < 30) {
      priority.primary.push('battery');
    } else {
      priority.secondary.push('battery');
    }

    return {
      observed,
      advisory: truth,
      priority,
      alertDisplayState: alertState
    };
  }
}
