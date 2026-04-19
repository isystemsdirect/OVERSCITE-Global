import { IPNConflictEvent, IPNPostureStateEnum } from './types';

export function calculateConflictPressure(events: IPNConflictEvent[]): number {
    let score = 0;
    for (const event of events) {
        if (!event.resolved) {
            score += event.pressureScore;
        }
    }
    return Math.min(score, 100);
}

export function recommendPostureFromConflict(pressureScore: number): IPNPostureStateEnum {
    if (pressureScore >= 80) return IPNPostureStateEnum.CONTROLLED_OPEN;
    if (pressureScore >= 40) return IPNPostureStateEnum.CONTROLLED;
    return IPNPostureStateEnum.AGGRESSIVE;
}
