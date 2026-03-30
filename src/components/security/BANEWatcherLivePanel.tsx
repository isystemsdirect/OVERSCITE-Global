'use client';

import React, { useState, useEffect } from 'react';
import { SecurityEvent } from '@/types/security-event';
import { SecurityEventCard } from './SecurityEventCard';
import { windowsDefenderAdapter } from '@/lib/security/adapters/windows-defender';
import { defenderNormalizer } from '@/lib/security/normalizers/defender-normalizer';
import { Shield, ShieldAlert, Zap, Activity, Filter, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BANEWatcherLivePanel() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Mock Live Stream Effect
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      if (Math.random() > 0.4) { // Simulate sporadic signals
        const raw = await windowsDefenderAdapter.fetchMockSignal();
        const normalized = defenderNormalizer.normalize(raw);
        setEvents(prev => [normalized, ...prev].slice(0, 50));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="flex flex-col h-full bg-black/20 border-l border-white/5 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
            BANE-Watcher <span className="text-primary/70">P1</span>
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
            <Activity className={cn("w-3 h-3", isLive ? "text-green-500 animate-pulse" : "text-white/20")} />
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border-b border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
          <input 
            type="text" 
            placeholder="Search signals..."
            className="w-full bg-white/5 border-none text-[10px] pl-7 pr-3 py-1.5 rounded-md focus:ring-1 focus:ring-primary/30 text-white/80 placeholder:text-white/10"
          />
        </div>
        <button className="p-1.5 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white">
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Signals List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
            <Zap className="w-8 h-8 mb-3" />
            <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Security Signals</p>
          </div>
        ) : (
          events.map(event => (
            <SecurityEventCard key={event.id} event={event} />
          ))
        )}
      </div>

      {/* Panel Footer: Truth-State Disclosure */}
      <div className="px-3 py-2.5 bg-black/40 border-t border-white/5">
        <div className="flex items-start gap-2 text-[9px] font-mono leading-tight opacity-40 uppercase tracking-tighter">
          <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
          <p>
            Signal foundation phase active. Normalization in progress.
            Truth-state labels: <span className="text-green-500">LIVE</span> (Active Adapter) | <span className="text-primary">NORM</span> (Canonical Map).
            Adjudication pending correlation phase.
          </p>
        </div>
      </div>
    </div>
  );
}
