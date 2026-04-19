export type IPNDeviceClass = 'WORKSTATION' | 'MOBILE' | 'EMBEDDED' | 'SERVER';

export enum IPNPostureStateEnum {
    ACTIVE = 'ACTIVE',
    QUARANTINED = 'QUARANTINED',
    REVOKED = 'REVOKED',
    RESTRICTED = 'RESTRICTED',
    VALID = 'VALID',
    DEGRADED = 'DEGRADED',
    CONTROLLED = 'CONTROLLED',
    CONTROLLED_OPEN = 'CONTROLLED_OPEN',
    AGGRESSIVE = 'AGGRESSIVE'
}

export type IPNDeviceTrustState = 'TRUSTED' | 'DEGRADED' | 'BLOCKED' | 'UNKNOWN' | 'QUARANTINED' | 'GRANTED' | 'REVOKED' | 'PENDING' | 'DENIED' | 'EXPIRED';

export type ChannelType = 'TELEMETRY' | 'CONTROL' | 'MEDIA' | 'CONFIG';

export interface IPNDevice {
    id: string;
    arcId: string;
    workspaceId: string;
    deviceClass: IPNDeviceClass;
    displayName: string;
    publicKey: string;
    postureScore: number;
    postureState: IPNPostureStateEnum;
    lastSeenAt: Date;
    capabilities: string[];
    srtBound: boolean;
}

export interface IPNSession {
    id: string;
    arcId: string;
    sourceDeviceId: string;
    targetDeviceId: string;
    workspaceId: string;
    trustState: IPNDeviceTrustState;
    requestedScope: string[];
    grantedScope: string[];
    createdAt: Date;
    expiresAt: Date;
    baneDecisionId: string;
}

export interface IPNHeartbeat {
    deviceId: string;
    timestamp: Date;
    postureScore: number;
    postureState: IPNPostureStateEnum;
}

export interface IPNTransportRequest {
    id: string;
    sessionId: string;
    channelType: ChannelType;
    payloadRef?: string;
    payloadHash: string;
    source: string;
    target: string;
    requestedAction: 'READ_TELEMETRY' | 'SEND_COMMAND' | 'REQUEST_CONFIG' | 'STREAM_MEDIA' | 'ESTABLISH_PEERING';
    routeClass: 'GOVERNED_RELAY_V1' | 'DIRECT_SECURE_TUNNEL' | 'UNTRUSTED_MESH';
    requestedAt: Date;
}

export type IPNRecommendationCategory = 'TRAFFIC_PRIORITY' | 'COMPUTATIONAL_ADVISORY' | 'SECURITY_POSTURE_ADJUSTMENT' | 'ROUTE_CLASS';
export type IPNRecommendationState = 'GENERATED' | 'UNDER_REVIEW' | 'VISIBLE_IN_OVERHUD' | 'EXECUTED' | 'DISMISSED' | 'ESCALATED_TO_ARCHIVE';

export interface IPNRecommendationEvent {
    id: string;
    category: IPNRecommendationCategory;
    advisoryText: string;
    confidenceScore: number;
    evidenceRef: string;
    state: IPNRecommendationState;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPNConflictEvent {
    id: string;
    sessionId?: string;
    deviceId: string;
    type: 'RESOURCE_CONTENTION' | 'AUTHORIZATION_OVERLAP' | 'POLICY_DIVERGENCE';
    pressureScore: number;
    resolved: boolean;
    timestamp: Date;
}

export interface IPNAnomalyEvent {
    id: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number;
    evidenceSummary: string;
    recommendedAction: string;
    requiresBaneReview: boolean;
    requiresHumanReview: boolean;
    detectedAt: Date;
}

export interface IPNAuditRecord {
    id: string;
    sessionId?: string;
    requestId?: string;
    actorArcId: string;
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
