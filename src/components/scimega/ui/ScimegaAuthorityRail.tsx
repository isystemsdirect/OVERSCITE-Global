"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, ShieldAlert, Fingerprint, Lock, 
  Activity, Zap, Info, AlertTriangle, AlertCircle 
} from 'lucide-react';

import { SCIMEGAAuthorityLevel } from '@/lib/scimega/uix/scimega-authority-flow-trace';

interface ScimegaAuthorityRailProps {
  dominantAuthority: SCIMEGAAuthorityLevel;
  scingStatus: string;
  iuBinding: string;
  archivalStatus: string;
  baneGates: { label: string; status: 'APPROVED' | 'PENDING' | 'LOCKED' | 'ERROR' }[];
  teonStack: { label: string; active: boolean }[];
  arcSignature: string;
  preemptionReason?: string;
}

export function ScimegaAuthorityRail({
  dominantAuthority,
  scingStatus,
  iuBinding,
  archivalStatus,
  baneGates,
  teonStack,
  arcSignature,
  preemptionReason
}: ScimegaAuthorityRailProps) {
  return (
    <div className="w-72 bg-black/40 border-l border-white/10 flex flex-col p-6 gap-8 backdrop-blur-md overflow-y-auto custom-scrollbar">
      {/* 1. SEVERITY HIERARCHY: DOMINANT STATE */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Dominant Authority</h4>
        <div className={cn(
          "p-4 rounded-xl border-2 flex flex-col gap-1 transition-all duration-500",
          dominantAuthority === 'TEON_SAFETY' ? "bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.1)]" :
          dominantAuthority === 'PILOT_CONTROL' ? "bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
          dominantAuthority === 'BANE_GOVERNANCE' ? "bg-blue-500/10 border-blue-500/40" : "bg-white/5 border-white/10"
        )}>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Active Layer</span>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-lg font-black tracking-tighter transition-colors",
              dominantAuthority === 'TEON_SAFETY' ? "text-orange-400" :
              dominantAuthority === 'PILOT_CONTROL' ? "text-green-400" :
              dominantAuthority === 'BANE_GOVERNANCE' ? "text-blue-400" : "text-cyan-400"
            )}>
              {dominantAuthority.replace('_', ' ')}
            </span>
            <Lock className="h-4 w-4 text-white/20" />
          </div>
          {preemptionReason && (
            <div className="mt-2 text-[9px] font-mono text-white/60 leading-tight border-t border-white/10 pt-2">
              &gt; {preemptionReason}
            </div>
          )}
        </div>
      </div>

      {/* 2. TEON SAFETY STACK */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase flex justify-between">
          TEON Safety Envelope
          <Zap className="h-3 w-3" />
        </h4>
        <div className="space-y-1">
          {teonStack.map((enforcement, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
              <span className="text-[9px] text-white/60 font-medium uppercase tracking-tight">{enforcement.label}</span>
              <span className={cn(
                "text-[8px] font-black tracking-widest",
                enforcement.active ? "text-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.5)]" : "text-white/10"
              )}>
                {enforcement.active ? 'ENFORCED' : 'IDLE'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BANE GOVERNANCE STACK */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase flex justify-between">
          BANE Governance
          <ShieldCheck className="h-3 w-3" />
        </h4>
        <div className="space-y-1">
          {baneGates.map((gate, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
              <span className="text-[9px] text-white/60 font-medium uppercase tracking-tight">{gate.label}</span>
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                gate.status === 'APPROVED' ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" :
                gate.status === 'PENDING' ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]" :
                gate.status === 'LOCKED' ? "bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. SCING BFI STACK */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Intelligence Presence</h4>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Scing BFI</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400/80">{scingStatus}</span>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">IU Binding</span>
            </div>
            <span className="text-[9px] font-mono text-green-400/80">{iuBinding}</span>
          </div>
        </div>
      </div>

      {/* 5. ARC IDENTITY STACK */}
      <div className="space-y-4 mt-auto">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase flex justify-between">
          ARC Identity
          <Fingerprint className="h-3 w-3" />
        </h4>
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-cyan-400/60 uppercase tracking-widest">Digital Signature</span>
            <Lock className="h-2.5 w-2.5 text-cyan-400/60" />
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 break-all leading-tight">
            {arcSignature}
          </span>
        </div>
      </div>
    </div>
  );
}
