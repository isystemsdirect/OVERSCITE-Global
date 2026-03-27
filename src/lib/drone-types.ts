export type DroneType = 'quadcopter' | 'hexacopter' | 'octocopter' | 'fixed-wing';

export interface FlightController {
  firmware: string;
  version: string;
  pids: { p: number; i: number; d: number };
}

export interface ECUConfig {
  voltage: number;
  maxCurrent: number;
  escProtocol: string;
}

export interface SensorArray {
  hasGps: boolean;
  hasLidar: boolean;
  hasOpticalFlow: boolean;
}

export interface DroneConfiguration {
  id: string;
  name: string;
  type: DroneType;
  flightController: FlightController;
  ecu: ECUConfig;
  sensors: SensorArray;
  camera: { resolution: string; fps: number; gimbal: boolean };
  faaCompliance: { registered: boolean; remoteId: boolean };
}

export interface ActivityLog {
  timestamp: string;
  message: string;
}
