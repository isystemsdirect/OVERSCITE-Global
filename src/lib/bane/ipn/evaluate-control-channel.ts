import { IPNSession, IPNTransportRequest } from '../../../ipn/types';
import { isChannelPermitted } from '../../../ipn/channel-policy';

export function evaluateControlChannelGate(
    session: IPNSession,
    request: IPNTransportRequest
): { ok: boolean, reason: string } {
    
    if (request.channelType !== 'CONTROL') {
        return { ok: true, reason: 'Not a control channel request.' };
    }

    if (!isChannelPermitted(session, 'CONTROL')) {
        return { 
            ok: false, 
            reason: `BANE DENY: Control channel requires TRUSTED posture. Session is ${session.trustState}.` 
        };
    }

    if (!session.grantedScope.includes('EXECUTE_COMMAND')) {
        return { 
            ok: false, 
            reason: `BANE DENY: Control channel requires explicit EXECUTE_COMMAND scope. Scope missing.` 
        };
    }

    return { ok: true, reason: 'BANE ALLOW: Control channel criteria met.' };
}
