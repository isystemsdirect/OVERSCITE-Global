/**
 * @classification CONTROL_ARBITRATION_ENGINE
 * @authority Flight Autonomy Architecture Unit
 * @purpose Arbitrates control authority between IU Pilot, Scing BFI, BANE, and TEON.
 * @warning Simulation only. No hardware command output.
 */

import { SCIMEGAControlAuthority, SCIMEGAFlightMode, SCIMEGAPilotInterruptEvent } from './scimega-autonomy-types';
import { AuthorityPriority } from './authority-priority';

export interface AuthorityResolution {
  activeAuthority: SCIMEGAControlAuthority;
  priority: AuthorityPriority;
  reason: string;
  preemptionSource: string | null;
}

export class ControlArbitrationEngine {
  /**
   * Determines the active control authority based on current flight mode, safety envelopes, and interrupt events.
   * Resolves conflicts deterministically using AuthorityPriority.
   */
  static determineAuthority(
    activeMode: SCIMEGAFlightMode,
    isTeonActive: boolean,
    isBaneOverride: boolean,
    pilotInterrupt?: SCIMEGAPilotInterruptEvent
  ): AuthorityResolution {
    
    // 0. Highest Priority: TEON Safety Envelope
    if (!isTeonActive) {
      return {
        activeAuthority: 'TEON_SAFETY',
        priority: AuthorityPriority.TEON_SAFETY,
        reason: 'TEON Safety Envelope breached. Hard enforcement active.',
        preemptionSource: 'TEON_HARD_ENFORCEMENT'
      };
    }

    // 1. Pilot Interrupt / Emergency Takeover
    if (pilotInterrupt) {
      if (pilotInterrupt.severity === 'emergency_takeover' || pilotInterrupt.severity === 'hard_interrupt') {
        return {
          activeAuthority: 'IU_PILOT',
          priority: AuthorityPriority.PILOT_INTERRUPT,
          reason: `Pilot interrupt detected (${pilotInterrupt.severity}).`,
          preemptionSource: `PILOT_${pilotInterrupt.triggerSource.toUpperCase()}`
        };
      }
      if (pilotInterrupt.severity === 'security_override') {
        return {
          activeAuthority: 'BANE_HOLD',
          priority: AuthorityPriority.SECURITY_OVERRIDE,
          reason: 'Security override detected. Locking automation.',
          preemptionSource: 'SECURITY_OVERRIDE'
        };
      }
    }

    // 3. BANE Override Priority
    if (isBaneOverride) {
      return {
        activeAuthority: 'BANE_HOLD',
        priority: AuthorityPriority.BANE_HOLD,
        reason: 'BANE pre-activation gate or override active.',
        preemptionSource: 'BANE_GOVERNANCE'
      };
    }

    // 4 & 5. Mode-based Resolution
    switch (activeMode) {
      case 'manual_pilot':
        return {
          activeAuthority: 'IU_PILOT',
          priority: AuthorityPriority.PILOT_INTERRUPT,
          reason: 'Manual pilot mode selected.',
          preemptionSource: null
        };
      case 'assisted_pilot':
        return {
          activeAuthority: 'SHARED_ASSISTED',
          priority: AuthorityPriority.ASSISTED_MODE,
          reason: 'Assisted flight mode active.',
          preemptionSource: null
        };
      case 'partial_automation':
      case 'full_mission_automation':
      case 'return_to_origin':
        return {
          activeAuthority: 'SCING_BFI',
          priority: AuthorityPriority.SCING_AUTONOMY,
          reason: 'Scing BFI automation active.',
          preemptionSource: null
        };
      case 'anchor_hold':
      case 'pilot_interrupt':
      case 'security_override':
        return {
          activeAuthority: 'BANE_HOLD',
          priority: AuthorityPriority.BANE_HOLD,
          reason: 'Safety hold or interrupt state active.',
          preemptionSource: null
        };
      default:
        return {
          activeAuthority: 'TEON_SAFETY',
          priority: AuthorityPriority.TEON_SAFETY,
          reason: 'Failsafe default triggered due to unknown mode.',
          preemptionSource: 'SYSTEM_FAILSAFE'
        };
    }
  }
}
