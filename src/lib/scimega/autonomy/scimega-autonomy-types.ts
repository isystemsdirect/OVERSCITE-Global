/**
 * @classification SCIMEGA_AUTONOMY
 * @authority Flight Autonomy Architecture Unit
 * @purpose Defines the foundational types for SCIMEGA BFI-Governed Flight Autonomy.
 * @warning These types represent simulation/architecture models only. No live flight is authorized.
 */

export type SCIMEGAFlightMode = 
  | 'manual_pilot'
  | 'assisted_pilot'
  | 'partial_automation'
  | 'full_mission_automation'
  | 'pilot_interrupt'
  | 'security_override'
  | 'anchor_hold'
  | 'return_to_origin';

export type SCIMEGAControlAuthority = 
  | 'IU_PILOT'
  | 'SCING_BFI'
  | 'SHARED_ASSISTED'
  | 'BANE_HOLD'
  | 'TEON_SAFETY';

export interface SCIMEGAAutonomyState {
  activeMode: SCIMEGAFlightMode;
  controlAuthority: SCIMEGAControlAuthority;
  pilotInterruptAvailable: boolean;
  teonEnvelopeActive: boolean;
  baneAutomationApproved: boolean;
  isSimulationOnly: boolean;
}

export type SCIMEGAMissionStepType = 
  | 'waypoint'
  | 'capture'
  | 'hover'
  | 'scan'
  | 'pause'
  | 'abort'
  | 'return_to_origin';

export interface SCIMEGAMissionStep {
  stepId: string;
  type: SCIMEGAMissionStepType;
  targetAltitudeMeters?: number;
  targetDurationSeconds?: number;
  description: string;
  isSafeToExecute: boolean;
}

export interface SCIMEGAMissionPlan {
  planId: string;
  arcId: string;
  steps: SCIMEGAMissionStep[];
  isAuthorized: boolean;
  validationReason?: string;
}

export type SCIMEGAPilotInterruptSeverity = 
  | 'soft_interrupt'
  | 'hard_interrupt'
  | 'security_override'
  | 'emergency_takeover';

export interface SCIMEGAPilotInterruptEvent {
  eventId: string;
  timestamp: string;
  severity: SCIMEGAPilotInterruptSeverity;
  triggerSource: 'stick' | 'yoke' | 'throttle' | 'switch_value' | 'software_stop';
  requiresAnchorHold: boolean;
}
