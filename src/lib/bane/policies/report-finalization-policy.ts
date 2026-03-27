// src/lib/bane/policies/report-finalization-policy.ts
import { Policy } from '../policy';
import { Context } from '../context';
import { Decision } from '../decision';

export const reportFinalizationPolicy: Policy = {
  id: 'pol_report_finalization',
  name: 'Report Finalization Policy',
  description: 'Prevents report finalization if pending findings exist.',
  evaluate: async (action: string, resource: string, context: Context): Promise<Decision> => {
    if (action !== 'report.finalize') {
        return { type: 'DENY', reasonCode: 'UNSUPPORTED_ACTION', mode: 'NORMAL' };
    }

    const pendingCount = context.attributes?.pendingFindingsCount || 0;

    if (pendingCount > 0) {
      return {
        type: 'DENY',
        reasonCode: 'PENDING_FINDINGS',
        reasonDetail: `Cannot finalize report with ${pendingCount} pending findings.`,
        mode: 'NORMAL',
      };
    }

    return { type: 'ALLOW', reasonCode: 'OK', mode: 'NORMAL' };
  },
};
