/**
 * @classification OVERFLIGHT_DISPLAY_MANAGER_HOOK
 * @authority Pilot
 * @phase Phase 4wc
 */

import { useCallback } from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { 
  OverFLIGHTDisplayManager, 
  ROUTING_RULES 
} from './overflight-spatial';

export function useOverFLIGHTDisplay() {
  const { trackWindow, routeSurface } = useLiveFlight();

  const routeSupportSurface = useCallback((id: string, label: string, path: string) => {
    const rule = ROUTING_RULES[id];
    if (!rule) return;

    // Execute routing via the spatial manager
    const win = OverFLIGHTDisplayManager.routeSurface(id, label, path);
    
    if (win) {
      // Sync state back to context
      routeSurface(id, path);
      trackWindow(id, true);
      
      // Monitor for closure
      const timer = setInterval(() => {
        if (win.closed) {
          trackWindow(id, false);
          clearInterval(timer);
        }
      }, 1000);
    }
  }, [trackWindow, routeSurface]);

  const broadcastInteraction = useCallback((command: string, payload: any) => {
    OverFLIGHTDisplayManager.broadcast(command, payload);
  }, []);

  return {
    routeSupportSurface,
    broadcastInteraction,
    clearSpatialDistribution: OverFLIGHTDisplayManager.closeAll
  };
}
