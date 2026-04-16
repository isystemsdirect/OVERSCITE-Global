import { IPNRevocationEvent } from '../../../ipn/types';

export function evaluateRevocationScopeAllowed(
    operatorArcId: string,
    requestedScope: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL',
    operatorRoleContext: any,
    authorityBasis: string
): { 
    allowed: boolean, 
    reason: string,
    evaluatedScope: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL' | null,
    resultState: 'allowed_executed' | 'allowed_noop' | 'rejected_policy' | 'rejected_scope' | 'rejected_authority' | 'failed_runtime'
} {
    if (!operatorArcId) {
        return { allowed: false, reason: 'BANE DENY: Missing operator identity context for revocation.', evaluatedScope: null, resultState: 'rejected_authority' };
    }

    if (!authorityBasis) {
        return { allowed: false, reason: 'BANE DENY: Explicit authority basis required.', evaluatedScope: null, resultState: 'rejected_authority' };
    }

    const validScopes = ['SESSION', 'DEVICE', 'WORKSPACE', 'GLOBAL'];
    if (!validScopes.includes(requestedScope)) {
        return { allowed: false, reason: `BANE DENY: Unsupported requested scope: ${requestedScope}.`, evaluatedScope: null, resultState: 'rejected_scope' };
    }

    if (requestedScope === 'GLOBAL' || requestedScope === 'WORKSPACE') {
        if (operatorRoleContext?.isScingDirector !== true) {
            return { allowed: false, reason: 'BANE DENY: Global/Workspace revocation requires Director-level authority.', evaluatedScope: null, resultState: 'rejected_authority' };
        }
    }

    return { 
        allowed: true, 
        reason: `Revocation scope authorized under authority basis.`, 
        evaluatedScope: requestedScope,
        resultState: 'allowed_executed'
    };
}
