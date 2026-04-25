/**
 * @classification BANE_PROPOSAL_SIGNING_GATE
 * @authority BANE Governance Layer
 * @purpose Evaluates if a generated configuration proposal is eligible for ARC Identity authorization.
 */

import type { SCIMEGAConfigurationProposal } from '../export/scimega-export-types';
import type { ARCProposalAuthorization } from './arc-proposal-authorization';

export type ProposalSigningVerdict = 'APPROVABLE' | 'REVIEW_REQUIRED' | 'REJECTED' | 'BLOCKED';

export interface ProposalSigningGateResult {
  verdict: ProposalSigningVerdict;
  reasons: string[];
}

export class BaneProposalSigningGate {
  /**
   * Validates if the configuration artifact can be signed by an ARC identity.
   */
  static evaluate(
    proposal: SCIMEGAConfigurationProposal,
    arcIdentityPresent: boolean,
    hasHardwareWriteIntent: boolean
  ): ProposalSigningGateResult {
    const result: ProposalSigningGateResult = {
      verdict: 'APPROVABLE',
      reasons: []
    };

    let isBlocked = false;
    let isRejected = false;
    let needsReview = false;

    // Hard Rules
    if (!arcIdentityPresent) {
      result.reasons.push('FATAL: Valid ARC Identity is missing. Anonymous or unauthenticated signatures are rejected.');
      return { verdict: 'BLOCKED', reasons: result.reasons };
    }

    if (hasHardwareWriteIntent) {
      result.reasons.push('FATAL: Hardware write intent detected. Proposal signing is strictly limited to draft mapping ONLY.');
      return { verdict: 'BLOCKED', reasons: result.reasons };
    }

    // Contextual Rules
    if (proposal.overallStatus === 'blocked') {
      result.reasons.push('Proposal is in a BLOCKED state. Signature refused.');
      isBlocked = true;
    }

    if (proposal.overallStatus === 'review_required' || proposal.overallStatus === 'draft') {
      result.reasons.push(`Proposal status '${proposal.overallStatus}' requires manual inspection prior to signature.`);
      needsReview = true;
    }
    
    if (proposal.diff.classification === 'safety_relevant' || proposal.diff.classification === 'firmware_adjacent') {
      result.reasons.push(`Diff classification '${proposal.diff.classification}' requires manual review.`);
      needsReview = true;
    }

    if (isBlocked) {
      result.verdict = 'BLOCKED';
    } else if (isRejected) {
      result.verdict = 'REJECTED';
    } else if (needsReview) {
      result.verdict = 'REVIEW_REQUIRED';
    }

    return result;
  }
}
