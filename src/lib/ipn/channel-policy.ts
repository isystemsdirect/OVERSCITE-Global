import { ChannelType, IPNDeviceTrustState, IPNSession } from './types';

export function getRequiredTrustForChannel(channel: ChannelType): IPNDeviceTrustState[] {
    switch (channel) {
        case 'CONTROL':
            return ['TRUSTED'];
        case 'CONFIG':
            return ['TRUSTED', 'QUARANTINED']; // Quarantined devices may receive diagnostic configs
        case 'MEDIA':
            return ['TRUSTED', 'DEGRADED'];
        case 'TELEMETRY':
            return ['TRUSTED', 'DEGRADED', 'UNKNOWN', 'QUARANTINED'];
        default:
            return [];
    }
}

export function isChannelPermitted(session: IPNSession, channel: ChannelType): boolean {
    const requiredTrust = getRequiredTrustForChannel(channel);
    
    // Safety Fallback
    if (session.trustState === 'BLOCKED') return false;

    return requiredTrust.includes(session.trustState);
}
