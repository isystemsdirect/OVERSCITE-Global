/**
 * @fileOverview IPN Device Posture Logic
 * @domain Security / IPN
 * @phase Phase 1 — Foundation
 *
 * Implements posture scoring and validation for devices within the IPN mesh.
 */

import { IPNDevice } from './types';

/**
 * Calculates a posture score based on device capabilities and SRT binding.
 *
 * @param capabilities List of device capabilities (e.g., 'ipn-ready', 'secure-enclave')
 * @param srtBound Whether the device is bound to the Sensor & Capture input discipline
 */
export function calculatePostureScore(capabilities: string[], srtBound: boolean): number {
    let score = 50; // Baseline for any identified device

    if (srtBound) {
        score += 30; // Significant trust increase for SRT-bound devices
    }

    if (capabilities.includes('ipn-ready')) {
        score += 10;
    }

    if (capabilities.includes('secure-enclave')) {
        score += 10;
    }

    return Math.min(score, 100);
}

/**
 * Validates a device record against minimum posture requirements.
 *
 * @param device The IPNDevice record to validate
 */
export function validateDevicePosture(device: IPNDevice): { valid: boolean; reason?: string } {
    if (device.postureScore < 30) {
        return { 
            valid: false, 
            reason: 'CRITICAL_POSTURE_FAILURE: Posture score below minimum operational threshold.' 
        };
    }

    // In a real implementation, this would also check for revoked keys, 
    // binary signatures, and known-vulnerable OS versions.

    return { valid: true };
}
