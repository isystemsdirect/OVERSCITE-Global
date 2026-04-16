import * as functions from 'firebase-functions';

export const heartbeat = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required for heartbeat');
    }

    const deviceId = data.deviceId;

    if (!deviceId) {
        throw new functions.https.HttpsError('invalid-argument', 'Device ID is required');
    }

    // Update lastSeenAt in Firestore
    functions.logger.info(`Heartbeat received for device ${deviceId}`);

    return {
        success: true,
        lastSeenAt: new Date().toISOString()
    };
});
