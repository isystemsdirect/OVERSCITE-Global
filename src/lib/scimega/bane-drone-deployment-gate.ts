/**
 * @classification BANE_DRONE_DEPLOYMENT_GATE
 * @authority BANE Governance Unit
 * @purpose Evaluates readiness and gates drone deployment prior to operational execution.
 */

import type { MethodCompatibilityResult } from './method-compatibility';
import type { DroneScheduleContext } from './drone-schedule-context';
import type { SchedulePosture } from '@/lib/types';

export type DeploymentGateVerdict = 'APPROVED' | 'RESTRICTED' | 'BLOCKED' | 'MANUAL_REVIEW';

export interface BaneDeploymentGateResult {
  verdict: DeploymentGateVerdict;
  reasons: string[];
  requiresManualReview: boolean;
}

export class BaneDroneDeploymentGate {
  /**
   * Validates all dimensions of deployment readiness.
   */
  static evaluate(
    compatibility: MethodCompatibilityResult,
    droneContext: DroneScheduleContext,
    schedulerPosture: SchedulePosture,
    currentWindMph: number,
    currentTempF: number
  ): BaneDeploymentGateResult {
    const result: BaneDeploymentGateResult = {
      verdict: 'APPROVED',
      reasons: [],
      requiresManualReview: false
    };

    let isBlocked = false;
    let isRestricted = false;
    let needsReview = false;

    // 1. Validate Method Compatibility
    if (compatibility.status === 'blocked') {
      result.reasons.push('Method compatibility is BLOCKED.');
      isBlocked = true;
    } else if (compatibility.status === 'restricted') {
      result.reasons.push('Method compatibility is RESTRICTED.');
      isRestricted = true;
    } else if (compatibility.status === 'warning') {
      result.reasons.push('Method compatibility has WARNINGS.');
      needsReview = true;
    }

    // 2. Validate Drone Readiness
    if (droneContext.readiness !== 'ready') {
      result.reasons.push(`Drone is not in 'ready' state (Current: ${droneContext.readiness}).`);
      isBlocked = true;
    }

    if (droneContext.batteryLevelPercent < 20) {
      result.reasons.push(`Drone battery critically low (${droneContext.batteryLevelPercent}%).`);
      isBlocked = true;
    } else if (droneContext.batteryLevelPercent < 40) {
      result.reasons.push(`Drone battery low (${droneContext.batteryLevelPercent}%).`);
      isRestricted = true;
    }

    if (droneContext.maintenanceState.requiresMaintenance) {
      result.reasons.push(`Drone requires maintenance: ${droneContext.maintenanceState.reason || 'Unknown'}.`);
      isBlocked = true;
    }

    // 3. Validate Environmental Safety (Real-time vs Limits)
    if (currentWindMph > droneContext.environmentalLimits.windMaxMph) {
      result.reasons.push(`Current wind (${currentWindMph}mph) exceeds drone limit (${droneContext.environmentalLimits.windMaxMph}mph).`);
      isBlocked = true;
    }

    if (currentTempF < droneContext.environmentalLimits.tempMinF || currentTempF > droneContext.environmentalLimits.tempMaxF) {
      result.reasons.push(`Current temp (${currentTempF}F) is outside drone limits (${droneContext.environmentalLimits.tempMinF}F - ${droneContext.environmentalLimits.tempMaxF}F).`);
      isBlocked = true;
    }

    // 4. Validate Scheduler Posture
    if (schedulerPosture === 'blocked') {
      result.reasons.push('Scheduler posture is BLOCKED.');
      isBlocked = true;
    } else if (schedulerPosture === 'restricted') {
      result.reasons.push('Scheduler posture is RESTRICTED.');
      isRestricted = true;
    } else if (schedulerPosture === 'manual_review_required') {
      result.reasons.push('Scheduler posture requires MANUAL REVIEW.');
      needsReview = true;
    } else if (schedulerPosture === 'advisory_candidate') {
      result.reasons.push('Scheduler posture is ADVISORY (Suboptimal condition).');
      needsReview = true;
    }

    // Resolve final verdict
    if (isBlocked) {
      result.verdict = 'BLOCKED';
    } else if (isRestricted) {
      result.verdict = 'RESTRICTED';
    } else if (needsReview) {
      result.verdict = 'MANUAL_REVIEW';
      result.requiresManualReview = true;
    }

    return result;
  }
}
