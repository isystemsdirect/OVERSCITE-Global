'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Map as MapIcon, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OverflightSurfaceAuthorityLabel } from './OverflightSurfaceAuthorityLabel';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module SYNCHRONIZED_MAP_BRIDGE
 * @authority LARI-SYNC
 * @purpose Provides a synchronized map surface placeholder that remains subordinate to the cockpit.
 */
export function OverflightSynchronizedMapBridge() {
  const { activeSupportWindows, syncIntegrity } = useLiveFlight();
  
  const isMapActive = activeSupportWindows.includes('map_surface_01');

  if (!isMapActive) return null;

  return (
    <div className={cn(
      "fixed top-24 right-4 z-[30] w-[400px] h-[300px] transition-all duration-1000 animate-in zoom-in-95 fade-in",
      syncIntegrity === 'stale' && "opacity-40 grayscale blur-[2px]"
    )}>
      <OverflightSurfaceAuthorityLabel surfaceId="map_surface_01" />
      
      <div className="w-full h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <MapIcon className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">MAP_SURFACE_01</span>
           </div>
           <div className="flex items-center gap-4">
              <span className={cn(
                "text-[8px] font-mono font-bold",
                syncIntegrity === 'aligned' ? "text-green-500" : "text-red-400"
              )}>
                {syncIntegrity.toUpperCase()}
              </span>
              <Maximize2 className="h-3 w-3 text-white/40 cursor-not-allowed" />
           </div>
        </div>

        <div className="flex-1 relative bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-122.4194,37.7749,12,0/400x300?access_token=pk.placeholder')] bg-cover bg-center">
           {/* Overlay Grid */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           {/* Center Crosshair */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                 <div className="absolute -inset-4 border border-primary/40 rounded-full animate-ping" />
                 <Navigation2Icon className="h-4 w-4 text-primary fill-primary rotate-[45deg]" />
              </div>
           </div>

           {/* Coordinates */}
           <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded border border-white/10">
              <span className="text-[8px] font-mono text-white/60">37.7749° N, 122.4194° W</span>
           </div>
        </div>

        {syncIntegrity !== 'aligned' && (
          <div className="absolute inset-0 bg-red-950/10 flex items-center justify-center backdrop-blur-[1px]">
             <div className="bg-black/80 border border-red-500/50 px-4 py-2 rounded-lg flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">SYNC_FAILURE</span>
                <span className="text-[8px] font-mono text-white/60">RETRYING_CONNECTION...</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Navigation2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 19 21 12 17 5 21 12 2" />
    </svg>
  );
}
