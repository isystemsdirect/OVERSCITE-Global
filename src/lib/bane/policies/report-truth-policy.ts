// src/lib/bane/policies/report-truth-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateReportTruth = (context: Context, attributes: any): Decision => {
    const { pendingFindingsCount = 0, userRole } = attributes;

    if (pendingFindingsCount > 0) {
        return {
            type: 'DENY',
            reasonCode: 'UNREVIEWED_FINDINGS_PRESENT',
            mode: 'NORMAL'
        };
    }

    if (userRole !== 'reviewer' && userRole !== 'supervisor' && userRole !== 'admin') {
        return {
            type: 'DENY',
            reasonCode: 'INSUFFICIENT_ROLE_FOR_FINALIZATION',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
