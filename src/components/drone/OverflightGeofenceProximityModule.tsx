'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { ShieldAlert, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module GEOFENCE_PROXIMITY_MODULE
 * @authority BANE / LARI-FC
 * @purpose Discloses geofence proximity and approach warnings.
 */
export function OverflightGeofenceProximityModule() {
  const { zoneContext } = useLiveFlight();

  if (zoneContext === 'clear') return null;

  const isInside = zoneContext === 'inside_boundary' || zoneContext === 'restricted_zone_entered';
  const isApproaching = zoneContext === 'approaching_boundary' || zoneContext === 'restricted_zone_near';

  return (
    <div className="absolute top-4 right-4 z-[40] animate-in slide-in-from-right-4 duration-500">
      <div className={cn(
        "bg-black/60 backdrop-blur-xl border p-3 rounded-lg flex flex-col gap-2 min-w-[160px] shadow-2xl transition-colors duration-500",
        isInside ? "border-red-500/50" : "border-yellow-500/50"
      )}>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1.5">
              {isInside ? <ShieldAlert className="h-3 w-3 text-red-500 animate-pulse" /> : <Shield className="h-3 w-3 text-yellow-500" />}
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                isInside ? "text-red-500" : "text-yellow-500"
              )}>
                {isInside ? 'ZONE_INTRUSION' : 'ZONE_PROXIMITY'}
              </span>
           </div>
           <div className={cn(
             "h-1.5 w-1.5 rounded-full",
             isInside ? "bg-red-500 shadow-[0_0_5px_red]" : "bg-yellow-500 shadow-[0_0_5px_yellow]"
           )} />
        </div>

        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-mono font-bold text-white/90">
             {zoneContext.replace('_', ' ').toUpperCase()}
           </span>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={cn(
                "h-full transition-all duration-300",
                isInside ? "w-full bg-red-500" : "w-2/3 bg-yellow-500 animate-pulse"
              )} />
           </div>
        </div>

        <div className="flex items-center justify-between mt-1">
           <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">ENFORCEMENT</span>
           <span className={cn(
             "text-[7px] font-mono font-bold",
             isInside ? "text-red-400" : "text-yellow-400"
           )}>
             {isInside ? 'ACTIVE_BLOCK' : 'ADVISORY_ONLY'}
           </span>
        </div>
      </div>
    </div>
  );
}
