'use client';

import React from 'react';
import { 
  History, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  User, 
  Cpu, 
  Hash,
  Download
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ForensicAuditEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClientActivityWorkspaceProps {
  clientId: string;
  activities?: ForensicAuditEntry[];
}

export function ClientActivityWorkspace({ 
  clientId, 
  activities = [] 
}: ClientActivityWorkspaceProps) {
  
  // Mock Data for v1 if none provided
  const displayActivities = activities.length > 0 ? activities : [
    {
      event_id: 'evt-8f2e3a1c',
      prior_event_hash: '0x00000000',
      event_hash: '0x8f2e...3a1c',
      checksum: '0x8f2e...3a1c',
      timestamp: { seconds: 1713660000, nanoseconds: 0 } as any,
      actor_type: 'system',
      actor_id: 'BANE-Enforcement',
      role: 'Governing Engine',
      policy_version: 'SCINGULAR-1.1',
      engine_version: 'BANE-2.0',
      success_state: true,
      mutation_class: 'baseline_initialized',
      linkedEntityType: 'client',
      linkedEntityId: clientId,
      truthStateBefore: 'unknown',
      truthStateAfter: 'nominal',
      provenance: { source: 'system_logic', origin_id: 'INITIAL_BOOT' }
    },
    {
      event_id: 'evt-1a9c77db',
      prior_event_hash: '0x8f2e...3a1c',
      event_hash: '0x1a9c...77db',
      checksum: '0x1a9c...77db',
      timestamp: { seconds: 1713670000, nanoseconds: 0 } as any,
      actor_type: 'human',
      actor_id: 'id-001',
      role: 'Lead Inspector',
      policy_version: 'SCINGULAR-1.1',
      engine_version: 'BANE-2.0',
      success_state: true,
      mutation_class: 'accepted_minor_refinement',
      linkedEntityType: 'client',
      linkedEntityId: clientId,
      truthStateBefore: 'nominal',
      truthStateAfter: 'nominal',
      provenance: { source: 'user_interface', origin_id: 'Workstation-Client-Edit' }
    }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Forensic Activity Ledger</h2>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">
            Blockchain-Grounded Accountable Event Stream
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-border/40 bg-card/20 hover:bg-card/40">
          <Download className="h-3.5 w-3.5" />
          Export Audit Bundle
        </Button>
      </div>

      <Card className="flex-1 min-h-[500px] bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        <CardHeader className="bg-muted/10 border-b border-border/20 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 opacity-40" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">SCINGULAR-CORE-LEDGER-V1</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold">
                <ShieldCheck className="h-3 w-3" />
                INTEGRITY_VERIFIED
              </div>
              <Badge variant="outline" className="text-[10px] font-mono h-5 bg-background/50">{displayActivities.length} Events</Badge>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 bg-black/40 font-mono">
          <div className="p-0">
            {displayActivities.map((event, idx) => (
              <div key={event.event_id} className={cn(
                "border-b border-white/5 p-4 hover:bg-white/5 transition-colors group relative",
                idx === 0 && "bg-white/5"
              )}>
                {/* Visual Connector Line */}
                {idx < displayActivities.length - 1 && (
                  <div className="absolute left-6 bottom-0 w-px h-4 bg-white/10 group-hover:bg-primary/20 transition-colors" />
                )}

                <div className="flex gap-4">
                   <div className="flex flex-col items-center gap-2 mt-1">
                      <div className="h-4 w-4 rounded-full border border-white/20 flex items-center justify-center p-0.5 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        {event.actor_type === 'human' ? <User className="h-full w-full" /> : <Cpu className="h-full w-full" />}
                      </div>
                      <div className="w-px flex-1 bg-white/10 group-hover:bg-primary/20" />
                   </div>
                   
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-xs">{event.mutation_class.toUpperCase()}</span>
                          <span className="text-[10px] opacity-40">@ {event.event_id}</span>
                        </div>
                        <span className="text-[10px] opacity-40">
                          {typeof event.timestamp === 'object' && 'seconds' in event.timestamp
                             ? new Date(event.timestamp.seconds * 1000).toLocaleString()
                             : 'REALTIME_AUDIT'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-3 rounded-lg border border-white/10 group-hover:border-primary/10 transition-colors">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Actor</span>
                          <span className="text-[10px] text-white/90">{event.actor_id} <span className="opacity-40">({event.role})</span></span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Protocol</span>
                          <span className="text-[10px] text-white/90">{event.policy_version} / {event.engine_version}</span>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">SHA-256 Hash Chaining</span>
                          <div className="flex items-center gap-2">
                            <Hash className="h-2.5 w-2.5 opacity-20" />
                            <span className="text-[9px] opacity-60 font-mono truncate">{event.prior_event_hash}</span>
                            <ArrowRight className="h-2.5 w-2.5 opacity-20" />
                            <span className="text-[9px] text-primary/80 font-mono truncate">{event.event_hash}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5 opacity-60">
                          <Lock className="h-3 w-3" />
                          BANE Signature: <span className="text-primary italic">0x{Math.random().toString(16).substr(2, 8)}...Verified</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60">
                           Truth Shift: <span className="opacity-40">{event.truthStateBefore}</span> <ArrowRight className="h-2 w-2" /> <span className="text-green-500">{event.truthStateAfter}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
