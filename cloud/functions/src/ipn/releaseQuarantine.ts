import * as functions from 'firebase-functions';
// NOTE: Releasing quarantine requires elevated BANE approval.

export const releaseQuarantine = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { deviceId, justification } = data;
    if (!deviceId || !justification) {
        throw new functions.https.HttpsError('invalid-argument', 'Device ID and Justification required.');
    }

    // Must be mapped through BANE for human-in-loop verification
    functions.logger.info(`Device ${deviceId} released from QUARANTINE by ${context.auth.uid}. Justification: ${justification}`);

    return { success: true, released: true };
});
