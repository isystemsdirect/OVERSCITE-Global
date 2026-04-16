/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * TimelineOrAuditRegion (Layer 6)
 * Event, history, change, or evidence stream.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  status?: string;
}

interface TimelineOrAuditRegionProps {
  events?: TimelineEvent[];
  placement?: 'bottom' | 'side';
  className?: string;
  children?: React.ReactNode;
}

export function TimelineOrAuditRegion({
  events = [],
  placement = 'bottom',
  className,
  children
}: TimelineOrAuditRegionProps) {
  return (
    <div className={cn(
      "border-t border-white/5 bg-black/20 px-4 lg:px-6 py-4",
      placement === 'side' && "border-t-0 border-l w-80 h-full",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
          {placement === 'side' ? 'Operation Log' : 'Mission Timeline'}
        </h3>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
          <span className="text-[9px] font-mono text-primary/60 uppercase">Live Feed</span>
        </div>
      </div>

      {children}

      <div className={cn(
        "flex gap-4 overflow-x-auto pb-2 scrollbar-hide",
        placement === 'side' && "flex-col overflow-y-auto"
      )}>
        {events.map((event) => (
          <div key={event.id} className="flex flex-col min-w-[200px] bg-white/[0.03] border border-white/5 p-3 rounded-lg">
            <span className="text-[9px] font-mono text-muted-foreground mb-1">{event.time}</span>
            <span className="text-xs font-medium text-white/80">{event.label}</span>
            {event.status && (
              <span className="mt-2 text-[8px] font-bold uppercase tracking-tighter text-primary">
                {event.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
