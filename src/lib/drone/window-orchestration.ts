/**
 * @classification WINDOW_ORCHESTRATION_CONTRACT
 * @authority Director
 * @phase Phase 3wc
 */

export type WindowTarget = 
  | 'adjacent_left' 
  | 'adjacent_right' 
  | 'overlay_panel' 
  | 'detached_window';

export interface WindowOrchestrationContract {
  id: string;
  title: string;
  target: WindowTarget;
  path: string;
  width?: number;
  height?: number;
  features?: string;
}

export const WINDOW_CONFIGS: Record<string, Partial<WindowOrchestrationContract>> = {
  map: {
    width: 800,
    height: 600,
    features: "menubar=no,toolbar=no,location=no,status=no",
  },
  mission: {
    width: 600,
    height: 800,
    features: "menubar=no,toolbar=no,location=no,status=no",
  },
  telemetry: {
    width: 500,
    height: 900,
    features: "menubar=no,toolbar=no,location=no,status=no",
  },
  repo: {
    width: 1000,
    height: 700,
    features: "menubar=no,toolbar=no,location=no,status=no",
  },
  advisory: {
    width: 450,
    height: 600,
    features: "menubar=no,toolbar=no,location=no,status=no",
  },
};

/**
 * @classification WINDOW_LIFECYCLE_MANAGER
 */
export class WindowLifecycleManager {
  private static activeWindows: Map<string, Window> = new Map();

  static launch(contract: WindowOrchestrationContract): Window | null {
    const { id, path, width = 600, height = 800, features = "" } = contract;
    
    // Check if window already exists and is not closed
    const existing = this.activeWindows.get(id);
    if (existing && !existing.closed) {
      existing.focus();
      return existing;
    }

    const windowFeatures = `width=${width},height=${height},${features}`;
    const newWindow = window.open(path, `SCINGULAR_${id}`, windowFeatures);
    
    if (newWindow) {
      this.activeWindows.set(id, newWindow);
    }

    return newWindow;
  }

  static closeAll() {
    this.activeWindows.forEach((win) => {
      if (!win.closed) win.close();
    });
    this.activeWindows.clear();
  }
}
