import * as functions from 'firebase-functions';
import { createRevocationEvent } from '../shared/ipn/revocation';

export const revokeSession = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { sessionId, reason } = data;
    if (!sessionId) {
        throw new functions.https.HttpsError('invalid-argument', 'Target Session ID is required');
    }

    const event = createRevocationEvent('SESSION', sessionId, reason || 'Operator Terminated', context.auth.uid);

    functions.logger.info(`SESSION REVOCATION INITIATED BY ${context.auth.uid} for Session ${sessionId}`);
    
    // Commit to Firestore / ipn_sessions -> status = revoked, ipn_audit insert.
    
    return { success: true, event };
});
