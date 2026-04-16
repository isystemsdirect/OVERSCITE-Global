import * as functions from 'firebase-functions';
import { classifyAnomaly } from '../shared/ipn/anomaly-engine';

export const classifyAnomalyFunction = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { rawSignalData } = data;
    if (!rawSignalData) throw new functions.https.HttpsError('invalid-argument', 'Missing payload');

    // Generate Anomaly Object - Purely advisory
    const anomaly = classifyAnomaly(rawSignalData);

    functions.logger.info(`LARI generated Anomaly: ${anomaly.id}. Severity: ${anomaly.severity}`);

    // Insert into ipn_anomalies collection

    return { success: true, anomaly };
});
