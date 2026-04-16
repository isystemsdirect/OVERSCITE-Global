import { IPNRecommendationEvent } from '../../../ipn/types';

export function evaluateRecommendationAction(
    recommendation: IPNRecommendationEvent,
    action: 'ACCEPT' | 'REJECT' | 'ESCALATE',
    operatorArcId: string
): { allowed: boolean, reason: string } {
    
    if (recommendation.state !== 'UNDER_REVIEW' && recommendation.state !== 'VISIBLE_IN_OVERHUD') {
        return { allowed: false, reason: `Cannot action recommendation in state: ${recommendation.state}` };
    }

    if (!operatorArcId) {
        return { allowed: false, reason: 'Human operator identity must be bound to action.' };
    }

    if (action === 'ACCEPT' && recommendation.confidenceScore < 60) {
        // Additional BANE check: Do not execute low confidence routines blindly
        return { allowed: false, reason: 'BANE BLOCKED: LARI confidence too low to allow automated Acceptance mapping.' };
    }

    return { allowed: true, reason: 'Action permitted by BANE.' };
}
