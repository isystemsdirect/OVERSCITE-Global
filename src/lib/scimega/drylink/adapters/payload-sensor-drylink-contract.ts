/**
 * @classification PAYLOAD_SENSOR_DRY_LINK_CONTRACT
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the Dry-Link contract for Payload Sensors (Camera, LiDAR, Thermal).
 * @warning DRY-LINK ONLY. No media capture or device reads authorized.
 */

import { SCIMEGADryLinkAdapterContract } from '../scimega-drylink-types';

export class PayloadSensorDryLinkContract {
  /**
   * Returns the static contract for Payload adapter readiness.
   */
  static getContract(): SCIMEGADryLinkAdapterContract {
    return {
      adapterId: 'ADAPT-PAYLOAD-V1',
      type: 'payload_sensor',
      description: 'Unified Payload Interface for Vision, Thermal, and LiDAR Sensors.',
      ports: ['CSI-2', 'MIPI', 'USB3.0', 'GMSL2'],
      commandFamilies: [
        'GET_FRAME_METADATA',
        'GET_THERMAL_ARRAY',
        'GET_LIDAR_SCAN',
        'SET_EXPOSURE',
        'TRIGGER_SHUTTER',
        'START_RECORDING' // Blocked by BANE
      ],
      safetyLimitations: [
        'NO_MEDIA_PERSISTENCE_AUTHORIZED',
        'DRY_LINK_STREAM_SCENARIOS_ONLY',
        'NO_LIVE_CAPTURE_AUTHORITY',
        'SENSOR_STUB_ONLY'
      ],
      isExecutionDisabled: true
    };
  }

  /**
   * Reports the dry-link diagnostic state for this contract.
   */
  static getDiagnosticMetadata(): string[] {
    return [
      'PAYLOAD_CONTRACT: LOADED (Multi-Sensor Profile)',
      'IO_LAYER: STUBBED (No media/hid imports)',
      'STATE: VIRTUAL_SCAFFOLD',
      'NOTICE: This contract defines sensor telemetry mapping only.'
    ];
  }
}
