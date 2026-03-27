// src/lib/bane/policies/truth-seal-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateTruthSeal = (context: Context, attributes: any): Decision => {
    const { userRole } = context;
    const { truthMode } = attributes;

    if (userRole !== 'director' && userRole !== 'ADMIN') {
        return {
            type: 'DENY',
            reasonCode: 'UNAUTHORIZED_SEAL_ROLE',
            mode: 'NORMAL'
        };
    }

    if (userRole !== 'director' && userRole !== 'ADMIN') {
        return {
            type: 'DENY',
            reasonCode: 'UNAUTHORIZED_SEAL_ROLE',
            mode: 'NORMAL'
        };
    }

    if (truthMode === 'exception_flagged' && userRole !== 'director' && userRole !== 'ADMIN') {
         // Even stricter check for exception mode
         return {
            type: 'DENY',
            reasonCode: 'EXCEPTION_SEAL_REQUIRES_DIRECTOR',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
