/**
 * @fileOverview SCIMEGA™ Workstation Domain Model
 * @authority Director
 * @domain SCIMEGA™ Workstation
 * @status DEFINITIVE
 */

export type SCIMEGAWorkstationDomain = 
  | 'build_lab'
  | 'mission_lab'
  | 'calibration_lab'
  | 'archivem_packages'
  | 'drylink_contracts'
  | 'pl_dl_status'
  | 'diagnostics'
  | 'telemetry_replay'
  | 'audit_training'
  | 'autonomy_simulation';

export type SCIMEGAWorkstationModule = {
  id: string;
  domain: SCIMEGAWorkstationDomain;
  label: string;
  isFlightSafe: boolean;
};

export type SCIMEGAWorkstationAccessState = 
  | 'FULL_ACCESS'
  | 'CALIBRATION_ONLY'
  | 'READ_ONLY'
  | 'LOCKED'
  | 'BLOCKED';

export type WorkstationAccessReason = {
  status: SCIMEGAWorkstationAccessState;
  reason: string;
  mode: string;
  authority: string;
};

export type SCIMEGAFlightSafeCalibrationModule = SCIMEGAWorkstationModule & {
  isFlightSafe: true;
};
