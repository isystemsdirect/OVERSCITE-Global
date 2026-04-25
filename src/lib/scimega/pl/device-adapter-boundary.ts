/**
 * @classification DEVICE_ADAPTER_BOUNDARY
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Exposes hardware capability descriptions without enabling execution or communication.
 * @warning No serial, network, or device command logic allowed.
 */

import { SCIMEGAPhysicalLayerProfile } from './scimega-pl-types';

export class DeviceAdapterBoundary {
  /**
   * Returns a static description of the physical layer profile.
   * Hard Constraint: No active connection logic.
   */
  static getProfile(profileId: string): SCIMEGAPhysicalLayerProfile {
    return {
      profileId: profileId,
      fcModel: 'SCINGULAR-X1-FC',
      companionModel: 'SCIMEGA-NODE-V1',
      adapterStatus: 'simulated',
      channels: [
        {
          channelId: 'CH-MSP-01',
          protocol: 'MSP',
          direction: 'bidirectional',
          isEncrypted: true,
          status: 'simulated',
          capabilities: ['telemetry_read', 'configuration_read']
        },
        {
          channelId: 'CH-MAVLINK-01',
          protocol: 'MAVLINK',
          direction: 'bidirectional',
          isEncrypted: false,
          status: 'inert',
          capabilities: ['telemetry_read']
        }
      ],
      pilotInputs: [
        {
          channelId: 'PI-STICK-01',
          source: 'simulated',
          inputs: ['stick', 'switch', 'emergency_stop'],
          latencyMs: 15,
          isAvailable: true
        }
      ],
      safetyChannels: [
        {
          channelId: 'SC-HEARTBEAT-01',
          type: 'heartbeat',
          signals: ['hard_stop', 'anchor_hold'],
          isReady: true
        }
      ]
    };
  }

  /**
   * Reports capability metadata for a specific adapter.
   */
  static getAdapterCapabilities(adapterId: string): string[] {
    return [
      `ADAPTER_ID: ${adapterId}`,
      'CAPABILITY: READ_ONLY_TELEMETRY',
      'CAPABILITY: CONFIGURATION_PROPOSAL_MAPPING',
      'RESTRICTION: NO_COMMAND_TRANSMISSION',
      'RESTRICTION: NO_SERIAL_WRITE',
      'ENFORCEMENT: SIMULATION_POSTURE'
    ];
  }
}
