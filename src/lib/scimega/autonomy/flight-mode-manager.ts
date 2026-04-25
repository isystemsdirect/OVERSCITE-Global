/**
 * @classification FLIGHT_MODE_MANAGER
 * @authority Flight Autonomy Architecture Unit
 * @purpose Manages transitions between autonomy modes, enforcing safety and authorization gates.
 * @warning Simulation only. Does not trigger live flight mode changes.
 */

import { SCIMEGAFlightMode, SCIMEGAAutonomyState } from './scimega-autonomy-types';

export class FlightModeManager {
  /**
   * Evaluates a requested transition and returns the new mode or rejects it.
   */
  static requestTransition(
    currentState: SCIMEGAAutonomyState,
    requestedMode: SCIMEGAFlightMode,
    isIuAuthorized: boolean
  ): { allowed: boolean; nextMode: SCIMEGAFlightMode; reason: string } {
    
    // Hard blocks for full automation
    if (requestedMode === 'full_mission_automation') {
      if (!isIuAuthorized) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'IU Authorization Required for Full Automation' };
      }
      if (!currentState.baneAutomationApproved) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'BANE Automation Authority Gate not approved' };
      }
      if (!currentState.teonEnvelopeActive) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'TEON Flight Safety Envelope inactive' };
      }
      if (!currentState.pilotInterruptAvailable) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'Pilot Interrupt unavailable' };
      }
    }

    // Hard blocks for partial automation
    if (requestedMode === 'partial_automation') {
      if (!currentState.baneAutomationApproved) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'BANE Automation Authority Gate not approved' };
      }
      if (!currentState.teonEnvelopeActive) {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'TEON Flight Safety Envelope inactive' };
      }
    }

    // Security Override and Pilot Interrupt can always be transitioned to by system events
    if (requestedMode === 'security_override' || requestedMode === 'pilot_interrupt' || requestedMode === 'anchor_hold') {
      return { allowed: true, nextMode: requestedMode, reason: 'Safety/Interrupt override granted' };
    }

    // Manual pilot is always accessible, provided security override isn't active
    if (requestedMode === 'manual_pilot') {
      if (currentState.activeMode === 'security_override') {
        return { allowed: false, nextMode: currentState.activeMode, reason: 'Cannot exit security override without BANE clearance' };
      }
      return { allowed: true, nextMode: requestedMode, reason: 'Manual control transition granted' };
    }

    // Default allow for other transitions if no specific block is met
    return { allowed: true, nextMode: requestedMode, reason: 'Transition clear' };
  }
}
