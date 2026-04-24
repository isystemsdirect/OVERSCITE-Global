'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Layers, RefreshCw, Link2Off, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module SYNC_INTEGRITY_MODULE
 * @authority LARI-SYNC
 * @purpose Discloses synchronization health between cockpit and support surfaces.
 */
export function OverflightSupportSurfaceSyncStatus() {
  const { syncIntegrity, activeSupportWindows } = useLiveFlight();

  if (activeSupportWindows.length === 0) return null;

  const getStatusConfig = () => {
    switch (syncIntegrity) {
      case 'aligned': return { icon: RefreshCw, color: 'text-green-500', label: 'SYNC_ALIGNED', animate: '' };
      case 'lagging': return { icon: Activity, color: 'text-yellow-500', label: 'SYNC_LAGGING', animate: 'animate-pulse' };
      case 'stale': return { icon: Link2Off, color: 'text-red-500', label: 'SYNC_STALE', animate: '' };
      case 'divergent': return { icon: RefreshCw, color: 'text-red-600', label: 'SYNC_DIVERGENT', animate: 'animate-spin' };
      default: return { icon: Layers, color: 'text-white/40', label: 'SYNC_UNKNOWN', animate: '' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="absolute bottom-4 right-4 z-[40] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={cn(
        "bg-black/60 backdrop-blur-xl border px-4 py-2 rounded-lg flex items-center gap-4 transition-all duration-500",
        syncIntegrity === 'aligned' ? "border-green-500/30" : "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
      )}>
        <div className="flex flex-col gap-0.5">
           <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-white/40" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">SURFACE_ARRAY</span>
           </div>
           <div className="flex gap-1">
              {activeSupportWindows.map(id => (
                <div key={id} className="h-1.5 w-4 rounded-sm bg-white/20" title={id} />
              ))}
           </div>
        </div>

        <div className="h-6 w-[1px] bg-white/10" />

        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end gap-0.5">
              <span className={cn("text-[9px] font-black uppercase tracking-widest", config.color)}>
                {config.label}
              </span>
              <span className="text-[7px] font-mono text-white/40 uppercase">
                LATENCY::12MS
              </span>
           </div>
           <Icon className={cn("h-4 w-4", config.color, config.animate)} />
        </div>
      </div>
    </div>
  );
}
