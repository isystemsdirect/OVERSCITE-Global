'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { 
  Compass, 
  Wind, 
  Cpu,
  Eye,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification FLIGHT_POSTURE_STATE_DISPLAY
 * @authority Pilot
 * @purpose Tactical glass-cockpit instrument for flight truth disclosure (Observed vs Advisory).
 */
export function FlightPostureStateDisplay() {
  const { 
    flightMode, telemetry, authorityPosture, situationalTruth, truthDivergence 
  } = useLiveFlight();

  // Mapping state to display values using LARI engine outputs
  const posture = {
    fc_observed: telemetry.altitude > 1 ? 'AIRBORNE' : 'STABILIZE',
    lari_advisory: situationalTruth?.navigationContext || 'ANALYZING...',
    yaw_drift: telemetry.yawDrift,
    wind_comp: telemetry.windComp,
    vibration: telemetry.vibration,
    imu_sync: telemetry.imuSync,
    authority: authorityPosture,
    confidence: situationalTruth?.confidence.level || 'SCANNING',
    divergence: truthDivergence
  };

  return (
    <div className="flex flex-col gap-2 w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden select-none">
      <div className="bg-primary/5 px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-3 w-3 text-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
          <span className="text-[10px] font-black tracking-widest text-primary uppercase">FLIGHT POSTURE TRUTH</span>
        </div>
        <div className={cn(
          "text-[8px] font-black px-1.5 py-0.5 rounded border tracking-tighter uppercase",
          posture.authority === 'NATIVE_CONTROL' ? "bg-green-500/10 text-green-400 border-green-500/30" :
          posture.authority === 'SUPERVISORY' ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
          "bg-red-500/10 text-red-400 border-red-500/30"
        )}>
          POSTURE::{posture.authority}
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Truth Matrix Cluster */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 opacity-50">
              <Eye className="h-2.5 w-2.5 text-blue-400" />
              <span className="text-[7px] font-black uppercase tracking-widest">OBSERVED_FC</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-2 rounded flex flex-col gap-0.5">
              <span className="text-[11px] font-mono font-black text-white/90">{posture.fc_observed}</span>
              <div className="flex gap-0.5 mt-1">
                <div className="h-0.5 flex-1 bg-blue-500/30 rounded-full" />
                <div className="h-0.5 flex-1 bg-blue-500/10 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 opacity-50">
              <Brain className="h-2.5 w-2.5 text-primary" />
              <span className="text-[7px] font-black uppercase tracking-widest">ADVISORY_LARI</span>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-2 rounded flex flex-col gap-0.5">
              <span className="text-[11px] font-mono font-black text-primary truncate">{posture.lari_advisory}</span>
              <div className="flex items-center justify-between mt-1">
                <span className={cn(
                  "text-[7px] font-black uppercase",
                  posture.confidence === 'HIGH' ? "text-green-500" : "text-yellow-500"
                )}>CONF_LVL::{posture.confidence}</span>
                <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* Truth Divergence Disclosure */}
        <div className={cn(
          "px-2 py-1.5 rounded border transition-all duration-300",
          posture.divergence === 'aligned' ? "bg-white/5 border-white/5" :
          posture.divergence === 'minor_divergence' ? "bg-yellow-500/10 border-yellow-500/30" :
          "bg-red-500/10 border-red-500/30 animate-pulse"
        )}>
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">TRUTH_DIVERGENCE</span>
            <span className={cn(
              "text-[7px] font-black uppercase",
              posture.divergence === 'aligned' ? "text-muted-foreground" :
              posture.divergence === 'minor_divergence' ? "text-yellow-400" : "text-red-400"
            )}>
              {posture.divergence.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Logic Disclosure Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 rounded border border-white/5 relative group">
           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">LOGIC_CORE</span>
           <div className="flex gap-2">
              <span className={cn("text-[9px] font-black transition-all", flightMode === 'MANUAL' ? "text-primary scale-110" : "text-white/10")}>MAN</span>
              <span className={cn("text-[9px] font-black transition-all", flightMode === 'HOLD' ? "text-yellow-500 scale-110" : "text-white/10")}>HLD</span>
              <span className={cn("text-[9px] font-black transition-all", flightMode === 'PLAN' ? "text-blue-500 scale-110" : "text-white/10")}>PLN</span>
           </div>
           {/* Scanline Effect */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </div>

        {/* Dynamic Stability Metrics */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/5 p-1.5 rounded">
              <Compass className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">YAW_DRIFT</span>
              <span className="text-[10px] font-mono font-bold text-white/80">{posture.yaw_drift.toFixed(2)}°</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-white/5 p-1.5 rounded">
              <Wind className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">WIND_COMP</span>
              <span className="text-[10px] font-mono font-bold text-white/80">{posture.wind_comp.toFixed(1)}M/S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
