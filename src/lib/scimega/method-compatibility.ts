/**
 * @classification SCIMEGA_METHOD_COMPATIBILITY
 * @authority SCIMEGA Origin Unit
 * @purpose Evaluates SCIMEGA build capabilities against method requirements.
 */

import type { SCIMEGA_Capabilities } from './capability-map';
import type { InspectionMethod } from '@/lib/inspections/methods/contracts';

export type MethodCompatibilityStatus = 'compatible' | 'warning' | 'restricted' | 'blocked';

export interface MethodCompatibilityResult {
  methodId: string;
  status: MethodCompatibilityStatus;
  missingCapabilities: string[];
  reasons: string[];
}

const STABILITY_RANK: Record<string, number> = {
  'LOW': 1,
  'MEDIUM': 2,
  'HIGH': 3,
  'PRECISION': 4
};

export function evaluateMethodCompatibility(
  capabilities: SCIMEGA_Capabilities,
  method: InspectionMethod
): MethodCompatibilityResult {
  const result: MethodCompatibilityResult = {
    methodId: method.methodId,
    status: 'compatible',
    missingCapabilities: [],
    reasons: []
  };

  const required = method.schedulingConstraints.requiredCapabilities;

  if (!required) {
    // If no specific drone capabilities are required, it's generally compatible
    return result;
  }

  let isBlocked = false;
  let isRestricted = false;

  if (required.visual && !capabilities.payloads.visual) {
    result.missingCapabilities.push('Visual Payload');
    result.reasons.push('Method requires visual camera payload.');
    isBlocked = true;
  }

  if (required.thermal && !capabilities.payloads.thermal) {
    result.missingCapabilities.push('Thermal Payload');
    result.reasons.push('Method requires thermal imaging payload.');
    isBlocked = true;
  }

  if (required.lidar && !capabilities.payloads.lidar) {
    result.missingCapabilities.push('LiDAR Payload');
    result.reasons.push('Method requires LiDAR payload.');
    isBlocked = true;
  }

  if (required.minimumRangeMeters && capabilities.maxRangeMeters < required.minimumRangeMeters) {
    result.missingCapabilities.push(`Range >= ${required.minimumRangeMeters}m`);
    result.reasons.push(`Drone max range (${capabilities.maxRangeMeters}m) is less than required (${required.minimumRangeMeters}m).`);
    isBlocked = true;
  }

  if (required.minimumFlightTimeMinutes && capabilities.flightTimeMinutes < required.minimumFlightTimeMinutes) {
    result.missingCapabilities.push(`Flight Time >= ${required.minimumFlightTimeMinutes}min`);
    result.reasons.push(`Drone flight time (${capabilities.flightTimeMinutes}min) is less than required (${required.minimumFlightTimeMinutes}min).`);
    isRestricted = true; // Could be mitigated with multiple batteries, so restricted instead of blocked
  }

  if (required.minimumStabilityClass && STABILITY_RANK[capabilities.stabilityClass] < STABILITY_RANK[required.minimumStabilityClass]) {
    result.missingCapabilities.push(`Stability >= ${required.minimumStabilityClass}`);
    result.reasons.push(`Drone stability (${capabilities.stabilityClass}) does not meet the minimum requirement (${required.minimumStabilityClass}).`);
    isBlocked = true;
  }

  // Also check if the drone explicitly supports the use case
  if (!capabilities.inspectionUseCases.includes(method.methodId)) {
    result.reasons.push(`Drone profile does not explicitly list this use case (${method.methodId}).`);
    if (!isBlocked && !isRestricted) {
      result.status = 'warning';
    }
  }

  if (isBlocked) {
    result.status = 'blocked';
  } else if (isRestricted) {
    result.status = 'restricted';
  }

  return result;
}
