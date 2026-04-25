"use client";

import React from 'react';
import { ShieldAlert, Lock, Info } from 'lucide-react';
import { WorkstationAccessReason } from '@/lib/scimega/workstation/scimega-workstation-types';
import { cn } from '@/lib/utils';

/**
 * @fileOverview SCIMEGA™ Workstation Lockout Surface
 * @purpose Display authoritative lockout reason during Pilot Mode or safety overrides.
 */

interface WorkstationLockoutSurfaceProps {
  accessReason: WorkstationAccessReason;
  availableModules?: string[];
}

export function WorkstationLockoutSurface({ accessReason, availableModules = [] }: WorkstationLockoutSurfaceProps) {
  const { status, reason, mode, authority } = accessReason;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 text-center animate-in fade-in duration-700">
      <div className={cn(
        "p-6 rounded-full mb-8 border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)]",
        status === 'BLOCKED' ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-blue-500/10 border-blue-500/50 text-blue-500"
      )}>
        {status === 'BLOCKED' ? <ShieldAlert className="h-16 w-16" /> : <Lock className="h-16 w-16" />}
      </div>

      <h2 className="text-2xl font-black tracking-tighter mb-4 uppercase">
        {status === 'BLOCKED' ? 'System Authority Blocked' : 'Workstation Access Locked'}
      </h2>

      <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-8 text-left w-full backdrop-blur-xl">
        <div className="flex items-start gap-4 mb-4">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Auth Reason</span>
            <p className="text-sm text-white/90 font-medium leading-relaxed">
              {reason}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active Mode</span>
            <span className="text-xs font-mono text-white/80">{mode}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Authority Source</span>
            <span className="text-xs font-mono text-white/80">{authority}</span>
          </div>
        </div>
      </div>

      {availableModules.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p className="mb-2">Flight-safe calibration surface available for whitelisted modules.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {availableModules.map(m => (
              <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg text-left max-w-md italic">
        <p className="text-[11px] text-blue-400/80 leading-relaxed">
          "Full workstation mutation capabilities are prohibited during active flight to ensure absolute execution stability. 
          Please use the restricted calibration surface if non-disruptive adjustments are required."
          <br />
          <span className="font-bold mt-2 block">— Scing Advisory</span>
        </p>
      </div>
    </div>
  );
}
