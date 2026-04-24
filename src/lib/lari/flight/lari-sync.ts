/**
 * @classification LARI_MULTI_SURFACE_SYNC
 * @engine LARI-SYNC
 * @purpose Multi-Surface Synchronization Engine. Preserves unified state and consistency across OverFLIGHT™ surfaces.
 */

import { HUDSymbologyState } from './lari-hud';

export type SurfaceClassification = 'SOVEREIGN' | 'PROJECTED' | 'DELEGATED';
export type SurfaceAuthorityPosture = 'DISPLAY_ONLY' | 'ADVISORY' | 'DELEGATED_CONTROL' | 'BLOCKED';
export type OperatorRole = 'PILOT' | 'OBSERVER' | 'SUPPORT' | 'SUPERVISOR';

export interface SurfaceSyncState {
  globalHUDState: HUDSymbologyState;
  activeSurfaces: string[];
  surfaceManifest: Record<string, {
    classification: SurfaceClassification;
    authority: SurfaceAuthorityPosture;
    role: OperatorRole;
    lagMs: number;
    integrity: 'ALIGNED' | 'LAGGING' | 'STALE' | 'DIVERGENT';
  }>;
  latencyHealth: 'NOMINAL' | 'DEGRADED' | 'OUT_OF_SYNC';
  timestamp: number;
}

export class LariSyncEngine {
  private activeSurfaces: string[] = [];
  private surfaceManifest: SurfaceSyncState['surfaceManifest'] = {};

  public registerSurface(id: string, classification: SurfaceClassification = 'PROJECTED', role: OperatorRole = 'OBSERVER') {
    if (!this.activeSurfaces.includes(id)) {
      this.activeSurfaces.push(id);
      this.surfaceManifest[id] = {
        classification,
        authority: classification === 'SOVEREIGN' ? 'ADVISORY' : 'DISPLAY_ONLY',
        role,
        lagMs: 0,
        integrity: 'ALIGNED'
      };
    }
  }

  public unregisterSurface(id: string) {
    this.activeSurfaces = this.activeSurfaces.filter(s => s !== id);
    delete this.surfaceManifest[id];
  }

  public updateSurfaceAuthority(id: string, authority: SurfaceAuthorityPosture) {
    if (this.surfaceManifest[id]) {
      this.surfaceManifest[id].authority = authority;
    }
  }

  public generateSyncPayload(hudState: HUDSymbologyState): SurfaceSyncState {
    return {
      globalHUDState: hudState,
      activeSurfaces: this.activeSurfaces,
      surfaceManifest: { ...this.surfaceManifest },
      latencyHealth: 'NOMINAL',
      timestamp: Date.now()
    };
  }
}
