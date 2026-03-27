// src/lib/bane/policies/correction-escalation-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateCorrectionEscalation = (context: Context, attributes: any): Decision => {
    const { userRole } = context;
    const { escalationStatus } = attributes;

    if (escalationStatus === 'pending_review' && (userRole !== 'supervisor' && userRole !== 'director' && userRole !== 'ADMIN')) {
        return {
            type: 'DENY',
            reasonCode: 'UNAUTHORIZED_ESCALATION_RESOLUTION_ROLE',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
