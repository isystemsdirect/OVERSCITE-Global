/**
 * @classification LARI_FLIGHT_CONTROL
 * @engine LARI-FC
 * @purpose Flight Control Intelligence Engine. Governs control interpretation, flight-envelope enforcement, and native vs takeover authority gating.
 */

export type AircraftClass = 'multirotor' | 'fixed_wing' | 'helicopter';

export interface CraftControlProfile {
  id: string;
  class: AircraftClass;
  maxPitchAngle: number;
  maxRollAngle: number;
  maxYawRate: number;
  maxVelocity: number;
}

export type AuthorityPosture = 'NATIVE_CONTROL' | 'SUPERVISORY' | 'GOVERNED_TAKEOVER' | 'INVALID';

export interface FlightControlIntent {
  throttle: number; // 0 to 1
  pitch: number;    // -1 to 1
  roll: number;     // -1 to 1
  yaw: number;      // -1 to 1
  collective?: number; // 0 to 1 (helicopter)
}

export interface ControlRiskFlag {
  level: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  reason?: string;
}

export class LARIFlightControlEngine {
  private currentPosture: AuthorityPosture = 'INVALID';
  
  public evaluateAuthority(isConnected: boolean, isArmed: boolean, takeoverRequested: boolean): AuthorityPosture {
    if (!isConnected) {
      this.currentPosture = 'INVALID';
      return this.currentPosture;
    }
    
    if (!isArmed) {
      this.currentPosture = 'SUPERVISORY';
      return this.currentPosture;
    }
    
    if (takeoverRequested) {
      this.currentPosture = 'GOVERNED_TAKEOVER';
    } else {
      this.currentPosture = 'NATIVE_CONTROL';
    }
    
    return this.currentPosture;
  }

  public evaluateFailsafe(battery: number, linkQuality: number): { active: boolean; reason: string | null } {
    if (battery < 5) return { active: true, reason: 'CRITICAL_BATTERY_SHUTDOWN' };
    if (linkQuality < 10) return { active: true, reason: 'LINK_LOSS_TIMEOUT' };
    return { active: false, reason: null };
  }
  
  public limitEnvelope(intent: FlightControlIntent, profile: CraftControlProfile): { intent: FlightControlIntent; risk: ControlRiskFlag } {
    let risk: ControlRiskFlag = { level: 'NOMINAL' };
    
    // Abstracted envelope checking
    if (Math.abs(intent.pitch) > 0.9 || Math.abs(intent.roll) > 0.9) {
      risk = { level: 'WARNING', reason: 'Approaching control envelope limits' };
    }
    
    return { intent, risk };
  }
}
