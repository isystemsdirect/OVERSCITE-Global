import { runContractorEngine } from '../../scing/lari/engines/contractor';
import type { LariPipelineRequest } from '../../scing/lari/contracts';

describe('Contractor Generative Drafting', () => {
  const baseRequest: LariPipelineRequest = {
    traceId: 'test-trace',
    text: 'Draft a proposal for a residential electrical project in CA.',
    sessionId: 'test-session',
    userId: 'test-user',
    metadata: {
      intent: 'draft_proposal',
      role_type: 'prime_contractor',
      jurisdiction: { state: 'CA', local_overlay_required: false, controlling_authority: 'CSLB', rule_version_date: '2026-01-01' },
      scope: { project_type: 'residential', trade_scope: ['electrical'], estimated_value: 5000, permit_required: true, specialty_flags: [] },
      party_id: 'party-123'
    }
  };

  test('Synthesis: generates a proposal draft when intent is "draft_proposal"', () => {
    const result = runContractorEngine(baseRequest);
    expect(result.proposal).toBeDefined();
    expect(result.proposal?.title).toContain('ELECTRICAL');
    expect(result.proposal?.draft_text).toContain('CSLB');
    expect(result.proposal?.seal_status).toBe('draft');
  });

  test('Jurisdiction: selects CA-specific clauses during contract drafting', () => {
    const proposalResult = runContractorEngine(baseRequest);
    const proposal = proposalResult.proposal!;
    
    const contractRequest: LariPipelineRequest = {
      ...baseRequest,
      metadata: {
        ...baseRequest.metadata,
        intent: 'draft_contract',
        proposal
      }
    };
    
    const result = runContractorEngine(contractRequest);
    expect(result.contract).toBeDefined();
    expect(result.contract?.clauses).toContain('CA Civil Code §7018.5 (Mechanics Lien Notice)');
  });

  test('BANE Posture: compliance audit is attached with review_required status', () => {
    const result = runContractorEngine(baseRequest);
    expect(result.proposal?.compliance_audit.decision_result).toBe('review_required');
    expect(result.proposal?.compliance_audit.unresolved_flags).toContain('human_seal_required');
  });
});
