/**
 * BANE Cryptography Intelligence (BCI) Type Definitions
 */

export type BCIOperationType = 
    | 'SIGN_ARTIFACT'
    | 'VERIFY_ARTIFACT'
    | 'ENCRYPT_PAYLOAD'
    | 'DECRYPT_PAYLOAD'
    | 'AUTHORIZE_TRANSPORT'
    | 'SEAL_EXPORT'
    | 'UNWRAP_KEY_MATERIAL'
    | 'REVOKE_DEVICE'
    | 'REVOKE_SESSION'
    | 'RESTRICT_SCOPE'
    | 'HASH_ARTIFACT'
    | 'ISSUE_IDENTITY_ASSERTION';

export type BCIDecision = 'ALLOW' | 'RESTRICT' | 'DENY' | 'ESCALATE';

export type BCITruthState = 
    | 'authorized'
    | 'restricted'
    | 'denied'
    | 'review_required'
    | 'revoked_identity'
    | 'anomaly_detected';

export type BCIRestrictionMode = 
    | 'reduced_scope'
    | 'read_only_authenticity'
    | 'no_export'
    | 'no_decrypt'
    | 'backend_only'
    | 'delayed_queue';

export type BCIPrimitiveRole = 
    | 'TRUST_ANCHOR'       // Ed25519
    | 'SESSION_EXCHANGE'   // Curve25519
    | 'DATA_PROTECTION'    // AES-256-GCM
    | 'INTEGRITY_SHIELD'   // SHA-256
    | 'ARCHIVAL_SEAL';     // RSA-4096 (Bounded)

export interface BCIAuthorizationRequest {
    operationType: BCIOperationType;
    actorId: string;
    sessionId: string;
    deviceId: string;
    scope: string;
    payloadRefOrHash: string;
    requestedRole: BCIPrimitiveRole;
    environmentClass: 'backend' | 'desktop' | 'mobile' | 'constrained';
    targetId?: string;
    reasoningHint?: string;
    jobId?: string;
    artifactType?: string;
}

export interface BCIAuthorizationResponse {
    decision: BCIDecision;
    decisionId: string;
    truthState: BCITruthState;
    reason: string;
    restrictions: BCIRestrictionMode[];
    policyVersion: string;
}

export interface BCIAuditRecord {
    decisionId: string;
    operationType: BCIOperationType;
    actorId: string;
    sessionId: string;
    deviceId: string;
    scope: string;
    primitiveRole: BCIPrimitiveRole;
    payloadHash: string;
    resultState: BCITruthState;
    decision: BCIDecision;
    reasonSummary: string;
    createdAt: Date;
    traceId?: string;
}

export interface BCIBenchmarkResult {
    primitive: string;
    payloadSize?: string;
    operation: string;
    meanMs: number;
    medianMs: number;
    p95Ms: number;
    maxMs: number;
    stdDevMs: number;
    opsPerSec: number;
    environment: string;
    timestamp: Date;
}
