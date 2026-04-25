/**
 * @classification PILOT_INPUT_DRY_LINK_CONTRACT
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the Dry-Link contract for Pilot Input (RC, Gamepad, HID).
 * @warning DRY-LINK ONLY. No HID or Gamepad API access authorized.
 */

import { SCIMEGADryLinkAdapterContract } from '../scimega-drylink-types';

export class PilotInputDryLinkContract {
  /**
   * Returns the static contract for Pilot Input adapter readiness.
   */
  static getContract(): SCIMEGADryLinkAdapterContract {
    return {
      adapterId: 'ADAPT-PILOT-V1',
      type: 'pilot_input',
      description: 'Pilot Input Interface for RC Receivers and Ground Control Station HID.',
      ports: ['USB_HID', 'SBUS', 'PPM', 'WIFI_LINK'],
      commandFamilies: [
        'READ_STICKS',
        'READ_SWITCHES',
        'TRIGGER_INTERRUPT',
        'CALIBRATE_DEADBAND'
      ],
      safetyLimitations: [
        'MANDATORY_INTERRUPT_BINDING',
        'NO_LIVE_HID_READ_AUTHORIZED',
        'SIMULATED_PILOT_MODEL_ONLY',
        'FAIL_CLOSED_ON_PILOT_LOSS'
      ],
      isExecutionDisabled: true
    };
  }

  /**
   * Reports the dry-link diagnostic state for this contract.
   */
  static getDiagnosticMetadata(): string[] {
    return [
      'PILOT_CONTRACT: LOADED (Standard Stick Profile)',
      'IO_LAYER: STUBBED (No navigator.getGamepads imports)',
      'BINDING: PilotInterruptProtocol',
      'NOTICE: This contract routes future input to the Autonomy core.'
    ];
  }
}
