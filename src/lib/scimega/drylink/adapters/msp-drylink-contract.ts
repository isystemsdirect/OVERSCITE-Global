/**
 * @classification MSP_DRY_LINK_CONTRACT
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the Dry-Link contract for Multiwii Serial Protocol (MSP) hardware (Betaflight).
 * @warning DRY-LINK ONLY. No serial I/O or MSP encoding authorized.
 */

import { SCIMEGADryLinkAdapterContract } from '../scimega-drylink-types';

export class MspDryLinkContract {
  /**
   * Returns the static contract for MSP adapter readiness.
   */
  static getContract(): SCIMEGADryLinkAdapterContract {
    return {
      adapterId: 'ADAPT-MSP-V4',
      type: 'msp',
      description: 'Multiwii Serial Protocol (MSP) Interface for Betaflight Flight Controllers.',
      baudRates: [115200, 230400, 460800, 921600],
      ports: ['UART1', 'UART2', 'UART3', 'USB_VCP'],
      commandFamilies: [
        'MSP_API_VERSION',
        'MSP_FC_VARIANT',
        'MSP_FC_VERSION',
        'MSP_STATUS',
        'MSP_RAW_IMU',
        'MSP_SERVO',
        'MSP_MOTOR',
        'MSP_RC',
        'MSP_SET_RAW_RC', // Blocked by BANE in execution
        'MSP_SET_PID',    // Blocked by BANE in execution
        'MSP_EEPROM_WRITE' // Blocked by BANE in execution
      ],
      safetyLimitations: [
        'NO_LIVE_WRITE_AUTHORIZED',
        'SIMULATION_ONLY_BOUNDS',
        'FAIL_CLOSED_ON_DISCONNECT',
        'HARD_MUTATION_LOCK_ACTIVE'
      ],
      isExecutionDisabled: true
    };
  }

  /**
   * Reports the dry-link diagnostic state for this contract.
   */
  static getDiagnosticMetadata(): string[] {
    return [
      'MSP_CONTRACT: LOADED (Betaflight V4.x Profile)',
      'IO_LAYER: STUBBED (No serial imports)',
      'MUTATION_GATE: LOCKED (BANE Enforcement)',
      'NOTICE: This contract describes capabilities only; it does not connect.'
    ];
  }
}
