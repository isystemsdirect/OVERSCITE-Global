// src/lib/bane/policies/sealed-mutation-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateSealedMutation = (context: Context, attributes: any): Decision => {
    const { isSealed, isTruthBearing } = attributes;

    if (isSealed && isTruthBearing) {
        return {
            type: 'DENY',
            reasonCode: 'SEALED_REPORT_READ_ONLY',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
