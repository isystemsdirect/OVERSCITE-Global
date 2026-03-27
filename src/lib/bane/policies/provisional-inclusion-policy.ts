// src/lib/bane/policies/provisional-inclusion-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateProvisionalInclusion = (context: Context, attributes: any): Decision => {
    const { userRole, reason } = attributes;

    if (userRole !== 'supervisor' && userRole !== 'admin') {
        return {
            type: 'DENY',
            reasonCode: 'PROVISIONAL_INCLUSION_REQUIRES_SUPERVISOR',
            mode: 'NORMAL'
        };
    }

    if (!reason || reason.length < 10) {
        return {
            type: 'DENY',
            reasonCode: 'VALID_REASON_REQUIRED',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
