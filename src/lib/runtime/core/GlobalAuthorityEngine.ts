/**
 * @classification SCINGULAR_RUNTIME_CORE
 * @engine GLOBAL_AUTHORITY_ENGINE
 * @purpose Unified authority engine replacing domain-specific flight control authority. Evaluates the triad: OperatorRole + SurfaceClassification + CommandOrigin.
 */

import { OperatorRole, SurfaceClassification, SurfaceAuthorityPosture } from './LariSyncUniversal';

export type SystemActuationPosture = 'NATIVE_CONTROL' | 'SUPERVISORY' | 'GOVERNED_TAKEOVER' | 'INVALID';

export interface CommandTriad {
  role: OperatorRole;
  surfaceClassification: SurfaceClassification;
  surfacePosture: SurfaceAuthorityPosture;
  arcSignature?: string; // Phase 9 ARC identity tracing
}

export class GlobalAuthorityEngine {
  private currentActuationPosture: SystemActuationPosture = 'INVALID';

  public evaluateSystemPosture(isConnected: boolean, isArmedOrActive: boolean, takeoverRequested: boolean): SystemActuationPosture {
    if (!isConnected) {
      this.currentActuationPosture = 'INVALID';
      return this.currentActuationPosture;
    }
    
    if (!isArmedOrActive) {
      this.currentActuationPosture = 'SUPERVISORY';
      return this.currentActuationPosture;
    }
    
    if (takeoverRequested) {
      this.currentActuationPosture = 'GOVERNED_TAKEOVER';
    } else {
      this.currentActuationPosture = 'NATIVE_CONTROL';
    }
    
    return this.currentActuationPosture;
  }

  public validateCommand(triad: CommandTriad, commandType: 'CRITICAL_ACTUATION' | 'MODE_CHANGE' | 'DELEGATION' | 'ROUTINE'): { permitted: boolean; reason: string | null } {
    if (!triad.arcSignature || triad.arcSignature === 'ANONYMOUS_UNAUTHORIZED') {
      return { permitted: false, reason: "BANE-BLOCK: Execution rejected due to missing or invalid ARC Identity signature." };
    }

    if (triad.surfacePosture === 'BLOCKED' || triad.surfacePosture === 'DISPLAY_ONLY') {
      return { permitted: false, reason: `SURFACE_RESTRICTED::${triad.surfacePosture}` };
    }

    if (triad.role === 'OBSERVER') {
      return { permitted: false, reason: 'ROLE_RESTRICTED::OBSERVER' };
    }

    if (commandType === 'CRITICAL_ACTUATION' && triad.role === 'SUPPORT') {
      return { permitted: false, reason: 'ROLE_RESTRICTED::SUPPORT' };
    }

    if (commandType === 'DELEGATION' && triad.role !== 'PILOT' && triad.role !== 'SUPERVISOR') {
      return { permitted: false, reason: 'INSUFFICIENT_PRIVILEGE' };
    }

    if (commandType === 'CRITICAL_ACTUATION' && triad.surfacePosture === 'ADVISORY' && triad.surfaceClassification !== 'SOVEREIGN') {
      // Sovereign surfaces with ADVISORY posture (e.g. cockpit) can execute if roles permit. Projected cannot.
      return { permitted: false, reason: 'SURFACE_RESTRICTED::ADVISORY' };
    }

    return { permitted: true, reason: null };
  }
}
