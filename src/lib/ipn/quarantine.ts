import { IPNDevice } from './types';

export function isDeviceQuarantined(device: IPNDevice): boolean {
    return device.postureState === 'QUARANTINED';
}

export function buildQuarantineDiagnosticScope(): string[] {
    // Only these scopes are allowed when quarantined
    return [
        'READ_TELEMETRY',
        'REQUEST_CONFIG'
    ];
}
