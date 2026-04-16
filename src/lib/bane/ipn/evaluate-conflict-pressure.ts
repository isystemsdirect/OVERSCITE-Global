import { IPNConflictEvent, IPNPostureStateEnum } from '../../../ipn/types';
import { calculateConflictPressure, recommendPostureFromConflict } from '../../../ipn/conflict-evaluator';

export function evaluateConflictPressure(
    events: IPNConflictEvent[],
    currentGlobalPosture: IPNPostureStateEnum
): { recommendation: IPNPostureStateEnum, requireQuarantine: boolean, reason: string } {
    
    const pressure = calculateConflictPressure(events);
    const recommended = recommendPostureFromConflict(pressure);

    // If pressure is maxed out but we are restricted from opening posture by safety locking
    if (pressure >= 90 && currentGlobalPosture === IPNPostureStateEnum.Aggressive) {
        return {
            recommendation: currentGlobalPosture,
            requireQuarantine: true,
            reason: 'Excessive conflict pressure against Aggressive posture lock requires containment.'
        };
    }

    return {
        recommendation: recommended,
        requireQuarantine: false,
        reason: `Calculated pressure score is ${pressure}.`
    };
}
