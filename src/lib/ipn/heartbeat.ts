import { IPNHeartbeat, IPNDeviceTrustState } from './types';
import { evaluateDeviceTrustTransition } from './posture-transitions';

export const HEARTBEAT_STALE_THRESHOLD_MS = 60000; // 1 minute
export const HEARTBEAT_OFFLINE_THRESHOLD_MS = 300000; // 5 minutes

export function calculateHeartbeatStaleness(lastSeenAt: Date): number {
    return new Date().getTime() - lastSeenAt.getTime();
}

export function evaluateHeartbeatTrustImpact(
    currentTrust: IPNDeviceTrustState,
    lastSeenAt: Date
): IPNDeviceTrustState {
    const staleness = calculateHeartbeatStaleness(lastSeenAt);

    if (staleness > HEARTBEAT_OFFLINE_THRESHOLD_MS) {
        return evaluateDeviceTrustTransition(currentTrust, 'HEARTBEAT_LOSS');
    }

    return currentTrust;
}
