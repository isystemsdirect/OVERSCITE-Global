/**
 * SCINGULAR Contractor Division — Core Data Models
 *
 * Authority: UTCB-G
 */

export type RoleClass = 
  | 'prime_contractor'
  | 'subcontractor'
  | 'employee_or_crew'
  | 'specialty_trade_entity'
  | 'qualifying_person';

export type PartyEntity = {
  party_id: string;
  role_type: RoleClass;
  prime_or_sub: 'prime' | 'sub';
  company_or_person_name: string;
  direct_to_owner: boolean;
  trade_class: string[];
  self_perform_allowed: boolean;
  qualifier_ref?: string;
  insurance_ref?: string;
  bond_ref?: string;
};

export type JurisdictionProfile = {
  state: string;
  county?: string;
  city?: string;
  local_overlay_required: boolean;
  controlling_authority: string;
  rule_version_date: string;
};

export type VerificationStatus = 
  | 'verified_active' 
  | 'verified_expired' 
  | 'verified_registered_only'
  | 'unverified' 
  | 'source_unavailable'
  | 'source_conflict' 
  | 'conflict_detected'
  | 'manual_review_required' 
  | 'jurisdiction_incomplete'
  | 'requirement_profile_incomplete';

export type DivisionMode = 
  | 'SETUP_REQUIRED' 
  | 'DRAFT_ASSIST_ONLY' 
  | 'COMPLIANCE_READY' 
  | 'CONTRACT_READY';

export type SealStatus = 'draft' | 'sealed' | 'superseded';

export type DraftState = 'none' | 'drafted' | 'reviewed' | 'approved';

export interface FieldAttachment {
  id: string;
  fileName: string;
  fileType: string;
  purpose: 'reference' | 'branding' | 'policy_source' | 'supporting_doc';
  uploadedAt: string;
  uploadedBy: string;
  sourcePreserved: boolean;
  sourceHash?: string;
}

export interface GovernanceFieldSection {
  id: string;
  title: string;
  content: string;
  attachments: FieldAttachment[];
  draftWizardEnabled: boolean;
  draftState: DraftState;
  modeVisibilityState: DivisionMode;
  verificationBannerState: VerificationStatus;
}

export interface ProposalProfile {
  id: string;
  party_id: string;
  title: string;
  scope_summary: string;
  base_value: number;
  draft_text: string;
  compliance_audit: ComplianceDecisionPacket;
  seal_status: SealStatus;
  created_at: string;
}

export interface ContractProfile {
  id: string;
  proposal_id: string;
  jurisdiction: JurisdictionProfile;
  clauses: string[];
  final_text: string;
  seal_authority: string; // Human Identity from Scing
  seal_status: SealStatus;
  sealed_at?: string;
}

export type LicenseProfile = {
  license_number?: string;
  registration_number?: string;
  issuing_authority: string;
  license_class: string;
  status: VerificationStatus;
  verified_at?: string;
  expiration_date?: string;
  source_ref: string;
};

export type ProjectScopeProfile = {
  project_type: string;
  trade_scope: string[];
  estimated_value: number;
  permit_required: boolean;
  specialty_flags: string[];
  threshold_class?: string;
};

export type GovernanceProfile = {
  company_bylaw_ref?: string;
  approval_thresholds: Record<string, number>;
  authorized_signers: string[];
  seal_authority: string[];
  template_set: string;
  forbidden_clauses: string[];
  mandatory_clauses: string[];
  sections: GovernanceFieldSection[];
};

export type ComplianceDecisionPacket = {
  packet_id: string;
  decision_result: 'compliant' | 'review_required' | 'blocked';
  reason_chain: string[];
  rule_matrix_version: string;
  source_refs: string[];
  unresolved_flags: string[];
  // risk_score removed as per UTCB-S score prohibition
};
