'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { AlertTriangle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module ZONE_RESTRICTION_DISCLOSURE
 * @authority BANE / Governance
 * @purpose Discloses restricted zone intersections and policy violations.
 */
export function OverflightZoneRestrictionDisclosure() {
  const { zoneContext } = useLiveFlight();

  const isRestrictedNear = zoneContext === 'restricted_zone_near';
  const isRestrictedEntered = zoneContext === 'restricted_zone_entered';

  if (!isRestrictedNear && !isRestrictedEntered) return null;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-[40] w-56 animate-in slide-in-from-left-4 duration-700">
      <div className={cn(
        "bg-black/80 backdrop-blur-2xl border-l-4 p-4 rounded-r-lg shadow-2xl flex flex-col gap-3 transition-all duration-500",
        isRestrictedEntered ? "border-red-600 bg-red-950/20" : "border-yellow-600 bg-yellow-950/20"
      )}>
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn("h-4 w-4", isRestrictedEntered ? "text-red-500" : "text-yellow-500")} />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            isRestrictedEntered ? "text-red-500" : "text-yellow-500"
          )}>
            {isRestrictedEntered ? 'RESTRICTED_PENETRATION' : 'RESTRICTED_PROXIMITY'}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
           <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">ZONE_ID</span>
              <span className="text-[9px] font-mono font-black text-white/90">NFZ-7712-B</span>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">POLICY</span>
              <span className="text-[9px] font-mono font-black text-white/90">BANE::HARD_ENFORCEMENT</span>
           </div>
        </div>

        <div className="h-[1px] w-full bg-white/10" />

        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-white/60" />
              <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">ACTIVE_CONSTRAINTS</span>
           </div>
           <div className="flex flex-wrap gap-1">
              {['NO_LOITER', 'ALT_LIMIT', isRestrictedEntered ? 'REVERSE_THRUST_COMMANDED' : 'VECTOR_CORRECTION_SUGGESTED'].map(tag => (
                <span key={tag} className={cn(
                  "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest",
                  isRestrictedEntered ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                )}>
                  {tag}
                </span>
              ))}
           </div>
        </div>

        {isRestrictedEntered && (
          <div className="mt-1 animate-pulse bg-red-600/20 border border-red-500/50 p-2 rounded text-center">
             <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">
               IMMEDIATE_EXIT_REQUIRED
             </span>
          </div>
        )}
      </div>
    </div>
  );
}
