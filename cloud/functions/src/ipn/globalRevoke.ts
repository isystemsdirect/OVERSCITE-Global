import * as functions from 'firebase-functions';
import { createRevocationEvent } from '../shared/ipn/revocation';
import { evaluateRevocationScopeAllowed } from '../shared/bane/ipn/evaluate-revocation-scope';

export const globalRevoke = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { targetId, reason } = data;

    const evaluation = evaluateRevocationScopeAllowed(context.auth.uid, 'GLOBAL', { isScingDirector: data.isScingDirector });
    if (!evaluation.allowed) {
        throw new functions.https.HttpsError('permission-denied', evaluation.reason);
    }

    const event = createRevocationEvent('GLOBAL', targetId || 'ALL', reason || 'Emergency Global Containment', context.auth.uid);

    functions.logger.warn(`GLOBAL REVOCATION INITIATED BY ${context.auth.uid}. Target: ${targetId}`);
    
    // Commit event to ipn_audit...
    // Set all active sessions to dead...
    
    return { success: true, event };
});
