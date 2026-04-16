import { IPNRevocationEvent, IPNSession, IPNDevice } from './types';

export function createRevocationEvent(
    targetType: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL',
    targetId: string,
    reason: string,
    operatorArcId: string
): IPNRevocationEvent {
    return {
        id: `rev-${new Date().getTime()}-${Math.floor(Math.random()*1000)}`,
        targetId,
        targetType,
        reason,
        revokedAt: new Date(),
        revokedByArcId: operatorArcId
    };
}

export function isSessionRevoked(session: IPNSession, revocationLedger: IPNRevocationEvent[]): boolean {
    return revocationLedger.some(evt => 
        (evt.targetType === 'SESSION' && evt.targetId === session.id) ||
        (evt.targetType === 'DEVICE' && evt.targetId === session.sourceDeviceId) ||
        (evt.targetType === 'WORKSPACE' && evt.targetId === session.workspaceId) ||
        (evt.targetType === 'GLOBAL')
    );
}

export function isDeviceRevoked(device: IPNDevice, revocationLedger: IPNRevocationEvent[]): boolean {
    return revocationLedger.some(evt => 
        (evt.targetType === 'DEVICE' && evt.targetId === device.id) ||
        (evt.targetType === 'WORKSPACE' && evt.targetId === device.workspaceId) ||
        (evt.targetType === 'GLOBAL')
    );
}
