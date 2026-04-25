/**
 * @classification PILOT_INPUT_CHANNEL
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Models pilot stick, yoke, and switch inputs for the PilotInterruptProtocol.
 * @warning No HID or serial device reads allowed. All inputs are simulated.
 */

import { SCIMEGAPilotInputChannel } from './scimega-pl-types';
import { SCIMEGAPilotInterruptEvent } from '../autonomy/scimega-autonomy-types';

export interface SimulatedPilotStickState {
  roll: number;
  pitch: number;
  yaw: number;
  throttle: number;
  switches: Record<string, boolean>;
}

export class PilotInputChannel {
  /**
   * Models the pilot input channel description.
   */
  static getChannelModel(channelId: string): SCIMEGAPilotInputChannel {
    return {
      channelId: channelId,
      source: 'simulated',
      inputs: ['stick', 'yoke', 'throttle', 'switch', 'emergency_stop'],
      latencyMs: 12,
      isAvailable: true
    };
  }

  /**
   * Returns a simulated neutral stick state.
   */
  static getSimulatedNeutralState(): SimulatedPilotStickState {
    return {
      roll: 1500, // PWM Neutral
      pitch: 1500,
      yaw: 1500,
      throttle: 1000, // Min
      switches: {
        'ARM': false,
        'MODE_AUTO': true,
        'RTL': false,
        'KILL': false
      }
    };
  }

  /**
   * Binds simulated input state to the PilotInterruptProtocol.
   * Maps stick deflection or emergency switches to interrupt events.
   */
  static bindToInterrupt(state: SimulatedPilotStickState): SCIMEGAPilotInterruptEvent | null {
    const neutral = 1500;
    const threshold = 150; // Deadband before interrupt triggering

    const rollDiff = Math.abs(state.roll - neutral);
    const pitchDiff = Math.abs(state.pitch - neutral);
    const yawDiff = Math.abs(state.yaw - neutral);

    // Emergency Override Switches
    if (state.switches['KILL']) {
      return {
        eventId: `PL-INT-KILL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'emergency_takeover',
        triggerSource: 'switch_value',
        requiresAnchorHold: false
      };
    }

    // Stick Deflection (Manual Intervention)
    if (rollDiff > threshold || pitchDiff > threshold || yawDiff > threshold) {
      return {
        eventId: `PL-INT-STICK-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'hard_interrupt',
        triggerSource: 'stick',
        requiresAnchorHold: true
      };
    }

    return null;
  }

  /**
   * Summarizes the pilot input diagnostic state.
   */
  static getDiagnosticReport(): string[] {
    return [
      'PILOT_INPUT: SIMULATED_CHANNEL_ACTIVE',
      'HEARTBEAT: OK (12ms latent)',
      'STICK_STATE: NEUTRAL',
      'INTERRUPT_BINDING: ACTIVE (Routing to PilotInterruptProtocol)',
      'NOTICE: NO HID OR SERIAL READS ACTIVE'
    ];
  }
}
