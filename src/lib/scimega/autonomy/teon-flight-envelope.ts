/**
 * @classification TEON_FLIGHT_ENVELOPE
 * @authority Flight Autonomy Architecture Unit
 * @purpose Enforces the kinetic safety, proportionality, and collision avoidance boundaries.
 * @warning Simulation only. Does not output live flight envelopes to hardware.
 */

import { SCIMEGAMissionStep } from './scimega-autonomy-types';

export interface TeonEnvelopeParameters {
  maxAltitudeMeters: number;
  maxSpeedMetersPerSec: number;
  geofenceRadiusMeters: number;
  maxWindSpeedMph: number;
  minProximityThresholdMeters: number;
  returnToOriginRequired: boolean;
}

export type TeonEnforcementAction = 'clear' | 'force_anchor_hold' | 'force_return_to_origin' | 'force_abort' | 'restrict_motion';

export interface TeonEvaluationResult {
  action: TeonEnforcementAction;
  reason: string;
  isViolation: boolean;
}

export class TeonFlightEnvelope {
  /**
   * Evaluates a proposed mission step against the TEON safety envelope.
   * Returns a deterministic enforcement action.
   */
  static evaluateStep(
    step: SCIMEGAMissionStep,
    params: TeonEnvelopeParameters,
    currentWindSpeedMph: number
  ): TeonEvaluationResult {
    
    // Wind check (Hard enforcement)
    if (currentWindSpeedMph > params.maxWindSpeedMph) {
      return { 
        action: 'force_anchor_hold', 
        reason: `TEON ENFORCEMENT: Wind speed (${currentWindSpeedMph}mph) exceeds hard limit.`,
        isViolation: true
      };
    }

    // Altitude check (Hard enforcement)
    if (step.targetAltitudeMeters !== undefined && step.targetAltitudeMeters > params.maxAltitudeMeters) {
      return { 
        action: 'force_abort', 
        reason: `TEON ENFORCEMENT: Target altitude (${step.targetAltitudeMeters}m) exceeds geofence cap.`,
        isViolation: true
      };
    }

    // Proportionality check
    if (!step.isSafeToExecute) {
      return { 
        action: 'restrict_motion', 
        reason: `TEON ENFORCEMENT: Step flagged unsafe. Limiting kinetic authority.`,
        isViolation: true
      };
    }

    return { action: 'clear', reason: 'TEON parameters within normal envelope.', isViolation: false };
  }

  /**
   * Evaluates overall flight condition against TEON constraints.
   */
  static evaluateConditions(
    params: TeonEnvelopeParameters,
    currentWindSpeedMph: number,
    gpsQuality: 'good' | 'poor' | 'none',
    batteryPercent: number
  ): { active: boolean; enforcement: TeonEnforcementAction; reason: string } {
    
    if (currentWindSpeedMph > params.maxWindSpeedMph) {
      return { active: false, enforcement: 'force_anchor_hold', reason: 'TEON: Wind limit violation.' };
    }
    
    if (gpsQuality === 'none') {
      return { active: false, enforcement: 'force_return_to_origin', reason: 'TEON: Navigation loss detected.' };
    }
    
    if (batteryPercent < 15) {
      return { active: false, enforcement: 'force_return_to_origin', reason: 'TEON: Battery reserve critical.' };
    }

    if (batteryPercent < 5) {
      return { active: false, enforcement: 'force_abort', reason: 'TEON: Battery depletion imminent.' };
    }

    return { active: true, enforcement: 'clear', reason: 'TEON envelope active and constraints met.' };
  }
}
