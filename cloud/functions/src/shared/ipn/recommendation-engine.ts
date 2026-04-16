import { IPNRecommendationEvent, IPNRecommendationCategory } from './types';

export function createRecommendation(
    category: IPNRecommendationCategory,
    advisoryText: string,
    confidence: number,
    evidenceRef: string
): IPNRecommendationEvent {
    
    // Core boundary: A recommendation is never created in an executed state.
    return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 900)}`,
        category,
        advisoryText,
        confidenceScore: confidence,
        evidenceRef,
        state: 'GENERATED',
        createdAt: new Date(),
        updatedAt: new Date()
    };
}
