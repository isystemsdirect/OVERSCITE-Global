import { IPNRecommendationEvent } from '../../ipn/types';

export function evaluateAdvisoryEscalation(
    recommendation: IPNRecommendationEvent,
    operatorArcId: string
): { allowed: boolean, reason: string } {
    
    // Recommendations must be in a state permitting escalation. 
    // Even rejected recommendations can be escalated for logic tuning.
    if (recommendation.state === 'ESCALATED_TO_ARCHIVE') {
        return { allowed: false, reason: 'Recommendation is already inside the ArcHive proposal pipeline.' };
    }

    if (!operatorArcId) {
        return { allowed: false, reason: 'Operator Identity Required.' };
    }

    return { allowed: true, reason: 'Escalation mapping permitted.' };
}
