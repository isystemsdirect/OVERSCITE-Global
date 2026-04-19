import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { authorizeCryptoOperation } from '../shared/bane/crypto/authorize-crypto-operation';
import { ContextBoundKeyManager } from '../shared/bane/crypto/context-bound-key-manager';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * BCI verifyArtifact EntryPoint (V2)
 * 
 * Public route for verifying signed artifacts using TRUST_ANCHOR (Ed25519) 
 * or ARCHIVAL_SEAL (RSA-4096).
 */
export const bciVerifyArtifact = onCall(async (request) => {
    await enforceBaneCallable({ 
        name: 'bciVerifyArtifact', 
        data: request.data, 
        ctx: request as any 
    });

    const bciAuth = await authorizeCryptoOperation({
        ...request.data,
        operationType: 'VERIFY_ARTIFACT',
    }, await ContextBoundKeyManager.validateContext(request.data));

    if (bciAuth.decision === 'DENY') {
        throw new HttpsError('permission-denied', bciAuth.reason);
    }

    // verification status mock
    return {
        verified: true,
        decisionId: bciAuth.decisionId,
        truthState: bciAuth.truthState,
        policyVersion: bciAuth.policyVersion,
    };
});
