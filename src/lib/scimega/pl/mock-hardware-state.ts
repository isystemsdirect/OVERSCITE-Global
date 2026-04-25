/**
 * @classification MOCK_HARDWARE_STATE
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Simulates hardware presence and readiness for SCIMEGA™ DOS.
 * @warning All outputs are mock data. No real device interaction occurs.
 */

export interface SCIMEGAMockHardwareStatus {
  fcOnline: boolean;
  companionOnline: boolean;
  payloadReady: boolean;
  pilotInputAvailable: boolean;
  teonSafetyChannelOnline: boolean;
  batteryVoltage: number;
  cpuLoadPercent: number;
  memoryUsagePercent: number;
}

export class MockHardwareState {
  /**
   * Generates a snapshot of current mock hardware state.
   */
  static getSnapshot(): SCIMEGAMockHardwareStatus {
    return {
      fcOnline: true,
      companionOnline: true,
      payloadReady: true,
      pilotInputAvailable: true,
      teonSafetyChannelOnline: true,
      batteryVoltage: 16.8, // 4S Full
      cpuLoadPercent: 12,
      memoryUsagePercent: 34
    };
  }

  /**
   * Reports system health messages for the PL layer.
   */
  static getHealthDiagnostics(): string[] {
    return [
      'STATUS: FC_HEARTBEAT_DETECTED (SIMULATED)',
      'STATUS: COMPANION_OS_READY (SIMULATED)',
      'STATUS: PILOT_STICK_NEUTRAL (SIMULATED)',
      'STATUS: TEON_SAFETY_ACK (SIMULATED)',
      'NOTICE: ALL CHANNELS OPERATING IN SIMULATION POSTURE'
    ];
  }
}
