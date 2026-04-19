import { IPNSession } from '../../ipn/types';
import { isSessionExpired } from '../../ipn/session';

export function evaluateSessionScopeForAction(session: IPNSession, requiredAction: string): { decision: 'ALLOW' | 'DENY', reason: string } {
    if (isSessionExpired(session)) {
        return { decision: 'DENY', reason: 'Session has expired' };
    }
    
    if (session.trustState !== 'GRANTED') {
        return { decision: 'DENY', reason: 'Session trust state is not GRANTED' };
    }
    
    if (!session.grantedScope.includes(requiredAction) && !session.grantedScope.includes('*')) {
         return { decision: 'DENY', reason: 'Session scope does not cover requested action' };
    }
    
    return { decision: 'ALLOW', reason: 'Session scope validates action' };
}
