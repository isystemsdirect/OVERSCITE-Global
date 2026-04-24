'use client';
import React, { useState } from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Monitor, ExternalLink, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_DISTRIBUTION
 * @module TELEPORT_WINDOW_MANAGER
 * @authority Pilot / Supervisor
 * @purpose Spawns and manages distributed flight surfaces (simulated as portal windows).
 */
export function OverflightTelePortModule() {
  const { trackWindow, activeSupportWindows } = useLiveFlight();

  const surfaces = [
    { id: 'ext_telemetry_01', label: 'TELEMETRY_RAIL', type: 'projected' },
    { id: 'ext_mission_01', label: 'MISSION_POSTURE', type: 'projected' },
    { id: 'map_surface_01', label: 'TACTICAL_MAP', type: 'map' },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-black tracking-widest text-primary">TELEPORT_WINDOW_MGMT</span>
      <div className="flex flex-col gap-1">
        {surfaces.map((s) => {
          const isActive = activeSupportWindows.includes(s.id);
          
          return (
            <button
              id={`stress-teleport-${s.id}`}
              key={s.id}
              onClick={() => trackWindow(s.id, !isActive)}
              className={cn(
                "flex items-center justify-between px-3 py-2 border rounded transition-all",
                isActive 
                  ? "bg-primary/20 border-primary/40 text-primary" 
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-2">
                <Monitor className="h-3 w-3" />
                <span className="text-[8px] font-black tracking-widest">{s.label}</span>
              </div>
              {isActive ? <X className="h-2 w-2" /> : <Plus className="h-2 w-2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
