import { IPNSession } from '../../ipn/types';

export function evaluateRebelChannelReadiness(
    session: IPNSession,
    hasActiveConflict: boolean
): { ready: boolean, reason: string } {

    // Ensures LARI cannot command physical REBEL nodes autonomously.

    if (session.trustState !== 'TRUSTED') {
        return { ready: false, reason: 'REBEL channel readiness requires TRUSTED session bounds. Active state is degraded or worse.' };
    }

    if (hasActiveConflict) {
        return { ready: false, reason: 'BANE DENY: REBEL deployment paths lock tightly under active routing conflicts to prevent phantom signaling.' };
    }

    // Recommendation logic can now proceed
    return { ready: true, reason: 'REBEL node satisfies governed baseline integrity.' };
}
