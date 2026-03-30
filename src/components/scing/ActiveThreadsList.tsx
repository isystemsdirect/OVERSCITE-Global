'use client';

import React from 'react';
import { useScingPanel } from '@/lib/scing/scing-panel-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, Pin, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Static threads for UI structural testing until backend wiring
export const MOCK_THREADS = [
  { id: 't_eval', title: 'Route Validation Check', category: 'Operational', pinned: true, time: '10 min ago' },
  { id: 't_inspect', title: 'Report OS-G_VER_S1 Summary', category: 'Report', pinned: false, time: '2 hrs ago' },
  { id: 't_drone', title: 'Drone Telemetry Review', category: 'Drone', pinned: false, time: '1 day ago' },
];

/**
 * Renders the active threads within the Scing Panel.
 * V1.2.00 Density Refinement: Tighter console-grade rhythm without crowding.
 */
export function ActiveThreadsList() {
  // Relying on the new layout boundary state logic. If not wired, falback to mock.
  const { activeThreadId, setActiveThreadId } = useScingPanel() as any; 
  // Fallback to local state if Provider logic isn't fully swapped yet
  const safeActiveId = activeThreadId || 't_eval';
  const setSafeId = setActiveThreadId || (() => {});

  return (
    <div className="flex flex-col h-full border-r border-border/10 bg-black/10 w-[240px] shrink-0">
      <div className="px-3 py-2.5 border-b border-border/10 flex items-center justify-between">
        <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          Active Threads
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white/5 disabled:opacity-50 text-white" disabled>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1.5 space-y-0.5">
          {MOCK_THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSafeId(thread.id)}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md flex flex-col gap-1 transition-all",
                "cursor-pointer group select-none",
                safeActiveId === thread.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn(
                  "text-[11px] font-semibold truncate flex-1",
                  safeActiveId === thread.id ? "text-primary/90" : "text-foreground group-hover:text-primary/70"
                )}>
                  {thread.title}
                </span>
                {thread.pinned && <Pin className="h-[10px] w-[10px] text-muted-foreground shrink-0 ml-1.5" />}
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-mono text-muted-foreground/50 tracking-wider">
                  {thread.category}
                </span>
                <span className="flex items-center gap-1 text-[8px] text-muted-foreground/40">
                  <Clock className="h-2 w-2" />
                  {thread.time}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
