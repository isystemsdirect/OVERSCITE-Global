import * as functions from 'firebase-functions';
import { createRevocationEvent } from '../shared/ipn/revocation';

export const quarantineDevice = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { deviceId, reason } = data;
    if (!deviceId) throw new functions.https.HttpsError('invalid-argument', 'Device ID required');

    // MOCK FIRESTORE MUTATION
    functions.logger.warn(`Device ${deviceId} QUARANTINED by ${context.auth.uid}. Reason: ${reason}`);
    
    const event = createRevocationEvent('DEVICE', deviceId, reason || 'Quarantine Engaged', context.auth.uid);

    return { success: true, event };
});
