import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { CryptoEnvelopeService } from '../shared/bane/crypto/crypto-envelope';
import { authorizeCryptoOperation } from '../shared/bane/crypto/authorize-crypto-operation';
import { ContextBoundKeyManager } from '../shared/bane/crypto/context-bound-key-manager';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * BCI sealExport EntryPoint (V2)
 * 
 * Bounded backend route for archival sealing using RSA-4096.
 */
export const bciSealExport = onCall(async (request) => {
    const gate = await enforceBaneCallable({ 
        name: 'bciSealExport', 
        data: request.data, 
        ctx: request as any 
    });

    const bciAuth = await authorizeCryptoOperation({
        ...request.data,
        operationType: 'SEAL_EXPORT',
        requestedRole: 'ARCHIVAL_SEAL',
    }, await ContextBoundKeyManager.validateContext(request.data));

    if (bciAuth.decision !== 'ALLOW' && bciAuth.decision !== 'ESCALATE') {
        throw new HttpsError('permission-denied', `BCI Deny: ${bciAuth.reason}`);
    }

    // Execute Seal Orchestration
    const result = await CryptoEnvelopeService.wrapPayload({
        payload: request.data.payload,
        operationType: 'SEAL_EXPORT',
        role: 'ARCHIVAL_SEAL',
        decisionId: bciAuth.decisionId
    });

    return {
        ...result,
        decisionId: bciAuth.decisionId,
        truthState: bciAuth.truthState
    };
});
