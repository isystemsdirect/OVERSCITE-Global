"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BrainCircuit, Info, ShieldAlert, AlertTriangle, 
  MessageSquare, Terminal
} from 'lucide-react';

interface ScimegaScingPresencePanelProps {
  advisory: {
    statement: string;
    interpretation: string;
    explanation?: string;
  };
  systemStatus: string;
}

export function ScimegaScingPresencePanel({ advisory, systemStatus }: ScimegaScingPresencePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase flex items-center gap-2">
          <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
          Scing Cognition Layer
        </h4>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">
          <div className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[8px] font-black text-cyan-400 tracking-widest uppercase">ADVISORY ACTIVE</span>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-cyan-500/[0.03] border border-cyan-500/10 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Terminal className="h-12 w-12 text-cyan-400" />
        </div>
        
        <div className="relative space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-cyan-400/40 uppercase tracking-[0.15em]">Current Statement</span>
            <p className="text-sm font-medium text-white/90 leading-relaxed tracking-tight">
              "{advisory.statement}"
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-cyan-500/20 to-transparent" />

          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-cyan-400/40 uppercase tracking-[0.15em]">IU Interpretation</span>
            <div className="flex items-start gap-3">
              <MessageSquare className="h-4 w-4 text-cyan-500/50 mt-0.5 shrink-0" />
              <p className="text-[11px] text-cyan-400/80 italic font-mono leading-normal">
                {advisory.interpretation}
              </p>
            </div>
          </div>

          {advisory.explanation && (
            <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Safety Rationale</span>
              <p className="text-[10px] text-white/60 leading-relaxed">
                {advisory.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
        <Info className="h-3 w-3 text-white/20" />
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
          Mode: <span className="text-white/60">{systemStatus}</span> / No Live Control Pathways Authorized
        </span>
      </div>
    </div>
  );
}
