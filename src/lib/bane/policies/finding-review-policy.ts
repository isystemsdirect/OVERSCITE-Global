// src/lib/bane/policies/finding-review-policy.ts
import { Policy } from '../policy';
import { Context } from '../context';
import { Decision } from '../decision';

export const findingReviewPolicy: Policy = {
  id: 'pol_finding_review',
  name: 'Finding Review Policy',
  description: 'Governs Accept, Reject, and Correct actions on findings.',
  evaluate: async (action: string, resource: string, context: Context): Promise<Decision> => {
    if (action !== 'finding.review') {
        return { type: 'DENY', reasonCode: 'UNSUPPORTED_ACTION', mode: 'NORMAL' };
    }

    // Role check
    if (context.userRole !== 'reviewer' && context.userRole !== 'director') {
      return {
        type: 'DENY',
        reasonCode: 'INSUFFICIENT_ROLE',
        reasonDetail: 'Only reviewers or directors can perform finding reviews.',
        mode: 'NORMAL',
      };
    }

    // Posture check
    if (context.devicePosture !== 'secure') {
      return {
        type: 'DENY',
        reasonCode: 'UNSAFE_POSTURE',
        reasonDetail: 'Finding review requires a secure device posture.',
        mode: 'NORMAL',
      };
    }

    return { type: 'ALLOW', reasonCode: 'OK', mode: 'NORMAL' };
  },
};
