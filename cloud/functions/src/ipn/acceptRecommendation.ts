import * as functions from 'firebase-functions';
import { evaluateRecommendationAction } from '../shared/bane/ipn/evaluate-recommendation-action';
import { IPNRecommendationEvent } from '../shared/ipn/types';

export const acceptRecommendation = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { recommendation } = data as { recommendation: IPNRecommendationEvent };
    
    const evaluation = evaluateRecommendationAction(recommendation, 'ACCEPT', context.auth.uid);
    if (!evaluation.allowed) {
        throw new functions.https.HttpsError('permission-denied', evaluation.reason);
    }

    functions.logger.info(`Recommendation ${recommendation.id} ACCEPTED_BY_HUMAN (${context.auth.uid})`);
    
    // Update firestore document state to ACCEPTED_BY_HUMAN
    return { success: true, recommendationId: recommendation.id, newState: 'ACCEPTED_BY_HUMAN' };
});
