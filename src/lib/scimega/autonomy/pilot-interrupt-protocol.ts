/**
 * @classification PILOT_INTERRUPT_PROTOCOL
 * @authority Flight Autonomy Architecture Unit
 * @purpose Represents the detection and handling of physical pilot intervention.
 * @warning Simulation only. Does not read live RC inputs or cancel live hardware automation.
 */

import { SCIMEGAPilotInterruptEvent, SCIMEGAPilotInterruptSeverity, SCIMEGAFlightMode } from './scimega-autonomy-types';

export class PilotInterruptProtocol {
  /**
   * Simulates the detection of a pilot interrupt and determines the immediate reaction.
   * Hard Requirement: automation -> anchor_hold -> control_confirm -> manual.
   */
  static processInterrupt(
    event: SCIMEGAPilotInterruptEvent,
    currentMode: SCIMEGAFlightMode
  ): { targetMode: SCIMEGAFlightMode; confirmationRequired: boolean; systemMessage: string } {
    
    const isAutomationActive = currentMode === 'full_mission_automation' || currentMode === 'partial_automation';

    // Emergency Takeover: Special governance. 
    // In Phase 10.1, even emergency takeover while in automation forces anchor hold for one sync cycle 
    // to prevent kinetic shock, UNLESS it's a security override.
    if (event.severity === 'emergency_takeover') {
      if (isAutomationActive) {
        return {
          targetMode: 'anchor_hold',
          confirmationRequired: true,
          systemMessage: 'EMERGENCY TAKEOVER DURING AUTOMATION. Forcing anchor hold for stabilization. Confirm to take manual control.'
        };
      }
      return {
        targetMode: 'manual_pilot',
        confirmationRequired: false,
        systemMessage: 'EMERGENCY TAKEOVER DETECTED. Manual pilot active.'
      };
    }

    // Security Override: BANE triggered. Always locks.
    if (event.severity === 'security_override') {
      return {
        targetMode: 'security_override',
        confirmationRequired: true,
        systemMessage: 'SECURITY OVERRIDE DETECTED. Automation locked by BANE. Investigation required.'
      };
    }

    // Hard Interrupt: Substantial control input detected
    if (event.severity === 'hard_interrupt') {
      // Mandatory Anchor Hold transition if coming from automation
      if (isAutomationActive) {
        return {
          targetMode: 'anchor_hold',
          confirmationRequired: true,
          systemMessage: 'HARD INTERRUPT DURING AUTOMATION. Automation suspended. System entering anchor hold for pilot transition.'
        };
      }

      return {
        targetMode: 'manual_pilot',
        confirmationRequired: false,
        systemMessage: 'HARD INTERRUPT DETECTED. Manual pilot active.'
      };
    }

    // Soft Interrupt: Minor input, maybe stick bump
    if (event.severity === 'soft_interrupt') {
      return {
        targetMode: 'anchor_hold',
        confirmationRequired: true,
        systemMessage: 'SOFT INTERRUPT DETECTED. Pausing automation. System holding position.'
      };
    }

    // Default failsafe
    return {
      targetMode: 'anchor_hold',
      confirmationRequired: true,
      systemMessage: 'GOVERNANCE LOCK: Unknown interrupt profile. Safing system to anchor hold.'
    };
  }
}
