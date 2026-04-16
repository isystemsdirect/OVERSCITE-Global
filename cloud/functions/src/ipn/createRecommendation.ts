import * as functions from 'firebase-functions';
import { createRecommendation } from '../shared/ipn/recommendation-engine';

export const createRecommendationEndpoint = functions.https.onCall(async (data: any, context: any) => {
    // Note: Called by backend internal service accounts or LARI processors natively
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const rec = createRecommendation(data.category, data.advisoryText, data.confidence, data.evidenceRef);
    
    functions.logger.info(`LARI generated recommendation: ${rec.id}`);
    return { success: true, recommendation: rec };
});
