/**
 * @classification ARC_PROPOSAL_AUTHORIZATION
 * @authority ARC Identity Authorization Layer
 * @purpose Defines the human authorization intent for configuration proposals.
 * @warning Authorization applies to the *proposal record only*, NOT to hardware mutation.
 */

export type ARCAuthorizationStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export interface ARCProposalAuthorization {
  id: string;
  proposalId: string;
  arcId: string;
  humanName: string;
  role: string;
  timestamp: string;
  status: ARCAuthorizationStatus;
  approvalScope: string; // e.g., "Configuration intent mapping only. No flash execution."
  signaturePlaceholder: string; // Mock cryptographic signature for Phase 4
}
