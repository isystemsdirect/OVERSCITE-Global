/**
 * @classification OVERFLIGHT_SPATIAL_PROTOCOL
 * @authority Director
 * @phase Phase 4wc
 */

export type DisplayTarget = 
  | 'primary' 
  | 'secondary_01' 
  | 'secondary_02' 
  | 'external_hd' 
  | 'overlay';

export type SurfaceType = 
  | 'prime_surface' 
  | 'instrument_surface' 
  | 'map_surface' 
  | 'repo_surface' 
  | 'analysis_surface';

export interface SurfaceRoutingRule {
  type: SurfaceType;
  preferredTarget: DisplayTarget;
  width: number;
  height: number;
  features?: string;
}

export const ROUTING_RULES: Record<string, SurfaceRoutingRule> = {
  map: {
    type: 'map_surface',
    preferredTarget: 'secondary_01',
    width: 800,
    height: 600,
  },
  telemetry: {
    type: 'instrument_surface',
    preferredTarget: 'secondary_02',
    width: 500,
    height: 900,
  },
  mission: {
    type: 'analysis_surface',
    preferredTarget: 'secondary_01',
    width: 600,
    height: 800,
  },
  repo: {
    type: 'repo_surface',
    preferredTarget: 'external_hd',
    width: 1200,
    height: 800,
  },
};

/**
 * @classification DISPLAY_TOPOLOGY_MANAGER
 */
export class DisplayTopologyManager {
  static getCalculatedPosition(target: DisplayTarget): { top: number; left: number } {
    // Deterministic offset logic for single-screen fallback or multi-screen simulation
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    switch (target) {
      case 'secondary_01':
        return { top: 100, left: screenWidth > 1920 ? 1921 : screenWidth - 400 };
      case 'secondary_02':
        return { top: 100, left: screenWidth > 1920 ? 1921 + 801 : screenWidth - 200 };
      case 'external_hd':
        return { top: 0, left: 0 }; // Usually a full-screen external display
      default:
        return { top: 200, left: 200 };
    }
  }
}

/**
 * @classification OVERFLIGHT_DISPLAY_MANAGER
 */
export class OverFLIGHTDisplayManager {
  private static registry: Map<string, Window> = new Map();

  static routeSurface(id: string, title: string, path: string): Window | null {
    const rule = ROUTING_RULES[id];
    if (!rule) return null;

    const { top, left } = DisplayTopologyManager.getCalculatedPosition(rule.preferredTarget);
    const { width, height, features = "menubar=no,toolbar=no,location=no" } = rule;

    // Check if surface already exists
    const existing = this.registry.get(id);
    if (existing && !existing.closed) {
      existing.focus();
      return existing;
    }

    const windowFeatures = `width=${width},height=${height},top=${top},left=${left},${features}`;
    const newWindow = window.open(path, `overflight_${id}`, windowFeatures);

    if (newWindow) {
      this.registry.set(id, newWindow);
    }

    return newWindow;
  }

  static broadcast(command: string, payload: any) {
    this.registry.forEach((win, id) => {
      if (!win.closed) {
        win.postMessage({ type: 'OVERFLIGHT_INTERACTION', command, payload }, window.location.origin);
      } else {
        this.registry.delete(id);
      }
    });
  }

  static closeAll() {
    this.registry.forEach(win => {
      if (!win.closed) win.close();
    });
    this.registry.clear();
  }
}
