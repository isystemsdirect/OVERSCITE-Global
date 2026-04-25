/**
 * @classification SCINGULAR_RUNTIME_CORE
 * @engine TELEPORT_HAL
 * @purpose Hardware Abstraction Layer for ScingularRuntimeEngine. Bridges OS-grade logic to physical or simulated signal paths.
 */

import { GenericTelemetry } from './ScingularRuntimeEngine';

export type TelePortFailureMode = 'NONE' | 'TELEMETRY_LOSS' | 'COMMAND_DELAY' | 'DATA_CORRUPTION';

export interface ITelePortHAL {
  connect(): void;
  disconnect(): void;
  sendCommand(command: string, payload: any): Promise<{ success: boolean; ackTimeMs: number }>;
  onTelemetry(callback: (telemetry: GenericTelemetry) => void): () => void;
}

export class MockTelePortHAL implements ITelePortHAL {
  private isConnected = false;
  private telemetrySubscribers: Array<(telemetry: GenericTelemetry) => void> = [];
  private telemetryInterval: NodeJS.Timeout | null = null;
  private failureMode: TelePortFailureMode = 'NONE';
  private currentTelemetry: GenericTelemetry = {
    energyLevel: 100,
    connectionQuality: 100,
    velocity: 0,
    altitudeZ: 0
  };

  private isActiveActuation = false;

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.failureMode = 'NONE';
    this.startHardwareLoop();
  }

  public disconnect(): void {
    this.isConnected = false;
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
  }

  public injectFailure(mode: TelePortFailureMode) {
    this.failureMode = mode;
  }

  public setHardwareActuation(active: boolean) {
    this.isActiveActuation = active;
  }

  public async sendCommand(command: string, payload: any): Promise<{ success: boolean; ackTimeMs: number }> {
    if (!this.isConnected) return { success: false, ackTimeMs: 0 };
    
    let delay = 50 + Math.random() * 50; // Nominal latency
    if (this.failureMode === 'COMMAND_DELAY') delay += 3000;
    if (this.failureMode === 'TELEMETRY_LOSS') return { success: false, ackTimeMs: delay };

    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, ackTimeMs: Math.floor(delay) }), delay);
    });
  }

  public onTelemetry(callback: (telemetry: GenericTelemetry) => void): () => void {
    this.telemetrySubscribers.push(callback);
    return () => {
      this.telemetrySubscribers = this.telemetrySubscribers.filter(sub => sub !== callback);
    };
  }

  private startHardwareLoop() {
    this.telemetryInterval = setInterval(() => {
      if (!this.isConnected) return;
      if (this.failureMode === 'TELEMETRY_LOSS') return; // Silence

      const activeDrain = this.isActiveActuation ? 0.2 : 0.05;
      this.currentTelemetry.energyLevel = Math.max(0, this.currentTelemetry.energyLevel - activeDrain);
      
      this.currentTelemetry.connectionQuality = this.isActiveActuation && this.currentTelemetry.energyLevel < 10 
        ? Math.max(0, this.currentTelemetry.connectionQuality - 1) 
        : this.currentTelemetry.connectionQuality;
      
      this.currentTelemetry.altitudeZ = this.isActiveActuation ? this.currentTelemetry.altitudeZ + (Math.random() * 2 - 0.5) : this.currentTelemetry.altitudeZ;
      this.currentTelemetry.velocity = this.isActiveActuation ? Math.max(0, this.currentTelemetry.velocity + (Math.random() * 0.5 - 0.2)) : this.currentTelemetry.velocity;

      let emittedTelemetry = { ...this.currentTelemetry };

      if (this.failureMode === 'DATA_CORRUPTION') {
        emittedTelemetry.energyLevel = -999;
        emittedTelemetry.velocity = NaN;
      }

      this.telemetrySubscribers.forEach(sub => sub(emittedTelemetry));
    }, 1000);
  }
}
