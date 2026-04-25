"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Activity, ShieldCheck, Lock, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SCIMEGASystemStatus } from '@/lib/scimega/uix/scimega-uix-state';

interface ScimegaSystemStateHeaderProps {
  status: SCIMEGASystemStatus;
  phase: string;
  authority: {
    scing: boolean;
    iu: boolean;
    bane: boolean;
    teon: boolean;
  };
}

export function ScimegaSystemStateHeader({ status, phase, authority }: ScimegaSystemStateHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/10 backdrop-blur-xl z-50">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">SCIMEGA™ CORE</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-black tracking-widest text-white/90">XSCITE BUILDER</span>
            <Badge variant="outline" className={cn(
              "text-[9px] font-black tracking-widest border-white/10",
              status === 'SIMULATION' ? "bg-purple-500/10 text-purple-400" : 
              status === 'DRY-LINK' ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
            )}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Phase Readiness</span>
            <span className="text-[10px] font-mono text-white/70">{phase}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Safety Posture</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-green-500/70" />
              <span className="text-[9px] font-bold text-green-500/70 uppercase">BANE ENFORCED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", authority.scing ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "bg-white/20")} />
            <span className="text-[9px] font-black text-white/60 tracking-wider">SCING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", authority.iu ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-white/20")} />
            <span className="text-[9px] font-black text-white/60 tracking-wider">IU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", authority.bane ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-white/20")} />
            <span className="text-[9px] font-black text-white/60 tracking-wider">BANE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", authority.teon ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" : "bg-white/20")} />
            <span className="text-[9px] font-black text-white/60 tracking-wider">TEON</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-500">
          <Lock className="h-3 w-3" />
          <span className="text-[9px] font-black tracking-widest uppercase">NO EXECUTION</span>
        </div>
      </div>
    </div>
  );
}
