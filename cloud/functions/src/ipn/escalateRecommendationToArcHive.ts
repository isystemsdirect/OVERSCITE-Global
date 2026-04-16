import * as functions from 'firebase-functions';
import { evaluateAdvisoryEscalation } from '../shared/bane/ipn/evaluate-advisory-escalation';
import { IPNRecommendationEvent } from '../shared/ipn/types';

export const escalateRecommendationToArcHive = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { recommendation } = data as { recommendation: IPNRecommendationEvent };
    
    const evaluation = evaluateAdvisoryEscalation(recommendation, context.auth.uid);
    if (!evaluation.allowed) {
        throw new functions.https.HttpsError('permission-denied', evaluation.reason);
    }

    functions.logger.info(`Recommendation ${recommendation.id} ESCALATED_TO_ARCHIVE for logic tuning by (${context.auth.uid})`);
    
    // Forward to ArcHive logic governance repository queues
    // Update local UI state
    return { success: true, recommendationId: recommendation.id, newState: 'ESCALATED_TO_ARCHIVE' };
});
