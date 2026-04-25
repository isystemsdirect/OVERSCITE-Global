/**
 * @classification SCIMEGA_DRONE_SCHEDULE_CONTEXT
 * @authority SCIMEGA Origin Unit
 * @purpose Defines the SCIMEGA™ drone schedule context for SmartSCHEDULER binding.
 */

export type DroneReadinessState = 'ready' | 'charging' | 'maintenance' | 'restricted' | 'offline';

export interface DroneScheduleContext {
  buildId: string;
  aircraftClass: string;
  readiness: DroneReadinessState;
  batteryLevelPercent: number;
  maintenanceState: {
    requiresMaintenance: boolean;
    reason?: string;
  };
  environmentalLimits: {
    windMaxMph: number;
    tempMinF: number;
    tempMaxF: number;
  };
  assignedMethod?: string; // If bound to a specific method already
}
