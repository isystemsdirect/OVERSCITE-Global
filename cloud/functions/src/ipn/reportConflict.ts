import * as functions from 'firebase-functions';
import { IPNConflictEvent } from '../shared/ipn/types';

export const reportConflict = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { deviceId, conflictType, pressureScore } = data;
    if (!deviceId || !conflictType) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing fields');
    }

    const event: IPNConflictEvent = {
        id: `conf-${new Date().getTime()}`,
        deviceId,
        conflictType,
        pressureScore: pressureScore || 10,
        detectedAt: new Date(),
        resolved: false
    };

    functions.logger.info(`Conflict pressure reported for ${deviceId}. Score: ${event.pressureScore}`);

    // Commit to IPN Audit / Conflict Store
    // Await downstream evaluator `evaluateConflictPressure` inside OverHUD trigger.

    return { success: true, event };
});
