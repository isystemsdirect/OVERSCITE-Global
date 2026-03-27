// src/components/overhud/lari-repo/LearningQueuePanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { learningPortalService } from '@/lib/lari-repo/learning-portal-service';
import { learningQueueStateService } from '@/lib/lari-repo/learning-queue-state-service';
import { LearningPacket } from '@/lib/lari-repo/types';
import { Brain, ArrowRight, Clock, ShieldCheck, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LearningQueuePanel() {
  const [packets, setPackets] = useState<LearningPacket[]>([]);

  useEffect(() => {
    learningPortalService.getQueue().then(setPackets);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/20 p-4 gap-6">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <Brain className="text-primary" size={24} />
        <div>
            <div className="text-xs font-bold text-foreground tracking-widest uppercase">INTELLIGENCE LEARNING QUEUE</div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase">CANDIDATE INTAKE PIPELINE</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {packets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border/20 rounded p-8 text-center gap-4">
                <Box size={32} className="text-muted-foreground/30" />
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">NO CANDIDATE PACKETS QUEUED</div>
            </div>
        ) : (
            packets.map(packet => (
                <div key={packet.id} className="bg-black/40 border border-border/10 p-3 rounded-sm space-y-2 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-1 bg-primary/30 group-hover:bg-primary transition-all"></div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-primary uppercase">{packet.type.replace('_', ' ')}</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => learningQueueStateService.transitionState(packet.id, 'reviewed', 'mock-user', 'supervisor')}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-mono border border-border/20 rounded uppercase"
                            >
                                Mark Reviewed
                            </button>
                            <button 
                                onClick={() => learningQueueStateService.transitionState(packet.id, 'held', 'mock-user', 'supervisor', 'FURTHER_VALIDATION_REQUIRED')}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-mono border border-border/20 rounded uppercase"
                            >
                                Hold
                            </button>
                            <button 
                                onClick={() => learningQueueStateService.transitionState(packet.id, 'approved_for_possible_ingestion', 'mock-director', 'director')}
                                className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-[9px] font-mono border border-primary/20 text-primary rounded uppercase"
                            >
                                Approve Ingestion
                            </button>
                        </div>
                    </div>

                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tighter">PACKET ID: {packet.id.toUpperCase()}</div>
                    
                    {packet.heldReason && (
                        <div className="p-2 bg-amber-500/5 border border-amber-500/10 text-[9px] font-mono text-amber-200/70 italic">
                            HELD REASON: {packet.heldReason}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                        {packet.status === 'queued' && (
                            <>
                                <button className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500-20 text-amber-500 border border-amber-500/20 text-[8px] font-mono uppercase">Hold</button>
                                <button className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500-20 text-blue-500 border border-blue-500/20 text-[8px] font-mono uppercase">Review</button>
                            </>
                        )}
                        {packet.status === 'reviewed' && (
                            <>
                                <button className="px-2 py-1 bg-green-500/10 hover:bg-green-500-20 text-green-500 border border-green-500/20 text-[8px] font-mono uppercase">Approve For Ingestion</button>
                                <button className="px-2 py-1 bg-red-500/10 hover:bg-red-500-20 text-red-500 border border-red-500/20 text-[8px] font-mono uppercase">Exclude</button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4 py-1 border-y border-border/5">
                        <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground uppercase">
                           <Clock size={10} /> {new Date(packet.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground uppercase">
                           <ShieldCheck size={10} /> AUDITED
                        </div>
                    </div>

                    <button className="w-full mt-2 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        Inspect Payload <ArrowRight size={10} />
                    </button>
                </div>
            ))
        )}
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
        <div className="text-[10px] font-mono text-primary uppercase font-bold mb-1 italic tracking-widest">!!! AUDIT WARNING !!!</div>
        <p className="text-[9px] text-muted-foreground leading-relaxed">
            Note and correction packets are candidate-based. Final system ingestion requires independent verification. No direct live mutation permitted.
        </p>
      </div>
    </div>
  );
}
