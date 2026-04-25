"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, ShieldAlert, Activity, Lock, 
  Zap, User, ShieldCheck, Info
} from 'lucide-react';
import { SCIMEGAAuthorityFlowEvent } from '@/lib/scimega/uix/scimega-authority-flow-trace';

interface ScimegaAuthorityFlowTraceProps {
  events: SCIMEGAAuthorityFlowEvent[];
}

export function ScimegaAuthorityFlowTrace({ events }: ScimegaAuthorityFlowTraceProps) {
  if (events.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white/5 border border-white/5 border-dashed flex items-center justify-center">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">No Authority Transitions Detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-4">Authority Flow Trace</h4>
      <div className="space-y-2">
        {events.slice(-4).reverse().map((event) => {
          const t = event.transition;
          const isCritical = t.severity === 'CRITICAL' || t.severity === 'HIGH';

          return (
            <div key={event.id} className={cn(
              "p-3 rounded-lg border flex flex-col gap-2 transition-all duration-300",
              isCritical ? "bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "bg-white/5 border-white/10"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                    isCritical ? "bg-red-500 text-white" : "bg-white/10 text-white/60"
                  )}>
                    {t.class.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[9px] font-mono text-white/30">{t.timestamp.split('T')[1].split('.')[0]}</span>
                </div>
                {isCritical && <ShieldAlert className="h-3.5 w-3.5 text-red-500 animate-pulse" />}
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-tighter">Prior</span>
                  <span className="text-[10px] font-bold text-white/60">{t.priorAuthority}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-white/20" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-tighter">Active</span>
                  <span className={cn(
                    "text-[10px] font-black",
                    t.newAuthority === 'TEON_SAFETY' ? "text-orange-400" :
                    t.newAuthority === 'BANE_GOVERNANCE' ? "text-blue-400" :
                    t.newAuthority === 'PILOT_CONTROL' ? "text-green-400" : "text-cyan-400"
                  )}>
                    {t.newAuthority}
                  </span>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.03]">
                <p className="text-[10px] text-white/80 font-mono leading-relaxed">
                  <span className="text-white/30 uppercase font-black mr-1.5">REASON:</span>
                  {t.reason}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Source:</span>
                  <span className="text-[9px] font-bold text-white/40 uppercase">{t.preemptionSource}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
