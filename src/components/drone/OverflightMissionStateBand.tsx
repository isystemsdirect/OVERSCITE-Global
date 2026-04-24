'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Flag, Play, Pause, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module MISSION_STATE_BAND
 * @authority Pilot / Mission Control
 * @purpose Discloses the current mission lifecycle state (loaded, staged, active, etc.)
 */
export function OverflightMissionStateBand() {
  const { missionState, missionData } = useLiveFlight();

  if (missionState === 'not_loaded') return null;

  const getStatusConfig = () => {
    switch (missionState) {
      case 'loaded': return { icon: Loader2, color: 'text-blue-400', label: 'MISSION_LOADED', animate: 'animate-spin' };
      case 'staged': return { icon: Flag, color: 'text-primary', label: 'READY_TO_LAUNCH', animate: '' };
      case 'in_progress': return { icon: Play, color: 'text-green-500', label: 'MISSION_ACTIVE', animate: 'animate-pulse' };
      case 'holding': return { icon: Pause, color: 'text-yellow-500', label: 'MISSION_HOLD', animate: '' };
      case 'restricted': return { icon: XCircle, color: 'text-red-500', label: 'MISSION_RESTRICTED', animate: '' };
      case 'abort_pending': return { icon: Loader2, color: 'text-red-400', label: 'ABORT_PENDING', animate: 'animate-spin' };
      case 'aborted': return { icon: XCircle, color: 'text-red-600', label: 'MISSION_ABORTED', animate: '' };
      case 'completed': return { icon: CheckCircle2, color: 'text-green-400', label: 'MISSION_COMPLETE', animate: '' };
      default: return { icon: Flag, color: 'text-white/40', label: 'UNKNOWN_STATE', animate: '' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[40] flex flex-col items-center gap-1 group">
      <div className={cn(
        "bg-black/60 backdrop-blur-xl border px-6 py-2 rounded-full flex items-center gap-4 transition-all duration-500",
        missionState === 'in_progress' ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]" :
        missionState === 'staged' ? "border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" :
        "border-white/10"
      )}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3 w-3", config.color, config.animate)} />
          <span className={cn("text-[10px] font-black tracking-[0.3em] uppercase", config.color)}>
            {config.label}
          </span>
        </div>
        
        {missionData && (
          <>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-widest">
              ID::{missionData.id}
            </span>
          </>
        )}
      </div>

      {missionState === 'in_progress' && (
        <div className="text-[7px] font-black text-green-500/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          LARI-FC::WAYPOINT_POSTURE_ENFORCED
        </div>
      )}
    </div>
  );
}
