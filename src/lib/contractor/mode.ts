/**
 * SCINGULAR Contractor Division — Mode Logic
 * 
 * Stateless computation of division operating mode.
 * Enforces strict Phase 2 (Jurisdiction/Rule) gating.
 */

import type { DivisionMode, GovernanceProfile, JurisdictionProfile } from './types';

export interface ModeContext {
  governance: GovernanceProfile;
  jurisdictionResolved: boolean;
  requirementProfileComputed: boolean;
  verificationMissing: boolean;
  authorizedSignerValid: boolean;
  sealAuthorityValid: boolean;
}

export function computeDivisionMode(ctx: ModeContext): DivisionMode {
  const { 
    governance, 
    jurisdictionResolved, 
    requirementProfileComputed, 
    verificationMissing,
    authorizedSignerValid,
    sealAuthorityValid
  } = ctx;

  // 1. SETUP_REQUIRED: Company governance prerequisites are materially incomplete
  // Check if at least one section has been drafted or uploaded
  const governanceStarted = governance.sections?.some(s => s.draftState !== 'none' || s.attachments.length > 0);
  if (!governanceStarted) {
    return 'SETUP_REQUIRED';
  }

  // 2. DRAFT_ASSIST_ONLY: Governance setup partially complete but rule-resolution is incomplete
  if (!jurisdictionResolved || !requirementProfileComputed) {
    return 'DRAFT_ASSIST_ONLY';
  }

  // 3. COMPLIANCE_READY: Rule resolution complete, but human approval/seal not yet ready
  if (verificationMissing || !authorizedSignerValid || !sealAuthorityValid) {
    return 'COMPLIANCE_READY';
  }

  // 4. CONTRACT_READY: All prerequisites met for governed issuance
  return 'CONTRACT_READY';
}
