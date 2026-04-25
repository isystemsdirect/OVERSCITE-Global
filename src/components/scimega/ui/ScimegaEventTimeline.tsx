"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollText, Activity, ShieldAlert, Fingerprint, Clock, Zap, Radio } from 'lucide-react';

interface ScimegaEvent {
  id: string;
  timestamp: string;
  type: 'AUDIT' | 'TELEMETRY' | 'GOVERNANCE' | 'AUTHORIZATION' | 'SAFETY' | 'TRANSITION';
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

interface ScimegaEventTimelineProps {
  events: ScimegaEvent[];
}

export function ScimegaEventTimeline({ events }: ScimegaEventTimelineProps) {
  return (
    <div className="h-12 bg-black/60 border-t border-white/10 flex items-center px-6 gap-6 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 shrink-0">
        <Clock className="h-3 w-3 text-white/30" />
        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Authority + Safety + Mission Timeline</span>
      </div>

      <div className="flex-1 flex items-center gap-8 overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/60 to-transparent z-10" />
        
        <div className="flex items-center gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {events.slice(-8).map((event) => {
            const Icon = 
              event.type === 'AUDIT' ? ScrollText :
              event.type === 'TELEMETRY' ? Activity :
              event.type === 'GOVERNANCE' ? ShieldAlert :
              event.type === 'SAFETY' ? Zap : 
              event.type === 'TRANSITION' ? Radio : Fingerprint;

            return (
              <div key={event.id} className="flex items-center gap-3 shrink-0">
                <Icon className={cn(
                  "h-3 w-3",
                  event.severity === 'CRITICAL' ? "text-red-500" :
                  event.severity === 'WARNING' ? "text-amber-500" : 
                  event.type === 'SAFETY' ? "text-orange-400" : "text-white/30"
                )} />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-white/30">{event.timestamp.split('T')[1].split('.')[0]}</span>
                  <span className={cn(
                    "text-[9px] font-bold tracking-tight uppercase whitespace-nowrap",
                    event.severity === 'CRITICAL' ? "text-red-400" :
                    event.severity === 'WARNING' ? "text-amber-400" : "text-white/70"
                  )}>
                    {event.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
          <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">Live Audit Chain</span>
        </div>
      </div>
    </div>
  );
}
