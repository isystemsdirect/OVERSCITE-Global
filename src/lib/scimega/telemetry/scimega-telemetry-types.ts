/**
 * @classification SCIMEGA_TELEMETRY_TYPES
 * @authority SCIMEGA Telemetry Bridge Unit
 * @purpose Defines the strong types for inbound, read-only telemetry.
 * @warning INBOUND OBSERVATION ONLY. NO COMMAND AND CONTROL AUTHORIZED.
 */

export type CompanionTelemetrySource = 
  | 'teleport_companion'
  | 'simulated_mock'
  | 'hardware_in_the_loop';

export type TelemetryTrustState = 
  | 'simulated'
  | 'observed'
  | 'degraded'
  | 'stale'
  | 'rejected';

export interface SCIMEGATelemetryFrame {
  frameId: string;
  source: CompanionTelemetrySource;
  timestamp: string;
  trustState: TelemetryTrustState;
  
  battery?: {
    voltage: number;
    currentAmps: number;
    percentRemaining: number;
  };
  
  gps?: {
    lat: number;
    lon: number;
    altMeters: number;
    satCount: number;
    fixType: number; // 0=none, 2=2d, 3=3d
  };
  
  signal?: {
    rssi: number;
    linkQualityPercent: number;
  };
  
  payloadHealth?: {
    cameraActive: boolean;
    sensorErrors: string[];
  };
}
