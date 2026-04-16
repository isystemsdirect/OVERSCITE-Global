import { IPNDeviceTrustState, IPNPostureStateEnum } from './types';

export function evaluateDeviceTrustTransition(
    currentState: IPNDeviceTrustState, 
    trigger: 'HEARTBEAT_LOSS' | 'CONFLICT_SPIKE' | 'SIGNATURE_MISMATCH' | 'BANE_REJECTION_LIMIT' | 'MANUAL_OVERRIDE'
): IPNDeviceTrustState {
    
    if (currentState === 'QUARANTINED') {
        // Quarantine is terminal until manual operator release via BANE
        return 'QUARANTINED';
    }

    if (trigger === 'SIGNATURE_MISMATCH' || trigger === 'MANUAL_OVERRIDE') {
        return 'QUARANTINED';
    }

    if (currentState === 'TRUSTED') {
        if (trigger === 'HEARTBEAT_LOSS' || trigger === 'CONFLICT_SPIKE') {
            return 'DEGRADED';
        }
        if (trigger === 'BANE_REJECTION_LIMIT') {
            return 'BLOCKED';
        }
    }

    if (currentState === 'DEGRADED') {
        if (trigger === 'HEARTBEAT_LOSS') return 'UNKNOWN';
        if (trigger === 'BANE_REJECTION_LIMIT' || trigger === 'CONFLICT_SPIKE') return 'BLOCKED';
    }

    return currentState;
}
