import * as admin from 'firebase-admin';
import { BCIAuditRecord } from './types';

/**
 * BCI Crypto Audit Spine
 * 
 * Writes attributable cryptographic event logs to Firestore for 
 * trust-state reconstruction and governance.
 */
export async function writeBCIAuditRecord(record: BCIAuditRecord): Promise<void> {
    const db = admin.firestore();
    const auditColl = db.collection('audit').doc('bane').collection('crypto');
    
    await auditColl.add({
        ...record,
        // Ensure Date is handled for Firestore
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}

/**
 * Formats a record for BCI audit ingestion.
 */
export function createBCIAuditRecordFromDecision(
    request: any,
    response: any,
    traceId?: string
): BCIAuditRecord {
    return {
        decisionId: response.decisionId,
        operationType: request.operationType,
        actorId: request.actorId,
        sessionId: request.sessionId,
        deviceId: request.deviceId,
        scope: request.scope,
        primitiveRole: request.requestedRole,
        payloadHash: request.payloadRefOrHash,
        resultState: response.truthState,
        decision: response.decision,
        reasonSummary: response.reason,
        createdAt: new Date(),
        traceId,
    };
}
