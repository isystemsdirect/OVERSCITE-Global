'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Home, Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module RETURN_ANCHOR_MODULE
 * @authority Pilot / Failsafe
 * @purpose Discloses home anchor distance and RTH readiness.
 */
export function OverflightReturnAnchorModule() {
  const { missionData, isArmed } = useLiveFlight();

  if (!isArmed || !missionData) return null;

  const { homeAnchor } = missionData;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-[280px] z-[40]">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-lg flex items-center gap-4 shadow-2xl">
         <div className="bg-primary/20 p-2 rounded-full border border-primary/30">
            <Home className="h-3 w-3 text-primary" />
         </div>

         <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
               <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">HOME_ANCHOR</span>
               <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex items-baseline gap-1">
               <span className="text-sm font-mono font-black text-white/90">
                 {homeAnchor.distance.toFixed(0)}
               </span>
               <span className="text-[8px] font-black text-white/40 uppercase">METERS</span>
            </div>
         </div>

         <div className="h-8 w-[1px] bg-white/10" />

         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
               <Anchor className="h-2 w-2 text-white/60" />
               <span className="text-[7px] font-black text-white/60 uppercase tracking-widest">RTH_LINK</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-green-500/80">STABLE</span>
         </div>
      </div>
    </div>
  );
}
