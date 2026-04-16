import * as functions from 'firebase-functions';

export const setPosture = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { targetPosture, authorityLevel } = data;

    if (!targetPosture) {
        throw new functions.https.HttpsError('invalid-argument', 'Target posture required');
    }

    // In a full implementation, this runs through evaluatePostureTransition
    
    if (targetPosture === 'CONTROLLED_OPEN' && authorityLevel !== 'DIRECTOR') {
         throw new functions.https.HttpsError('permission-denied', 'Controlled_Open posture requires Director-level override.');
    }

    functions.logger.info(`IPN Posture mutating to ${targetPosture} by ${context.auth.uid}`);

    return {
        success: true,
        posture: targetPosture,
        updatedAt: new Date().toISOString()
    };
});
