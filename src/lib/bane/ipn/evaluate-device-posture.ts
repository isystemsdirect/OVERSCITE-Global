import { IPNDevice } from '../../../ipn/types';

export function evaluateDevicePostureForTransport(device: IPNDevice, currentPosture: string): { decision: 'ALLOW' | 'DENY', reason: string } {
    if (device.postureState !== 'VALID') {
        return { decision: 'DENY', reason: `Device posture state is ${device.postureState}` };
    }
    
    if (device.postureScore < 60) {
        return { decision: 'DENY', reason: 'Device posture score insufficient for authorized transport' };
    }
    
    if (currentPosture === 'AGGRESSIVE' && !device.srtBound) {
         return { decision: 'DENY', reason: 'Aggressive posture requires SRT-bound devices only' };
    }
    
    return { decision: 'ALLOW', reason: 'Device meets posture requirements' };
}
