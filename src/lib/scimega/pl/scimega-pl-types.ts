/**
 * @classification SCIMEGA_PL_TYPES
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the core types for the SCIMEGA™ Physical Laboratory (PL) boundary.
 * @warning Simulation only. No hardware execution allowed.
 */

export type SCIMEGADeviceAdapterStatus = 'inert' | 'simulated' | 'dry_link_only' | 'mock_connected' | 'restricted' | 'blocked';

export interface SCIMEGAHardwareChannel {
  channelId: string;
  protocol: 'MSP' | 'MAVLINK' | 'DSHOT' | 'CRSF' | 'GHOST' | 'ELRS' | 'SERIAL_RAW';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  isEncrypted: boolean;
  status: SCIMEGADeviceAdapterStatus;
  capabilities: string[];
}

export interface SCIMEGAPilotInputChannel {
  channelId: string;
  source: 'rc_receiver' | 'companion_link' | 'telemetry_link' | 'simulated';
  inputs: ('stick' | 'yoke' | 'throttle' | 'switch' | 'emergency_stop')[];
  latencyMs: number;
  isAvailable: boolean;
}

export interface SCIMEGASafetyChannel {
  channelId: string;
  type: 'heartbeat' | 'kill_switch' | 'enforcement_signal';
  signals: ('hard_stop' | 'anchor_hold' | 'return_to_origin' | 'abort')[];
  isReady: boolean;
}

export interface SCIMEGADeviceAdapterState {
  adapterId: string;
  status: SCIMEGADeviceAdapterStatus;
  lastSyncTimestamp: string | null;
  activeChannels: string[];
  errors: string[];
}

export interface SCIMEGAPhysicalLayerProfile {
  profileId: string;
  fcModel: string;
  companionModel: string;
  adapterStatus: SCIMEGADeviceAdapterStatus;
  channels: SCIMEGAHardwareChannel[];
  pilotInputs: SCIMEGAPilotInputChannel[];
  safetyChannels: SCIMEGASafetyChannel[];
}
