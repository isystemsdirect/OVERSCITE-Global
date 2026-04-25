"use client";

/**
 * SCIMEGA™ UIX State Model
 * Governs the visibility and posture of the unified command surface.
 */

import { SCIMEGAAuthorityFlowEvent, SCIMEGAAuthorityLevel } from './scimega-authority-flow-trace';

export type SCIMEGADomain = 
  | 'BUILD'
  | 'METHOD_FIT'
  | 'SCHEDULER'
  | 'EXPORT'
  | 'ARC_AUTH'
  | 'TELEMETRY'
  | 'TERMINAL'
  | 'AUDIT'
  | 'REPLAY'
  | 'TRAINING'
  | 'ARCHIVE'
  | 'PRODUCTION'
  | 'BFI_AUTONOMY'
  | 'PL_BOUNDARY'
  | 'DRY_LINK';

export type SCIMEGADomainGroup = 
  | 'Build_And_Config'
  | 'Governance'
  | 'Operation'
  | 'Execution_Surface'
  | 'Intelligence_Training';

export type SCIMEGASystemStatus = 'SIMULATION' | 'DRY-LINK' | 'LIVE_LOCKED';

export interface SCIMEGAUIXState {
  activeDomain: SCIMEGADomain;
  systemStatus: SCIMEGASystemStatus;
  authorityPresence: {
    scing: boolean;
    iu: boolean;
    bane: boolean;
    teon: boolean;
    arc: boolean;
  };
  dominantAuthorityState: SCIMEGAAuthorityLevel;
  activePreemptionReason?: string;
  scingAdvisory: {
    statement: string;
    interpretation: string;
    explanation?: string;
  };
  authorityFlowEvents: SCIMEGAAuthorityFlowEvent[];
  alertSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readinessPosture: 'INITIALIZING' | 'VALIDATING' | 'READY' | 'RESTRICTED';
}

export const INITIAL_UIX_STATE: SCIMEGAUIXState = {
  activeDomain: 'BUILD',
  systemStatus: 'SIMULATION',
  authorityPresence: {
    scing: true,
    iu: true,
    bane: true,
    teon: true,
    arc: true
  },
  dominantAuthorityState: 'PILOT_CONTROL',
  scingAdvisory: {
    statement: "Mission remains simulation-only. No live control path is active.",
    interpretation: "Sovereign Human Authority maintained via simulation boundary."
  },
  authorityFlowEvents: [],
  alertSeverity: 'NONE',
  readinessPosture: 'INITIALIZING'
};
