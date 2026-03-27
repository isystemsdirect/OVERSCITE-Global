/**
 * LARI Contractor Engine
 *
 * Domain orchestration for contractor/subcontractor classification, 
 * compliance flow, proposal support, and oversight logic.
 *
 * Authority: UTCB-G
 */

import type { LariPipelineRequest, LariPipelineFinding, LariStageTrace } from '../contracts';
import { resolveRequirements } from '../../../src/lib/contractor/resolutionService';
import type { 
  RoleClass, 
  JurisdictionProfile, 
  ProjectScopeProfile, 
  ProposalProfile, 
  ContractProfile,
  ComplianceDecisionPacket,
  GovernanceProfile
} from '../../../src/lib/contractor/types';

import { computeDivisionMode, type ModeContext } from '../../../src/lib/contractor/mode';

export interface ContractorResult {
  findings: LariPipelineFinding[];
  trace: LariStageTrace;
  proposal?: ProposalProfile;
  contract?: ContractProfile;
}

/**
 * Generates a structured proposal draft based on scope and resolved requirements.
 */
export function generateProposalDraft(
  partyId: string,
  scope: ProjectScopeProfile,
  requirements: any
): ProposalProfile {
  return {
    id: `prop-${Date.now()}`,
    party_id: partyId,
    title: `Proposal: ${scope.project_type.toUpperCase()} - ${scope.trade_scope.join(', ')}`,
    scope_summary: `Governed discovery for ${scope.project_type} project focusing on ${scope.trade_scope.join('/')}.`,
    base_value: scope.estimated_value,
    draft_text: `[LARI GENERATED DRAFT]\nScope: ${scope.trade_scope.join(', ')}\nValue: $${scope.estimated_value}\nCompliance Note: ${requirements.mandatory_licenses.join(', ') || 'Standard Compliance'}.`,
    compliance_audit: { 
      packet_id: `audit-${Date.now()}`,
      decision_result: 'review_required', 
      reason_chain: ['Initial LARI generation', `Requirement set: ${requirements.mandatory_licenses.join(', ') || 'Standard'}`],
      rule_matrix_version: '2026.01.CD',
      source_refs: ['LARI-CONTRACTOR'],
      unresolved_flags: ['human_seal_required']
    } as ComplianceDecisionPacket,
    seal_status: 'draft',
    created_at: new Date().toISOString()
  };
}

/**
 * Generates a contract draft with jurisdiction-specific clauses.
 */
export function generateContractDraft(
  proposal: ProposalProfile,
  jurisdiction: JurisdictionProfile
): ContractProfile {
  const clauses = [
    'Standard Performance Clause',
    'Payment Terms (Net 30)',
    'Indemnification'
  ];

  if (jurisdiction.state.toUpperCase() === 'CA') {
    clauses.push('CA Civil Code §7018.5 (Mechanics Lien Notice)');
  }

  return {
    id: `cont-${Date.now()}`,
    proposal_id: proposal.id,
    jurisdiction,
    clauses,
    final_text: `Governed Agreement under ${jurisdiction.state} law. Clauses: ${clauses.join('; ')}.`,
    seal_authority: 'Awaiting Human Seal',
    seal_status: 'draft'
  };
}

