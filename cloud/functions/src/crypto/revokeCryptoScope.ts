import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { RevocationEngine } from '../shared/bane/crypto/revocation-engine';
import { authorizeCryptoOperation } from '../shared/bane/crypto/authorize-crypto-operation';
import { ContextBoundKeyManager } from '../shared/bane/crypto/context-bound-key-manager';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * BCI revokeCryptoScope EntryPoint (V2)
 * 
 * Unified route for scope, session, or device revocation.
 */
export const bciRevokeCryptoScope = onCall(async (request) => {
    const gate = await enforceBaneCallable({ 
        name: 'bciRevokeCryptoScope', 
        data: request.data, 
        ctx: request as any 
    });

    const bciAuth = await authorizeCryptoOperation({
        ...request.data,
        operationType: 'REVOKE_DEVICE', // Example mapping
    }, await ContextBoundKeyManager.validateContext(request.data));

    if (bciAuth.decision !== 'ALLOW') {
        throw new HttpsError('permission-denied', bciAuth.reason);
    }

    await RevocationEngine.recordRevocation({
        targetId: request.data.targetId,
        targetType: request.data.targetType,
        actorId: gate.uid,
        reason: request.data.reason,
        decisionId: bciAuth.decisionId,
    });

    return {
        revoked: true,
        decisionId: bciAuth.decisionId,
        truthState: bciAuth.truthState,
    };
});
