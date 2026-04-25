/**
 * @classification MAVLINK_DRY_LINK_CONTRACT
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the Dry-Link contract for MAVLink hardware (ArduPilot/PX4).
 * @warning DRY-LINK ONLY. No UDP/Serial I/O or MAVLink frame generation authorized.
 */

import { SCIMEGADryLinkAdapterContract } from '../scimega-drylink-types';

export class MavlinkDryLinkContract {
  /**
   * Returns the static contract for MAVLink adapter readiness.
   */
  static getContract(): SCIMEGADryLinkAdapterContract {
    return {
      adapterId: 'ADAPT-MAVLINK-V2',
      type: 'mavlink',
      description: 'MAVLink V2 Interface for ArduPilot/PX4 Autopilots.',
      baudRates: [57600, 115200, 921600],
      ports: ['TELEM1', 'TELEM2', 'UDP_14550', 'TCP_5760'],
      commandFamilies: [
        'HEARTBEAT',
        'SYS_STATUS',
        'GPS_RAW_INT',
        'ATTITUDE',
        'VFR_HUD',
        'MISSION_COUNT',
        'MISSION_ITEM_INT',
        'COMMAND_LONG', // Blocked by BANE for mutation
        'PARAM_SET',    // Blocked by BANE for mutation
        'SET_MODE'      // Blocked by BANE for mutation
      ],
      safetyLimitations: [
        'READ_ONLY_TELEMETRY_MODEL',
        'NO_GEOFENCE_MUTATION',
        'NO_MISSION_WRITE_AUTHORIZED',
        'ZTI_MAV_BOUNDS_ACTIVE'
      ],
      isExecutionDisabled: true
    };
  }

  /**
   * Reports the dry-link diagnostic state for this contract.
   */
  static getDiagnosticMetadata(): string[] {
    return [
      'MAVLINK_CONTRACT: LOADED (ArduPilot/PX4 Profile)',
      'IO_LAYER: STUBBED (No net/dgram/serial imports)',
      'PROTOCOL_MODE: V2 (Read-Only Scaffold)',
      'NOTICE: This contract describes message definitions only.'
    ];
  }
}