export function runContractorEngine(
  req: LariPipelineRequest,
  inputFindings: LariPipelineFinding[] = []
): ContractorResult {
  const startMs = Date.now();
  const findings: LariPipelineFinding[] = [...inputFindings];

  // 1. Extraction from request metadata/context
  const role = (req.metadata?.role_type as RoleClass) || 'prime_contractor';
  const jurisdiction = (req.metadata?.jurisdiction as JurisdictionProfile) || { state: 'CA', local_overlay_required: false, controlling_authority: 'CSLB', rule_version_date: '2026-01-01' };
  const scope = (req.metadata?.scope as ProjectScopeProfile) || { project_type: 'residential', trade_scope: ['general'], estimated_value: 5000, permit_required: true, specialty_flags: [] };
  const intent = (req.metadata?.intent as string) || '';
  const governance = (req.metadata?.governance as GovernanceProfile) || { sections: [] };

  // 2. Refusal Logic for Forged/Official Records
  const sensitiveTerms = ['forge', 'fake', 'template license', 'falsify certificate', 'mock registration'];
  if (sensitiveTerms.some(term => req.text.toLowerCase().includes(term))) {
    findings.push({
      id: `refusal-${Date.now()}`,
      title: 'Prohibited Generation Request',
      description: 'The requested action involves generating official credentials or forged records. This is strictly prohibited by SCINGULAR governance and the BANE-gated Contractor Division policy.',
      confidence: 1.0,
      source: 'contractor'
    });
    return { 
      findings, 
      trace: { engineId: 'LARI-CONTRACTOR', stage: 'refusal', durationMs: Date.now() - startMs, inputSummary: req.text, outputSummary: 'Governed Refusal' } 
    };
  }

  // 3. Rule Resolution & Mode Computation
  const requirements = resolveRequirements(role, jurisdiction, scope);
  
  const modeCtx: ModeContext = {
    governance,
    jurisdictionResolved: !!jurisdiction.state, // Simple heuristic for Phase 2 implementation
    requirementProfileComputed: requirements.mandatory_licenses.length > 0 || requirements.mandatory_registrations.length > 0,
    verificationMissing: true, // Defaulting to unverified posture
    authorizedSignerValid: !!governance.authorized_signers?.length,
    sealAuthorityValid: !!governance.seal_authority?.length
  };

  const currentMode = computeDivisionMode(modeCtx);

  // 4. Mode-Based Gating
  if (intent === 'draft_contract' && currentMode !== 'CONTRACT_READY') {
    findings.push({
      id: `mode-lock-${Date.now()}`,
      title: 'Draft Assist Mode Active',
      description: `Contract drafting is currently limited to Draft Assist Only. Mode '${currentMode}' blocks full governed issuance until Phase 2 rule-resolution and verification readiness are satisfied.`,
      confidence: 1.0,
      source: 'contractor'
    });
  }

  // Findings generation logic...
  if (requirements.mandatory_licenses.length > 0) {
    findings.push({
      id: `req-lic-${Date.now()}`,
      title: 'Mandatory Licensing Identified',
      description: `Requirement profile for ${jurisdiction.state} identifies mandatory licenses: ${requirements.mandatory_licenses.join(', ')}.`,
      confidence: 1.0,
      source: 'contractor'
    });
  }

  // Generative drafting (Phase 3 Recalibrated)
  let proposal: ProposalProfile | undefined;
  let contract: ContractProfile | undefined;

  // Proposals are allowed in DRAFT_ASSIST_ONLY
  if (intent === 'draft_proposal' && (currentMode === 'DRAFT_ASSIST_ONLY' || currentMode === 'COMPLIANCE_READY' || currentMode === 'CONTRACT_READY')) {
    const partyId = (req.metadata?.party_id as string) || 'unassigned';
    proposal = generateProposalDraft(partyId, scope, requirements);
    findings.push({
      id: `prop-draft-${Date.now()}`,
      title: 'Proposal Draft Generated (Assist Only)',
      description: `Synthesized assistive proposal for ${scope.project_type}. Not for final issuance.`,
      confidence: 0.95,
      source: 'contractor'
    });
  }

  const effectiveProposal = proposal || (req.metadata?.proposal as ProposalProfile);

  // Contracts are strictly gated
  if (effectiveProposal && intent === 'draft_contract' && currentMode === 'CONTRACT_READY') {
    contract = generateContractDraft(effectiveProposal, jurisdiction);
    findings.push({
      id: `cont-draft-${Date.now()}`,
      title: 'Contract Draft Generated',
      description: `Synthesized governed agreement for ${jurisdiction.state} jurisdiction.`,
      confidence: 0.95,
      source: 'contractor'
    });
  }

  const trace: LariStageTrace = {
    engineId: 'LARI-CONTRACTOR',
    stage: 'analysis',
    durationMs: Date.now() - startMs,
    inputSummary: `Processing contractor domain request: ${req.text.substring(0, 50)}...`,
    outputSummary: `Orchestrated ${findings.length} findings. Active Mode: ${currentMode}.`,
  };

  return { findings, trace, proposal, contract };
}
