import { IPNPostureStateEnum } from '../../../ipn/types';

export function evaluatePostureTransition(current: IPNPostureStateEnum, target: IPNPostureStateEnum, authorityLevel: string): { allowed: boolean, reason: string } {
    if (target === current) return { allowed: true, reason: 'No change' };
    
    if (target === IPNPostureStateEnum.Controlled_Open) {
        if (authorityLevel !== 'DIRECTOR') {
            return { allowed: false, reason: 'Controlled_Open posture requires Director-level override due to high-risk interoperability conflicts.' };
        }
    }
    
    return { allowed: true, reason: 'Transition authorized.' };
}
