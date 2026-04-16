import { BCIAuthorizationRequest, BCIAuthorizationResponse } from './types';
import { BCI_POLICY_VERSION, evaluateBCIOutcome } from './policy';
import { v4 as uuidv4 } from 'uuid';

/**
 * authorizeCryptoOperation
 * 
 * The core entry gate for governed cryptographic execution.
 * Evaluates authority, intent, scope, and environment before permitting
 * cryptographic operations.
 */
export async function authorizeCryptoOperation(
    request: BCIAuthorizationRequest,
    context: {
        isRevoked: boolean;
        hasAnomaly: boolean;
        isScopeValid: boolean;
        traceId?: string;
    }
): Promise<BCIAuthorizationResponse> {
    const decisionId = uuidv4();
    
    // Evaluate the request against BCI Policy logic
    const outcome = evaluateBCIOutcome(request.operationType, {
        environment: request.environmentClass,
        isRevoked: context.isRevoked,
        hasAnomaly: context.hasAnomaly,
        isScopeValid: context.isScopeValid,
    });

    return {
        decision: outcome.decision,
        decisionId,
        truthState: outcome.truthState,
        reason: outcome.truthState === 'authorized' 
            ? 'Access permitted by BCI Policy' 
            : `Access ${outcome.decision.toLowerCase()} due to ${outcome.truthState.replace(/_/g, ' ')}`,
        restrictions: outcome.restrictions,
        policyVersion: BCI_POLICY_VERSION,
    };
}
