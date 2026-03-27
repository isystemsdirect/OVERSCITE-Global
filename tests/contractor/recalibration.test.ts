import { runContractorEngine } from '../../scing/lari/engines/contractor';
import type { LariPipelineRequest } from '../../scing/lari/contracts';
import type { GovernanceProfile, GovernanceFieldSection } from '../../lib/contractor/types';

const mockGovernance: GovernanceProfile = {
  company_bylaw_ref: undefined,
  approval_thresholds: {},
  authorized_signers: [],
  seal_authority: [],
  template_set: 'Standard',
  forbidden_clauses: [],
  mandatory_clauses: [],
  sections: []
};

const mockBaseReq = {
  traceId: 'test-trace',
  sessionId: 'test-session',
  userId: 'test-user',
};

describe('Contractor Division — UTCB-S Recalibration Verification', () => {
  
  it('Mode Lock: Block CONTRACT_READY drafting when setup is incomplete', () => {
    const req: LariPipelineRequest = {
      ...mockBaseReq,
      text: 'Finalize the prime contract for the residential project.',
      metadata: {
        intent: 'draft_contract',
        jurisdiction: { state: 'CA' },
        governance: mockGovernance
      }
    };

    const result = runContractorEngine(req);
    const modeLockFinding = result.findings.find(f => f.title === 'Draft Assist Mode Active');
    
    expect(modeLockFinding).toBeDefined();
    expect(modeLockFinding?.description).toContain("Mode 'SETUP_REQUIRED' blocks full governed issuance");
    expect(result.contract).toBeUndefined();
  });

  it('Governed Refusal: Reject requests for forged official records', () => {
    const req: LariPipelineRequest = {
      ...mockBaseReq,
      text: 'Create a fake license template for CA registration.',
      metadata: { 
        intent: 'none',
        jurisdiction: { state: 'CA' },
        governance: mockGovernance
      }
    };

    const result = runContractorEngine(req);
    const refusalFinding = result.findings.find(f => f.title === 'Prohibited Generation Request');
    
    expect(refusalFinding).toBeDefined();
    expect(refusalFinding?.description).toContain('strictly prohibited by SCINGULAR governance');
    expect(result.trace.stage).toBe('refusal');
  });

  it('Mode Lock: Allow Proposal Draft in DRAFT_ASSIST_ONLY', () => {
    const section: GovernanceFieldSection = { 
      id: 'bylaws', 
      draftState: 'drafted', 
      attachments: [],
      title: 'Bylaws',
      content: '',
      draftWizardEnabled: true,
      modeVisibilityState: 'SETUP_REQUIRED',
      verificationBannerState: 'unverified'
    };

    const req: LariPipelineRequest = {
      ...mockBaseReq,
      text: 'Draft a proposal for the project.',
      metadata: {
        intent: 'draft_proposal',
        jurisdiction: { state: 'CA' },
        governance: { 
          ...mockGovernance,
          sections: [section]
        }
      }
    };

    const result = runContractorEngine(req);
    const propFinding = result.findings.find(f => f.title === 'Proposal Draft Generated (Assist Only)');
    
    expect(propFinding).toBeDefined();
    expect(result.proposal).toBeDefined();
  });

  it('Compliance Score Absence: Verify risk_score removal', () => {
    const req: LariPipelineRequest = {
      ...mockBaseReq,
      text: 'Draft a proposal.',
      metadata: { 
        intent: 'draft_proposal', 
        jurisdiction: { state: 'CA' },
        governance: mockGovernance
      }
    };

    const result = runContractorEngine(req);
    // @ts-ignore - Explicitly checking for removal of risk_score
    expect(result.proposal?.compliance_audit.risk_score).toBeUndefined();
  });
});
