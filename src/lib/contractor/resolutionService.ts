/**
 * SCINGULAR Contractor Division — Rule Resolution Service
 *
 * Stateless logic for mapping Party + Jurisdiction + Scope to Requirements.
 *
 * Authority: UTCB-G
 */

import type { 
  RoleClass, 
  JurisdictionProfile, 
  ProjectScopeProfile, 
  LicenseProfile,
  VerificationStatus
} from './types';

export interface RequirementProfile {
  mandatory_licenses: string[];
  mandatory_registrations: string[];
  mandatory_bonds: boolean;
  mandatory_insurance: string[];
  local_competency_required: boolean;
  notes: string[];
}

/**
 * Resolves the requirement profile based on entity and project data.
 */
export function resolveRequirements(
  role: RoleClass,
  jurisdiction: JurisdictionProfile,
  scope: ProjectScopeProfile
): RequirementProfile {
  const profile: RequirementProfile = {
    mandatory_licenses: [],
    mandatory_registrations: [],
    mandatory_bonds: false,
    mandatory_insurance: ['General Liability', 'Workers Comp'],
    local_competency_required: jurisdiction.local_overlay_required,
    notes: []
  };

  const state = jurisdiction.state.toUpperCase();

  // --- CALIFORNIA (CA) RULES ---
  if (state === 'CA' || state === 'CALIFORNIA') {
    if (scope.estimated_value >= 500) {
      profile.mandatory_licenses.push('CSLB State License');
      profile.notes.push('CA Business & Professions Code §7000: License required for jobs ≥ $500.');
    }
  }

  // --- FLORIDA (FL) RULES ---
  else if (state === 'FL' || state === 'FLORIDA') {
    profile.mandatory_licenses.push('DBPR State Registration/Certification');
    if (jurisdiction.local_overlay_required) {
      profile.mandatory_licenses.push('Local Competency Card');
    }
  }

  // --- NEW YORK (NY) RULES ---
  else if (state === 'NY' || state === 'NEW YORK') {
    if (jurisdiction.city?.toUpperCase() === 'NEW YORK CITY' || jurisdiction.city?.toUpperCase() === 'NYC') {
      profile.mandatory_licenses.push('NYC DCA Home Improvement Contractor License');
    } else {
      profile.notes.push('NY State: Licensing is primarily managed at the County/City level.');
    }
  }

  // Specialty Trade Rules
  if (role === 'specialty_trade_entity' || scope.trade_scope.some(t => ['electrical', 'plumbing', 'hvac'].includes(t.toLowerCase()))) {
    profile.mandatory_licenses.push('Trade-Specific Professional License');
    profile.notes.push('Critical trade identified: specialized licensing check mandatory.');
  }

  return profile;
}

/**
 * Normalizes a verification status with a fail-safe posture.
 */
export function getFailSafeStatus(
  currentStatus: VerificationStatus,
  hasSourceConflict: boolean
): VerificationStatus {
  if (hasSourceConflict) return 'source_conflict';
  if (currentStatus === 'unverified') return 'unverified';
  return currentStatus;
}
