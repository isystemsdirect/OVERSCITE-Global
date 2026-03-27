// src/components/overhud/lari-repo/AuditPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { auditService } from '@/lib/lari-repo/audit-service';
import { AuditEvent } from '@/lib/lari-repo/types';
import { Activity, Search, Clock, User, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuditPanel() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.getEvents({}).then(data => {
      setEvents(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    });
  }, []);

  const getEventColor = (type: string) => {
    if (type.includes('accepted')) return 'text-green-500';
    if (type.includes('rejected')) return 'text-red-500';
    if (type.includes('corrected')) return 'text-blue-500';
    if (type.includes('dispatched')) return 'text-purple-500';
    return 'text-primary';
  };

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-3 border-b border-border/20 bg-black/40 flex justify-between items-center">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ClipboardList size={14} className="text-primary" /> GOVERNANCE EVENT LOG
        </span>
        <Activity size={14} className="text-primary animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto font-mono">
        {loading ? (
          <div className="p-8 text-center text-[10px] text-muted-foreground animate-pulse">READING AUDIT SPINE...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-[10px] text-muted-foreground italic">NO EVENTS RECORDED</div>
        ) : (
          <div className="border-l border-white/5 ml-4 my-4 flex flex-col">
            {events.map((event, idx) => (
              <div key={event.eventId} className="relative pl-6 pb-6 group">
                {/* Timeline Node */}
                <div className={cn(
                    "absolute left-[-4.5px] top-1 w-2 h-2 rounded-full border border-black transition-all",
                    getEventColor(event.type).replace('text-', 'bg-')
                )} />
                
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        <span className={cn("text-[9px] font-bold uppercase", getEventColor(event.type))}>{event.type.replace('_', ' ')}</span>
                    </div>

                    <div className="bg-black/40 border border-border/5 p-2 rounded-sm group-hover:bg-white/5 transition-colors">
                        <div className="text-[10px] text-foreground mb-1">
                            <span className="text-muted-foreground uppercase">Actor:</span> {event.actorId} ({event.actorRole})
                        </div>
                        {event.findingId && (
                            <div className="text-[9px] text-muted-foreground">
                                <span className="uppercase">Finding:</span> #{event.findingId}
                            </div>
                        )}
                        <div className="text-[8px] text-muted-foreground/40 mt-1 uppercase tracking-tighter">EVENT_ID: {event.eventId}</div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 bg-black/40 border-t border-border/20 flex justify-center">
         <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-30 tracking-[0.3em]">IMMUTABLE AUDIT SPINE</span>
      </div>
    </div>
  );
}
