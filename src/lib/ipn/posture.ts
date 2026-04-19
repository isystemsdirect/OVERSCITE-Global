import { IPNPostureStateEnum } from './types';

export interface PostureDefinition {
    label: string;
    description: string;
}

export const POSTURE_DEFINITIONS: Record<IPNPostureStateEnum, PostureDefinition> = {
    [IPNPostureStateEnum.AGGRESSIVE]: {
        label: 'Aggressive Intervention',
        description: 'Proactive BANE enforcement. High-risk interoperability logic is actively constrained or terminated to ensure repository integrity.'
    },
    [IPNPostureStateEnum.ACTIVE]: {
        label: 'Active Engagement',
        description: 'Baseline operational state. Peer-to-peer transit is authorized within governed parameters.'
    },
    [IPNPostureStateEnum.CONTROLLED]: {
        label: 'Controlled Monitoring',
        description: 'Governed IPN state. All routing signals are logged to the ArcHive™ and cross-referenced against LARI-Safety thresholds.'
    },
    [IPNPostureStateEnum.CONTROLLED_OPEN]: {
        label: 'Controlled Open',
        description: 'Director-authorized bypass. Governing bounds are relaxed for specialized device-native interoperability testing.'
    },
    [IPNPostureStateEnum.DEGRADED]: {
        label: 'Degraded / Warning',
        description: 'High conflict pressure detected. Non-essential IPN lanes are placed in review-required state.'
    },
    [IPNPostureStateEnum.QUARANTINED]: {
        label: 'Quarantined / Contained',
        description: 'Total transit block. All outbound IPN requests are denied. BANE isolation protocol active.'
    },
    [IPNPostureStateEnum.VALID]: {
        label: 'Valid / Normalized',
        description: 'Passive operational state. Trust boundaries are active and non-pressured.'
    },
    [IPNPostureStateEnum.RESTRICTED]: {
        label: 'Restricted Access',
        description: 'Limited capabilities assigned. BANE requires heightened evidence for additional transit permissions.'
    },
    [IPNPostureStateEnum.REVOKED]: {
        label: 'Identity Revoked',
        description: 'Binding terminated. Device must re-enter identity recovery cycle.'
    }
};

export const DEFAULT_POSTURE = {
    currentState: IPNPostureStateEnum.CONTROLLED,
    safetyCoreLocked: true,
    conflictPressure: 12,
    protocolVersion: 'v0.5.1-governed',
    policyPackVersion: 'pp-lari-foundation-b1',
    recommendation: 'Maintain current Controlled Monitoring posture.'
};

export function getPostureDefinition(state: IPNPostureStateEnum): PostureDefinition {
    return POSTURE_DEFINITIONS[state] || POSTURE_DEFINITIONS[IPNPostureStateEnum.CONTROLLED];
}
