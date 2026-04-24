/**
 * @classification SCINGULAR_DOMAIN_ADAPTER
 * @domain FLIGHT
 * @purpose Maps generic ScingularRuntime OS telemetry into Drone-specific flight data. Orchestrates LARI-AWARE and LARI-HUD.
 */

import { GenericTelemetry } from '../core/ScingularRuntimeEngine';
import { LariawareEngine, ObservedFlightState, SituationalTruthState } from '../../lari/flight/lari-aware';
import { LariHUDEngine, HUDSymbologyState } from '../../lari/flight/lari-hud';
import { TelemetryData } from '../../../context/LiveFlightContext';

export interface FlightDomainState {
  droneTelemetry: TelemetryData;
  situationalTruth: SituationalTruthState | null;
  hudSymbology: HUDSymbologyState | null;
}

export class FlightDomainAdapter {
  private awareEngine = new LariawareEngine();
  private hudEngine = new LariHUDEngine();

  public evaluate(genericTelemetry: GenericTelemetry): FlightDomainState {
    // 1. Map Generic -> Drone Telemetry
    const droneTelemetry: TelemetryData = {
      battery: genericTelemetry.energyLevel,
      linkQuality: genericTelemetry.connectionQuality,
      satellites: 18, // Simulated for now
      altitude: genericTelemetry.altitudeZ,
      velocity: genericTelemetry.velocity,
      vibration: 'NOMINAL',
      yawDrift: genericTelemetry.yawDrift || 0,
      windComp: genericTelemetry.windComp || 0,
      imuSync: '100%'
    };

    // 2. Generate Truth (AWARE)
    const observed: ObservedFlightState = { rawTelemetry: droneTelemetry, timestamp: Date.now() };
    const truth = this.awareEngine.evaluateTruth(observed);

    // 3. Resolve Display (HUD)
    const hud = this.hudEngine.resolveDisplay(observed, truth);

    return {
      droneTelemetry,
      situationalTruth: truth,
      hudSymbology: hud
    };
  }
}
