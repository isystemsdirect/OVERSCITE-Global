import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { authorizeCryptoOperation as authorizeCore } from '../shared/bane/crypto/authorize-crypto-operation';
import { ContextBoundKeyManager } from '../shared/bane/crypto/context-bound-key-manager';
import { writeBCIAuditRecord, createBCIAuditRecordFromDecision } from '../shared/bane/crypto/audit';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * BCI authorizeCryptoOperation EntryPoint (V2)
 * 
 * Public gate for authorizing cryptographic operations across OVERSCITE.
 */
export const bciAuthorizeCryptoOperation = onCall(async (request) => {
    // 1. Enforce BANE Base Governance
    const gate = await enforceBaneCallable({ 
        name: 'bciAuthorizeCryptoOperation', 
        data: request.data, 
        ctx: request as any // Adaptation for V2 context to V1 helper
    });

    try {
        // 2. Resolve Context Constraints
        const context = await ContextBoundKeyManager.validateContext(request.data);

        // 3. Execute BCI Authorization Core
        const response = await authorizeCore(request.data, {
            ...context,
            traceId: gate.traceId
        });

        // 4. Emit Audit Artifact
        const auditRecord = createBCIAuditRecordFromDecision(request.data, response, gate.traceId);
        await writeBCIAuditRecord(auditRecord);

        return response;
    } catch (e: any) {
        throw new HttpsError('internal', e.message);
    }
});
