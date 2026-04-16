import * as functions from 'firebase-functions';

export const closeSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { sessionId, reason } = data;

    if (!sessionId) {
        throw new functions.https.HttpsError('invalid-argument', 'Session ID required');
    }

    functions.logger.info(`Session ${sessionId} closed. Reason: ${reason || 'USER_INITIATED'}`);

    return {
        success: true,
        closedAt: new Date().toISOString()
    };
});
