import { IPNDevice } from '../../../ipn/types';
import { calculateHeartbeatStaleness, HEARTBEAT_OFFLINE_THRESHOLD_MS, HEARTBEAT_STALE_THRESHOLD_MS } from '../../../ipn/heartbeat';

export function evaluateHeartbeatHealth(device: IPNDevice): { isHealthy: boolean, reason: string } {
    const staleness = calculateHeartbeatStaleness(device.lastSeenAt);

    if (staleness > HEARTBEAT_OFFLINE_THRESHOLD_MS) {
        return { isHealthy: false, reason: 'Device is offline or dropping heartbeats critically.' };
    }

    if (staleness > HEARTBEAT_STALE_THRESHOLD_MS) {
        return { isHealthy: false, reason: 'Device heartbeat is stale. Trust gracefully degrading.' };
    }

    return { isHealthy: true, reason: 'Heartbeat meets freshness requirement.' };
}
