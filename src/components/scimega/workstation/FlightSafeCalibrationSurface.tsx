"use client";

import React from 'react';
import { Activity, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { SCIMEGAWorkstationModule } from '@/lib/scimega/workstation/scimega-workstation-types';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Flight-Safe Calibration Surface
 * @purpose Display restricted diagnostic/calibration modules during active flight.
 */

interface FlightSafeCalibrationSurfaceProps {
  activeModule: SCIMEGAWorkstationModule;
  onModuleChange: (moduleId: string) => void;
  availableModules: SCIMEGAWorkstationModule[];
  pilotAuthority: string;
  baneStatus: string;
  teonStatus: string;
}

export function FlightSafeCalibrationSurface({
  activeModule,
  onModuleChange,
  availableModules,
  pilotAuthority,
  baneStatus,
  teonStatus
}: FlightSafeCalibrationSurfaceProps) {
  return (
    <div className="flex flex-col h-full gap-6">
      {/* Flight Info Header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-400">
            <UserCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pilot Authority</span>
          </div>
          <span className="text-sm font-black text-white">{pilotAuthority}</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">BANE Status</span>
          </div>
          <span className="text-sm font-black text-white">{baneStatus}</span>
        </div>
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-violet-400">
            <Activity className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">TEON Status</span>
          </div>
          <span className="text-sm font-black text-white">{teonStatus}</span>
        </div>
      </div>

      {/* Safety Warning */}
      <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Flight-Safe Mode Active</span>
          <p className="text-xs text-white/70 leading-relaxed">
            Only diagnostic and non-disruptive calibration modules are available. 
            All firmware, build, and mission mutation controls are locked by BANE governance.
          </p>
        </div>
      </div>

      {/* Restricted Module Area */}
      <div className="flex-1 border border-white/10 bg-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="flex border-b border-white/10 overflow-x-auto">
          {availableModules.map(m => (
            <button
              key={m.id}
              onClick={() => onModuleChange(m.id)}
              className={cn(
                "px-6 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-r border-white/5",
                activeModule.id === m.id 
                  ? "bg-primary/20 text-primary border-b-2 border-b-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto gap-4">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/30 text-primary">
              <Activity className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{activeModule.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Diagnostic data stream active. Controls are restricted to read-only or bounded adjustment only.
              No permanent mutation path available in current flight mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
