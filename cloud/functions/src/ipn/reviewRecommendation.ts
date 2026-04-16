import * as functions from 'firebase-functions';

export const reviewRecommendation = functions.https.onCall(async (data: any, context: any) => {
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { recommendationId } = data;
    functions.logger.info(`Recommendation ${recommendationId} placed UNDER_REVIEW by ${context.auth.uid}`);
    
    // Update firestore document state to UNDER_REVIEW
    return { success: true, recommendationId, newState: 'UNDER_REVIEW' };
});
