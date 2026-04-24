'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Badge } from '@/components/ui/badge';
import { Plane, Shield, Zap, Map as MapIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification FLIGHT_MODE_STRIP
 * @purpose Thin flight identity strip replacing the standard PageHeader.
 */
export function FlightModeStrip() {
  const { flightMode, isArmed, safeStateVerified } = useLiveFlight();

  return (
    <div className="h-10 w-full flex items-center justify-between px-4 bg-black/60 border-b border-white/10 backdrop-blur-md shrink-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Plane className={cn("h-4 w-4", isArmed ? "text-red-500" : "text-primary")} />
          <span className="text-[11px] font-black tracking-widest text-white/90">LIVE FLIGHT</span>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={cn(
              "h-5 text-[9px] font-mono px-1.5",
              isArmed ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-white/20 text-muted-foreground"
            )}
          >
            {isArmed ? 'ARMED' : 'DISARMED'}
          </Badge>

          <Badge 
            variant="outline" 
            className={cn(
              "h-5 text-[9px] font-mono px-1.5 capitalize",
              flightMode === 'PLAN' ? "border-blue-500/50 bg-blue-500/10 text-blue-400" : 
              flightMode === 'HOLD' ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" :
              "border-white/20 text-muted-foreground"
            )}
          >
            {flightMode}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className={cn("h-3 w-3", safeStateVerified ? "text-green-500" : "text-red-500")} />
            SAFE-STATE: {safeStateVerified ? 'VERIFIED' : 'INVALID'}
          </span>
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-primary" />
            TELEMETRY: SYNC
          </span>
        </div>
      </div>
    </div>
  );
}
