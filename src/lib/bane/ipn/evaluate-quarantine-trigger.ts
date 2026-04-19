import { IPNDevice, IPNConflictEvent, IPNPostureStateEnum } from '../../ipn/types';
import { calculateConflictPressure } from '../../ipn/conflict-evaluator';

export function evaluateQuarantineTrigger(
    device: IPNDevice,
    recentConflicts: IPNConflictEvent[],
    consecutiveAuthFailures: number
): { triggered: boolean, reason: string } {
    
    if (consecutiveAuthFailures >= 5) {
        return { triggered: true, reason: 'Consecutive BANE authorization failures reached threshold.' };
    }

    const conflictPressure = calculateConflictPressure(recentConflicts);
    if (conflictPressure >= 90 && device.postureState === IPNPostureStateEnum.DEGRADED) {
        return { triggered: true, reason: 'Critical conflict pressure co-occurring with degraded device posture.' };
    }

    if (device.srtBound === false && device.postureState === IPNPostureStateEnum.DEGRADED) {
         return { triggered: true, reason: 'Degraded non-SRT device poses unacceptable transit risk. Containment engaged.' };
    }

    return { triggered: false, reason: 'No quarantine conditions met.' };
}
