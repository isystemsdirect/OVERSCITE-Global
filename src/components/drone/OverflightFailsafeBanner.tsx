'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { AlertOctagon, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module FAILSAFE_BANNER
 * @authority BANE / LARI-FC
 * @purpose Visually dominant failsafe disclosure that constrains the sovereign deck.
 */
export function OverflightFailsafeBanner() {
  const { faultSeverity, consequenceState, blockReason } = useLiveFlight();

  if (faultSeverity !== 'failsafe') return null;

  return (
    <div className="absolute inset-x-0 top-16 bottom-0 bg-purple-950/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center pointer-events-auto">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 max-w-md text-center px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl animate-pulse" />
          <AlertOctagon className="h-20 w-20 text-purple-400 relative z-10" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-purple-200 uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            FAILSAFE_ACTIVE
          </h1>
          <p className="text-xs font-bold text-purple-300/80 tracking-widest uppercase">
            PROTECTIVE POSTURE ENGAGED BY BANE™ INTEGRITY ENGINE
          </p>
        </div>

        <div className="w-full h-[1px] bg-purple-500/30" />

        <div className="flex flex-col gap-4 w-full">
           <div className="bg-black/60 border border-purple-500/40 p-4 rounded flex flex-col gap-2">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">ACTIVE_CONSTRAINTS</span>
              <div className="flex flex-col gap-1.5 items-start">
                 <div className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-purple-400 rounded-full" />
                    <span className="text-[9px] font-mono text-white/70">ALL_COMMANDS::BLOCKED</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-purple-400 rounded-full" />
                    <span className="text-[9px] font-mono text-white/70">AUTONOMOUS_RTH::EXECUTING</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-purple-400 rounded-full" />
                    <span className="text-[9px] font-mono text-white/70">TELEMETRY_LINK::DEGRADED</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-purple-300 uppercase tracking-widest">FAIL_REASON</span>
              <span className="text-xs font-mono font-bold text-white bg-purple-900/50 py-2 rounded">
                 {blockReason || 'UNKNOWN_SYSTEM_FAULT'}
              </span>
           </div>
        </div>

        <div className="flex gap-4 mt-4">
           <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              ACKNOWLEDGE_FAILSAFE
           </button>
        </div>
      </div>
      
      {/* Structural Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
}
