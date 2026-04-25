"use client";

import React from 'react';
import { MessageSquare, Clock, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MOCK_THREADS = [
  { id: '1', title: 'Flight Path Alpha Verification', time: '2m ago', active: true },
  { id: '2', title: 'BANE Gate Exception Audit', time: '15m ago', active: false },
  { id: '3', title: 'LARI-Vision Frame Drop Debug', time: '1h ago', active: false },
];

export function ActiveThreadsList() {
  return (
    <div className="w-64 border-r border-white/5 flex flex-col bg-black/20 shrink-0">
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
          <Hash className="h-3 w-3" />
          Active Threads
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {MOCK_THREADS.map(thread => (
          <button
            key={thread.id}
            className={cn(
              "w-full text-left p-2.5 rounded-lg transition-all flex flex-col gap-1 group",
              thread.active 
                ? "bg-primary/10 border border-primary/20" 
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[11px] font-bold truncate",
                thread.active ? "text-primary" : "text-white/60 group-hover:text-white/80"
              )}>
                {thread.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/20 font-mono">
              <Clock className="h-2.5 w-2.5" />
              {thread.time}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-white/5">
        <button className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white/60 transition-all">
          View Archive
        </button>
      </div>
    </div>
  );
}