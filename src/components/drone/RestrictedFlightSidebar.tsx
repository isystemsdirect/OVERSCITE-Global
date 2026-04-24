'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { 
  Map as MapIcon, 
  Target, 
  Activity, 
  Database, 
  AlertTriangle, 
  MessageSquare, 
  Users,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useOverFLIGHTDisplay } from '@/lib/drone/useOverFLIGHTDisplay';

/**
 * @classification WINDOW_LAUNCH_CONTRACT
 */
interface LauncherItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const LAUNCHERS: LauncherItem[] = [
  { id: 'map', label: 'Map', icon: <MapIcon className="h-4 w-4" />, path: '/drone-vision/map' },
  { id: 'mission', label: 'Mission', icon: <Target className="h-4 w-4" />, path: '/drone-vision/mission' },
  { id: 'telemetry', label: 'Telemetry', icon: <Activity className="h-4 w-4" />, path: '/drone-vision/telemetry' },
  { id: 'repo', label: 'REPO', icon: <Database className="h-4 w-4" />, path: '/overhud/repo' },
  { id: 'advisory', label: 'Flight Advisory', icon: <AlertTriangle className="h-4 w-4" />, path: '/drone-vision/advisory' },
];

/**
 * @classification RESTRICTED_SIDEBAR
 * @purpose Mode-aware sidebar for launching support windows.
 */
export function RestrictedFlightSidebar() {
  const { flightMode, isArmed, safeStateVerified } = useLiveFlight();
  const { routeSupportSurface } = useOverFLIGHTDisplay();

  const handleLaunch = (item: LauncherItem) => {
    routeSupportSurface(item.id, item.label, item.path);
  };

  // Only show restricted sidebar if ARMED and (PLAN or HOLD or DISARMED)
  // The UTCB says: "DISARMED extended-sidebar prep posture", "ARMED collapsed pilot posture"
  // "ARMED + active plan execution restricted-sidebar mode"
  
  const isVisible = flightMode !== 'ARMED' || (flightMode === 'ARMED' && (safeStateVerified));

  if (!isVisible && isArmed) return null;

  return (
    <div className={cn(
      "w-12 h-full flex flex-col items-center py-4 bg-black/40 border-r border-white/10 backdrop-blur-xl shrink-0 z-40 transition-all duration-300",
      !isArmed && "w-14"
    )}>
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col gap-4">
          {LAUNCHERS.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-lg hover:bg-primary/20 hover:text-primary transition-all",
                    "text-muted-foreground"
                  )}
                  onClick={() => handleLaunch(item)}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-black border-white/20 text-white text-[10px]">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="mt-auto pb-2">
         <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
  );
}
