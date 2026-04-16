import { BCIDecision, BCIOperationType, BCIPrimitiveRole, BCIRestrictionMode, BCITruthState } from './types';

export interface BCIPolicy {
    operationType: BCIOperationType;
    requiredRole: BCIPrimitiveRole;
    allowedEnvironments: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requiresEscalation: boolean;
}

export const BCI_POLICY_VERSION = '1.1.00';

const POLICIES: Record<BCIOperationType, BCIPolicy> = {
    'SIGN_ARTIFACT': {
        operationType: 'SIGN_ARTIFACT',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'MEDIUM',
        requiresEscalation: false,
    },
    'VERIFY_ARTIFACT': {
        operationType: 'VERIFY_ARTIFACT',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend', 'desktop', 'mobile', 'constrained'],
        riskLevel: 'LOW',
        requiresEscalation: false,
    },
    'ENCRYPT_PAYLOAD': {
        operationType: 'ENCRYPT_PAYLOAD',
        requiredRole: 'DATA_PROTECTION',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'LOW',
        requiresEscalation: false,
    },
    'DECRYPT_PAYLOAD': {
        operationType: 'DECRYPT_PAYLOAD',
        requiredRole: 'DATA_PROTECTION',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'MEDIUM',
        requiresEscalation: false,
    },
    'AUTHORIZE_TRANSPORT': {
        operationType: 'AUTHORIZE_TRANSPORT',
        requiredRole: 'SESSION_EXCHANGE',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'MEDIUM',
        requiresEscalation: false,
    },
    'SEAL_EXPORT': {
        operationType: 'SEAL_EXPORT',
        requiredRole: 'ARCHIVAL_SEAL',
        allowedEnvironments: ['backend'],
        riskLevel: 'HIGH',
        requiresEscalation: true,
    },
    'UNWRAP_KEY_MATERIAL': {
        operationType: 'UNWRAP_KEY_MATERIAL',
        requiredRole: 'DATA_PROTECTION',
        allowedEnvironments: ['backend'],
        riskLevel: 'CRITICAL',
        requiresEscalation: true,
    },
    'REVOKE_DEVICE': {
        operationType: 'REVOKE_DEVICE',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend', 'desktop'],
        riskLevel: 'HIGH',
        requiresEscalation: false,
    },
    'REVOKE_SESSION': {
        operationType: 'REVOKE_SESSION',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'MEDIUM',
        requiresEscalation: false,
    },
    'RESTRICT_SCOPE': {
        operationType: 'RESTRICT_SCOPE',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend', 'desktop', 'mobile'],
        riskLevel: 'MEDIUM',
        requiresEscalation: false,
    },
    'HASH_ARTIFACT': {
        operationType: 'HASH_ARTIFACT',
        requiredRole: 'INTEGRITY_SHIELD',
        allowedEnvironments: ['backend', 'desktop', 'mobile', 'constrained'],
        riskLevel: 'LOW',
        requiresEscalation: false,
    },
    'ISSUE_IDENTITY_ASSERTION': {
        operationType: 'ISSUE_IDENTITY_ASSERTION',
        requiredRole: 'TRUST_ANCHOR',
        allowedEnvironments: ['backend'],
        riskLevel: 'HIGH',
        requiresEscalation: true,
    },
};

export function getBCIPolicy(op: BCIOperationType): BCIPolicy {
    return POLICIES[op];
}

export function evaluateBCIOutcome(
    op: BCIOperationType,
    context: {
        environment: string;
        isRevoked: boolean;
        hasAnomaly: boolean;
        isScopeValid: boolean;
    }
): { decision: BCIDecision; truthState: BCITruthState; restrictions: BCIRestrictionMode[] } {
    const policy = getBCIPolicy(op);

    if (context.isRevoked) {
        return { decision: 'DENY', truthState: 'revoked_identity', restrictions: [] };
    }

    if (context.hasAnomaly) {
        return { decision: 'ESCALATE', truthState: 'anomaly_detected', restrictions: ['backend_only'] };
    }

    if (!policy.allowedEnvironments.includes(context.environment)) {
        return { decision: 'DENY', truthState: 'denied', restrictions: [] };
    }

    if (!context.isScopeValid) {
        return { decision: 'RESTRICT', truthState: 'restricted', restrictions: ['reduced_scope'] };
    }

    if (policy.requiresEscalation) {
        return { decision: 'ESCALATE', truthState: 'review_required', restrictions: ['backend_only'] };
    }

    return { decision: 'ALLOW', truthState: 'authorized', restrictions: [] };
}
