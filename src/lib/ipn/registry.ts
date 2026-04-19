import { IPNDevice, IPNPostureStateEnum } from './types';
import { calculatePostureScore, validateDevicePosture } from './device-posture';

export async function createDeviceRecord(
  arcId: string, 
  workspaceId: string, 
  deviceData: Partial<IPNDevice>
): Promise<IPNDevice> {
    const srtBound = deviceData.srtBound || false;
    const capabilities = deviceData.capabilities || ['ipn-ready'];
    
    const score = calculatePostureScore(capabilities, srtBound);
    
    // In Phase 1, we generate an ID and construct the record
    const newDevice: IPNDevice = {
        id: `dev-${Date.now().toString(36)}`,
        arcId,
        workspaceId,
        deviceClass: deviceData.deviceClass || 'WORKSTATION',
        displayName: deviceData.displayName || 'Unknown Device',
        publicKey: deviceData.publicKey || 'mock-public-key',
        postureScore: score,
        postureState: score >= 60 ? IPNPostureStateEnum.VALID : IPNPostureStateEnum.DEGRADED,
        lastSeenAt: new Date(),
        capabilities,
        srtBound
    };

    const validation = validateDevicePosture(newDevice);
    if (!validation.valid) {
        throw new Error(`Device posture invalid: ${validation.reason}`);
    }

    // In a real implementation this would write to Firestore ipn_devices 
    // Example: await db.collection('ipn_devices').doc(newDevice.id).set(newDevice);

    return newDevice;
}

export async function getDevice(deviceId: string): Promise<IPNDevice | null> {
    // Stub for Phase 1 fetching
    return null;
}
