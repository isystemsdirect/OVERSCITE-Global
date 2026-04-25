import { 
  SCIMEGAWorkstationAccessState, 
  WorkstationAccessReason 
} from "./scimega-workstation-types";
import { isModuleFlightSafe } from "./flight-safe-calibration-whitelist";

/**
 * @fileOverview BANE Workstation Access Gate
 * @authority BANE / Director
 * @purpose Enforce flight-mode aware access to SCIMEGA™ Workstation modules.
 */

export interface WorkstationAccessContext {
  flightMode: 'DISARMED' | 'ARMED' | 'PLAN' | 'HOLD' | 'MANUAL';
  operatorRole: 'PILOT' | 'OBSERVER' | 'NAVIGATOR' | 'INSPECTOR';
  isArmed: boolean;
  isPilotInterruptActive?: boolean;
  teonSafetyOverride?: boolean;
  securityOverride?: boolean;
}

export function evaluateWorkstationAccess(
  moduleId: string,
  context: WorkstationAccessContext
): WorkstationAccessReason {
  const { 
    flightMode, 
    operatorRole, 
    isArmed, 
    isPilotInterruptActive, 
    teonSafetyOverride, 
    securityOverride 
  } = context;

  // 1. Critical Overrides (Total Lockout)
  if (securityOverride) {
    return {
      status: 'BLOCKED',
      reason: 'SECURITY_OVERRIDE_ACTIVE: All workstation access suspended by Director mandate.',
      mode: flightMode,
      authority: 'BANE / SECURITY'
    };
  }

  if (teonSafetyOverride) {
    return {
      status: 'BLOCKED',
      reason: 'TEON_SAFETY_OVERRIDE: Kinetic envelope violation detected. Workstation locked to preserve CPU/Bus priority.',
      mode: flightMode,
      authority: 'TEON / SAFETY'
    };
  }

  // 2. Active Flight / Pilot Mode Constraints
  const isPilotMode = flightMode === 'MANUAL' || operatorRole === 'PILOT';
  const isActiveFlight = isArmed || flightMode === 'PLAN' || flightMode === 'HOLD';

  if (isPilotMode || isActiveFlight || isPilotInterruptActive) {
    // Check whitelist
    if (isModuleFlightSafe(moduleId)) {
      return {
        status: 'CALIBRATION_ONLY',
        reason: `PILOT_MODE_ACTIVE: Workstation restricted to flight-safe calibration/diagnostics for module ${moduleId}.`,
        mode: flightMode,
        authority: 'BANE / PILOT_GOVERNANCE'
      };
    }

    return {
      status: 'LOCKED',
      reason: 'WORKSTATION_LOCKED: Mutation of build, mission, or firmware is prohibited during active flight or pilot-control mode.',
      mode: flightMode,
      authority: 'BANE / FLIGHT_SAFETY'
    };
  }

  // 3. Full Access (Outside Pilot Mode / Grounded)
  return {
    status: 'FULL_ACCESS',
    reason: 'STATION_READY: Full workstation authority granted (Grounded/Observer Mode).',
    mode: flightMode,
    authority: 'SCIMEGA / AUTH'
  };
}
