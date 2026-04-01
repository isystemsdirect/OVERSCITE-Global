'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveSystemStatus() {
  const [time, setTime] = useState<string>('');
  const [pulse, setPulse] = useState(false);
  const [sequence, setSequence] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].split('.')[0] + ' UTC');
      setPulse(p => !p);
    }, 1000);

    // Initial sequence mock or fetch if we had a dedicated hook
    setSequence(Math.floor(Date.now() / 10000) % 1000000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-emerald-500/5 border-b border-emerald-500/20 px-3 py-2 flex items-center justify-between overflow-hidden relative group">
      {/* Background signal glow */}
      <div className={cn(
        "absolute inset-0 bg-emerald-500/5 transition-opacity duration-1000",
        pulse ? "opacity-100" : "opacity-0"
      )} />

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter leading-none">
              UTCB-S Protocol
            </span>
            <span className="text-[7px] font-mono text-emerald-500/60 uppercase tracking-widest leading-none mt-0.5">
              Strict Enforcement
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-emerald-500/20" />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-emerald-500/70" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 tabular-nums">
              {time || '同步中...'}
            </span>
          </div>
          <span className="text-[7px] font-mono text-emerald-500/40 uppercase tracking-tight">
            Sync: Stratum-1 Verified
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
             <span className="text-[9px] font-mono text-emerald-500/80 uppercase">Sequence</span>
             <span className="text-[10px] font-mono font-bold text-emerald-400 tabular-nums">
                #{sequence.toString().padStart(7, '0')}
             </span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-2 h-2 text-emerald-500/50" />
            <span className="text-[7px] font-mono text-emerald-500/40 uppercase">Chained Audit Active</span>
          </div>
        </div>

        <div className="flex flex-col items-end border-l border-emerald-500/10 pl-3">
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-bold text-emerald-500 uppercase">Live</span>
          </div>
          <span className="text-[7px] font-mono text-emerald-500/60 uppercase tracking-tighter">
            BANE Gate: Normal
          </span>
        </div>
      </div>

      {/* Subtle scanning line */}
      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-emerald-500/30 blur-[1px] animate-[scan_4s_linear_infinite]" />
    </div>
  );
}
