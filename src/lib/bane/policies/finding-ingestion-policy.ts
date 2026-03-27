// src/lib/bane/policies/finding-ingestion-policy.ts
import { Policy } from '../policy';
import { Context } from '../context';
import { Decision } from '../decision';

export const findingIngestionPolicy: Policy = {
  id: 'pol_finding_ingestion',
  name: 'Finding Ingestion Policy',
  description: 'Governs eligibility for finding ingestion into system truth.',
  evaluate: async (action: string, resource: string, context: Context): Promise<Decision> => {
    if (action !== 'finding.ingest') {
        return { type: 'DENY', reasonCode: 'UNSUPPORTED_ACTION', mode: 'NORMAL' };
    }

    // Required status must be passed in context.attributes
    const status = context.attributes?.findingStatus;

    if (status !== 'accepted' && status !== 'corrected') {
      return {
        type: 'DENY',
        reasonCode: 'NOT_ELIGIBLE',
        reasonDetail: 'Only accepted or corrected findings are eligible for ingestion.',
        mode: 'NORMAL',
      };
    }

    return { type: 'ALLOW', reasonCode: 'OK', mode: 'NORMAL' };
  },
};
