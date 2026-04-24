/**
 * @classification WINDOW_ORCHESTRATOR_HOOK
 * @authority Pilot
 * @phase Phase 3wc
 */

import { useCallback } from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { 
  WindowLifecycleManager, 
  WindowOrchestrationContract, 
  WINDOW_CONFIGS 
} from './window-orchestration';

export function useWindowOrchestrator() {
  const { trackWindow } = useLiveFlight();

  const launchSupportSurface = useCallback((id: string, label: string, path: string) => {
    const config = WINDOW_CONFIGS[id] || {};
    const contract: WindowOrchestrationContract = {
      id,
      title: label,
      target: 'adjacent_right', // Default for P3wc
      path,
      ...config
    };

    const win = WindowLifecycleManager.launch(contract);
    
    if (win) {
      trackWindow(id, true);
      
      // Monitor for closure
      const timer = setInterval(() => {
        if (win.closed) {
          trackWindow(id, false);
          clearInterval(timer);
        }
      }, 1000);
    }
  }, [trackWindow]);

  return {
    launchSupportSurface,
    closeAllSurfaces: WindowLifecycleManager.closeAll
  };
}
