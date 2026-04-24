'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { 
  Plane, 
  Battery, 
  Navigation, 
  ArrowUp, 
  SignalMedium,
  Satellite,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification PILOT_INSTRUMENTATION_STRIP
 * @authority Pilot
 * @purpose High-density tactical HUD-overlay for sovereign OverFLIGHT™ panels.
 */
export function PilotInstrumentationStrip() {
  const { 
    flightMode, isArmed, isConnected, safeStateVerified, hudState, 
    activeSupportWindows, faultSeverity, telemetryFreshness 
  } = useLiveFlight();

  const telemetry = hudState?.observed.rawTelemetry || {
    battery: 0, linkQuality: 0, satellites: 0, altitude: 0, velocity: 0
  };
  const priority = hudState?.priority || { primary: [], secondary: [], hidden: [] };

  const severityColor = {
    advisory: "from-black/90",
    caution: "from-yellow-950/90 shadow-[0_0_30px_rgba(234,179,8,0.1)]",
    critical: "from-red-950/90 shadow-[0_0_50px_rgba(239,68,68,0.2)]",
    failsafe: "from-purple-950/90 shadow-[0_0_60px_rgba(168,85,247,0.3)]"
  }[faultSeverity];

  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-gradient-to-b via-black/40 to-transparent pointer-events-none z-50 transition-all duration-500",
      severityColor
    )}>
      
      {/* ─── Left Group: Flight Identity & Link ─── */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Plane className={cn("h-3.5 w-3.5", isArmed ? "text-red-500 animate-pulse" : "text-primary")} />
            <span className="text-[10px] font-black tracking-[0.3em] text-white">OVR-A1</span>
          </div>
          <span className="text-[7px] font-bold text-muted-foreground tracking-[0.2em] mt-1 uppercase">XSCITE™ TRACE::LARI_FC</span>
        </div>
        
        <div className="h-8 w-[1px] bg-white/10" />
        
        <div className="flex flex-col gap-1">
          <span className={cn(
            "text-[10px] font-black tracking-widest uppercase",
            !isConnected ? "text-red-600" : isArmed ? "text-red-500" : "text-primary"
          )}>
            {!isConnected ? 'LINK_LOST' : isArmed ? 'ARMED_FLIGHT' : 'GROUND_IDLE'}
          </span>
          <div className="flex gap-1">
            <div className={cn("h-1 w-5 rounded-full transition-all duration-300", isConnected ? "bg-primary" : "bg-white/10")} />
            <div className={cn("h-1 w-5 rounded-full transition-all duration-300", isArmed ? "bg-red-500 shadow-[0_0_8px_red]" : "bg-white/10")} />
          </div>
        </div>
      </div>

      {/* ─── Center Group: Tactical HUD Cluster ─── */}
      <div className="flex items-center gap-12 pointer-events-auto translate-y-1">
        {/* Power Status */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <Battery className={cn(
              "h-4 w-4", 
              telemetry.battery < 30 ? "text-red-500" : "text-green-500/80",
              priority.primary.includes('battery') && telemetry.battery < 30 ? "animate-pulse" : ""
            )} />
            <span className={cn(
              "text-xs font-mono font-black text-white leading-none",
              priority.primary.includes('battery') && "text-red-500"
            )}>{Math.round(telemetry.battery)}%</span>
          </div>
          <div className="w-14 h-[2px] bg-white/10 rounded-full overflow-hidden">
             <div 
               className={cn("h-full transition-all duration-500", telemetry.battery < 30 ? "bg-red-500" : "bg-green-500")} 
               style={{ width: `${telemetry.battery}%` }}
             />
          </div>
        </div>

        {/* Altitude - Prime Instrument */}
        <div className="flex flex-col items-center group">
          <div className="flex items-baseline gap-1.5">
            <span className={cn(
              "text-3xl font-mono font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]",
              priority.primary.includes('altitude') && "text-blue-400"
            )}>
              {telemetry.altitude.toFixed(1)}
            </span>
            <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">M</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <ArrowUp className="h-2 w-2 text-primary" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">ALT_AGL</span>
          </div>
        </div>

        {/* Velocity - Prime Instrument */}
        <div className="flex flex-col items-center group">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {telemetry.velocity.toFixed(1)}
            </span>
            <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">M/S</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <Navigation className="h-2 w-2 text-primary rotate-90" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">G_SPEED</span>
          </div>
        </div>

        {/* COMMS/NAV Mini-Cluster */}
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <SignalMedium className={cn("h-3.5 w-3.5", telemetry.linkQuality < 50 ? "text-red-500" : "text-primary")} />
              <span className="text-[10px] font-mono font-bold text-white/80">{telemetry.linkQuality}%</span>
           </div>
           <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <Satellite className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[10px] font-mono font-bold text-white/80">{telemetry.satellites}</span>
           </div>
        </div>

        {/* Telemetry Freshness Indicator */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-80">
          <div className={cn(
            "h-1 w-1 rounded-full",
            telemetryFreshness === 'live' ? "bg-green-500 shadow-[0_0_5px_green]" : 
            telemetryFreshness === 'stale' ? "bg-red-500 animate-pulse" : "bg-yellow-500"
          )} />
          <span className={cn(
            "text-[7px] font-black tracking-[0.4em] uppercase transition-colors duration-300",
            telemetryFreshness === 'live' ? "text-green-500" : 
            telemetryFreshness === 'stale' ? "text-red-500" : "text-yellow-500"
          )}>
            DATA_{telemetryFreshness}
          </span>
        </div>
      </div>

      {/* ─── Right Group: BANE Integrity & Topology ─── */}
      <div className="flex items-center gap-8 pointer-events-auto">
        {activeSupportWindows.length > 0 && (
          <div className="flex flex-col items-end gap-1 px-3 py-1 bg-primary/10 border border-primary/30 rounded shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
            <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-primary" />
              <span className="text-[9px] font-black text-primary tracking-widest uppercase">TOPOLOGY_LVL::{activeSupportWindows.length}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2.5">
             <span className={cn(
               "text-[10px] font-black tracking-widest uppercase",
               !isConnected ? "text-red-700" : safeStateVerified ? "text-green-500" : "text-red-500"
             )}>
               {!isConnected ? 'SYS_OFFLINE' : safeStateVerified ? 'ENVELOPE_SAFE' : 'BANE_LOCK'}
             </span>
             <div className={cn(
               "h-2.5 w-2.5 rounded-full",
               !isConnected ? "bg-red-900" :
               safeStateVerified ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" : "bg-red-500 shadow-[0_0_10px_red]"
             )} />
          </div>
          <span className="text-[7px] font-bold text-muted-foreground tracking-[0.2em] uppercase">BANE™ INTEGRITY ENGINE</span>
        </div>
      </div>
    </div>
  );
}
