'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { MapPin, Navigation2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module WAYPOINT_PROGRESS_MODULE
 * @authority Pilot
 * @purpose Discloses active waypoint details, distance, and time-to-arrival.
 */
export function OverflightWaypointProgressModule() {
  const { missionData, missionState } = useLiveFlight();

  if (missionState !== 'in_progress' || !missionData) return null;

  const currentWP = missionData.waypoints[missionData.currentWaypointIndex];
  if (!currentWP) return null;

  const totalWPs = missionData.waypoints.length;
  const progressPercent = ((missionData.currentWaypointIndex + 1) / totalWPs) * 100;

  return (
    <div className="absolute top-4 right-1/2 translate-x-[220px] z-[40] flex flex-col gap-2 w-48">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-1.5">
              <MapPin className="h-2.5 w-2.5 text-primary" />
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">WAYPOINT_ACTIVE</span>
           </div>
           <span className="text-[8px] font-mono font-black text-white/40">
             {missionData.currentWaypointIndex + 1}/{totalWPs}
           </span>
        </div>

        <div className="p-3 flex flex-col gap-3">
           <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                {currentWP.name}
              </span>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary transition-all duration-1000" 
                   style={{ width: `${progressPercent}%` }}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1 opacity-50">
                    <Navigation2 className="h-2 w-2" />
                    <span className="text-[6px] font-bold uppercase tracking-widest">DISTANCE</span>
                 </div>
                 <span className="text-[10px] font-mono font-black text-white/90">
                    {currentWP.distance.toFixed(0)}M
                 </span>
              </div>
              <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1 opacity-50">
                    <Clock className="h-2 w-2" />
                    <span className="text-[6px] font-bold uppercase tracking-widest">ARRIVAL</span>
                 </div>
                 <span className="text-[10px] font-mono font-black text-primary">
                    T-{currentWP.eta}S
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-md flex items-center justify-between">
         <span className="text-[7px] font-black text-primary/80 uppercase tracking-widest">PATH_RESOLUTION</span>
         <span className="text-[7px] font-mono font-bold text-primary">STRATUM-A</span>
      </div>
    </div>
  );
}
