import { IPNAuditRecord } from './types';
import { createAuditHash } from './crypto';

export async function constructAuditRecord(
    sessionId: string,
    actorArcId: string,
    eventType: string,
    decision: 'ALLOW' | 'DENY' | 'CONSTRAIN' | 'REVIEW_REQUIRED',
    reasoningSummary: string,
    requestId?: string,
    targetId?: string,
    requestedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL',
    evaluatedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL',
    executedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL',
    authorityBasis?: string,
    reasonClass?: string,
    resultState?: 'allowed_executed' | 'allowed_noop' | 'rejected_policy' | 'rejected_scope' | 'rejected_authority' | 'failed_runtime',
    policyReference?: string
): Promise<IPNAuditRecord> {
    const id = `audit-${Date.now().toString(36)}`;
    const createdAt = new Date();
    
    // Hash only the stable fields for immutable lineage
    const hashPayload = { 
        id, sessionId, actorArcId, eventType, decision, reasoningSummary,
        targetId, requestedScope, evaluatedScope, executedScope, authorityBasis, reasonClass, resultState, policyReference
    };
    const hash = await createAuditHash(hashPayload);

    return {
        id,
        sessionId,
        requestId,
        actorArcId,
        targetId,
        requestedScope,
        evaluatedScope,
        executedScope,
        authorityBasis,
        reasonClass,
        resultState,
        policyReference,
        eventType,
        decision,
        reasoningSummary,
        createdAt,
        hash
    };
}
