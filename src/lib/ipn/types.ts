export interface IPNDevice {
    id: string;
    workspaceId: string;
    postureState: 'ACTIVE' | 'QUARANTINED' | 'REVOKED' | 'RESTRICTED';
}

export interface IPNSession {
    id: string;
    sourceDeviceId: string;
    workspaceId: string;
}

export interface IPNAuditRecord {
    id: string;
    sessionId?: string;
    requestId?: string;
    actorArcId: string;
    
    // Revocation required fields
    targetId?: string;
    requestedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
    evaluatedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
    executedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
    authorityBasis?: string;
    reasonClass?: string;
    resultState?: 'allowed_executed' | 'allowed_noop' | 'rejected_policy' | 'rejected_scope' | 'rejected_authority' | 'failed_runtime';
    policyReference?: string;

    eventType: string;
    decision: 'ALLOW' | 'DENY' | 'CONSTRAIN' | 'REVIEW_REQUIRED';
    reasoningSummary: string;
    createdAt: Date;
    hash: string;
}

export interface IPNRevocationEvent {
    id: string;
    targetId: string;
    targetType: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
    reason: string;
    revokedAt: Date;
    revokedByArcId: string;
    policyReference?: string;
    authorityBasis?: string;
}
