/**
 * @classification SCIMEGA_EXPORT_TYPES
 * @authority SCIMEGA Export Boundary Unit
 * @purpose Defines the strong types for proposal-grade export artifacts.
 */

export type SCIMEGAExportTarget = 
  | 'betaflight_msp'
  | 'cleanflight_msp'
  | 'ardupilot_mavlink'
  | 'px4_mavlink'
  | 'companion_raspberry_pi'
  | 'companion_jetson'
  | 'scimega_dos_manifest';

export type SCIMEGAExportStatus = 
  | 'draft'
  | 'review_required'
  | 'approved_for_export'
  | 'proposal_ready' // Renamed from flash-ready semantics
  | 'blocked'
  | 'unsupported';

export interface SCIMEGAExportArtifact {
  id: string;
  target: SCIMEGAExportTarget;
  status: SCIMEGAExportStatus;
  payloadType: 'json' | 'text' | 'yaml';
  payloadContent: string;
  generatedAt: string;
  warningFlag: string; // Must contain NO-FLASH warning
  noFlashBoundary: true;
  hardwareMutationAuthorized: false;
  arcAuthorizationId?: string; // Optional reference to an ARC Proposal Authorization
}

export interface SCIMEGAConfigurationDiff {
  hasChanges: boolean;
  classification: 'cosmetic' | 'operational' | 'safety_relevant' | 'firmware_adjacent' | 'blocked';
  humanReadableSummary: string[];
  machineReadableChanges: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

export interface SCIMEGAConfigurationProposal {
  proposalId: string;
  buildId: string;
  artifacts: SCIMEGAExportArtifact[];
  diff: SCIMEGAConfigurationDiff;
  overallStatus: SCIMEGAExportStatus;
  blockers: string[];
  authorizationState: 'pending' | 'approved' | 'rejected' | 'revoked';
}

export interface SCIMEGAExportReadiness {
  isReady: boolean;
  supportedTargets: SCIMEGAExportTarget[];
  unsupportedTargets: SCIMEGAExportTarget[];
  reasons: string[];
}
