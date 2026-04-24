import { GenericTelemetry } from '../core/ScingularRuntimeEngine';

/**
 * @classification WIRM_DOMAIN_ADAPTER
 * @purpose Translates OS-grade generic telemetry and state into WIRM™ (Wireless Intelligent Robotic Module) specific structures. Focuses on actuation and non-visual hardware control.
 */

export interface WirmActuatorState {
  id: string;
  type: 'SERVO' | 'LINEAR' | 'ROTARY' | 'PNEUMATIC';
  status: 'NOMINAL' | 'STRESSED' | 'FAULT' | 'OFFLINE';
  position: number; // 0 to 100%
  torqueLoad: number; // 0 to 100%
}

export interface WirmDomainState {
  moduleName: string;
  powerDraw: number; // Mapping from GenericTelemetry.energyLevel
  signalStrength: number; // Mapping from GenericTelemetry.connectionQuality
  actuators: WirmActuatorState[];
  kinematicMode: 'IDLE' | 'STABILIZING' | 'ACTIVE_TRAVERSAL' | 'MANIPULATION';
  safetyInterlock: 'ENGAGED' | 'DISENGAGED';
}

export function WirmDomainEvaluator(telemetry: GenericTelemetry): WirmDomainState {
  
  // WIRM interprets altitude and velocity as traversal/manipulation intensity
  const isMoving = telemetry.velocity > 0.5;
  const isStressed = telemetry.velocity > 5.0;

  return {
    moduleName: 'WIRM-DELTA-09',
    powerDraw: 100 - telemetry.energyLevel, // WIRM thinks in draw rather than capacity for its primary logic
    signalStrength: telemetry.connectionQuality,
    kinematicMode: isMoving ? 'ACTIVE_TRAVERSAL' : 'STABILIZING',
    safetyInterlock: telemetry.energyLevel < 10 ? 'ENGAGED' : 'DISENGAGED',
    actuators: [
      {
        id: 'ACT-BASE-YAW',
        type: 'ROTARY',
        status: isStressed ? 'STRESSED' : 'NOMINAL',
        position: 50 + (telemetry.velocity * 2), // Simulate position changes based on velocity
        torqueLoad: isMoving ? 60 : 10
      },
      {
        id: 'ACT-ARM-EXT',
        type: 'LINEAR',
        status: telemetry.energyLevel < 20 ? 'FAULT' : 'NOMINAL',
        position: telemetry.altitudeZ * 10, // Simulate arm extension based on Z altitude
        torqueLoad: telemetry.altitudeZ > 5 ? 80 : 30
      }
    ]
  };
}
