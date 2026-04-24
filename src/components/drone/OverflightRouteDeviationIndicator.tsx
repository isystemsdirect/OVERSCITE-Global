'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Route, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module ROUTE_DEVIATION_INDICATOR
 * @authority LARI-FC
 * @purpose Discloses path deviation and route integrity status.
 */
export function OverflightRouteDeviationIndicator() {
  const { routeIntegrity, missionState } = useLiveFlight();

  if (missionState !== 'in_progress' || routeIntegrity === 'on_path') return null;

  const isMaterial = routeIntegrity === 'material_deviation';

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[40] w-56 animate-in slide-in-from-right-4 duration-700">
      <div className={cn(
        "bg-black/80 backdrop-blur-2xl border-r-4 p-4 rounded-l-lg shadow-2xl flex flex-col gap-3 transition-all duration-500",
        isMaterial ? "border-red-600 bg-red-950/20" : "border-yellow-600 bg-yellow-950/20"
      )}>
        <div className="flex items-center justify-end gap-2 text-right">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            isMaterial ? "text-red-500" : "text-yellow-500"
          )}>
            {isMaterial ? 'MATERIAL_DEVIATION' : 'PATH_DEVIATION'}
          </span>
          <Route className={cn("h-4 w-4", isMaterial ? "text-red-500" : "text-yellow-500")} />
        </div>

        <div className="flex flex-col gap-1.5 text-right">
           <div className="flex items-center justify-between flex-row-reverse">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">VARIANCE</span>
              <span className="text-[9px] font-mono font-black text-white/90">
                {isMaterial ? '> 15.0M' : '4.2M'}
              </span>
           </div>
           <div className="flex items-center justify-between flex-row-reverse">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">VECTOR</span>
              <span className="text-[9px] font-mono font-black text-white/90">042° TRUE</span>
           </div>
        </div>

        <div className="h-[1px] w-full bg-white/10" />

        <div className="flex flex-col gap-2 items-end">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">ADVISORY</span>
              <AlertCircle className="h-3 w-3 text-white/60" />
           </div>
           <span className={cn(
             "text-[9px] font-mono font-bold uppercase tracking-tight",
             isMaterial ? "text-red-400" : "text-yellow-400"
           )}>
             {isMaterial ? 'CORRECT_YAW_IMMEDIATELY' : 'CROSSWIND_COMP_ACTIVE'}
           </span>
        </div>
      </div>
    </div>
  );
}
