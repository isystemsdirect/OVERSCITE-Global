/**
 * @classification MISSION_EXECUTION_MODEL
 * @authority Flight Autonomy Architecture Unit
 * @purpose Defines the inspection mission plan and evaluates mission readiness against gates.
 * @warning Simulation only. Does not output live mission commands or waypoints to hardware.
 */

import { SCIMEGAMissionPlan } from './scimega-autonomy-types';

export class MissionExecutionModel {
  /**
   * Evaluates if a mission plan is fully authorized and ready for simulated execution.
   */
  static evaluateMissionReadiness(
    plan: SCIMEGAMissionPlan,
    arcAuthorized: boolean,
    baneApproved: boolean,
    teonEnvelopeActive: boolean,
    capabilitiesSufficient: boolean
  ): { isReady: boolean; readinessStatus: string } {
    
    if (!plan.steps || plan.steps.length === 0) {
      return { isReady: false, readinessStatus: 'Mission plan is empty.' };
    }

    if (!arcAuthorized) {
      return { isReady: false, readinessStatus: 'ARC Identity Authorization missing.' };
    }

    if (!baneApproved) {
      return { isReady: false, readinessStatus: 'BANE Automation Gate rejected.' };
    }

    if (!teonEnvelopeActive) {
      return { isReady: false, readinessStatus: 'TEON Flight Safety Envelope inactive.' };
    }

    if (!capabilitiesSufficient) {
      return { isReady: false, readinessStatus: 'Aircraft capabilities insufficient for mission profile.' };
    }

    // Verify all steps are marked safe
    const unsafeStep = plan.steps.find(step => !step.isSafeToExecute);
    if (unsafeStep) {
      return { isReady: false, readinessStatus: `Mission contains unsafe step: ${unsafeStep.stepId} (${unsafeStep.type})` };
    }

    return { isReady: true, readinessStatus: 'MISSION READY FOR SIMULATION' };
  }
}
