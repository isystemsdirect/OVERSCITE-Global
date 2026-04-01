'use client';

import React from 'react';
import { RepoNode } from '@/lib/types/repository';
import { RepoIconBuilder } from './RepoIconBuilder';
import { ShieldAlert, Fingerprint, Calendar, Clock, Activity, FileLock2, AlertCircle, FileSearch, Download } from 'lucide-react';
import { TruthStateBadge } from '@/components/layout/TruthStateBadge';
import { Button } from '@/components/ui/button';
import { OcitUiPosture } from '@/lib/types/ocit';
import { Separator } from '@/components/ui/separator';

interface RepoDetailPaneProps {
  node: RepoNode | null;
}

export function RepoDetailPane({ node }: RepoDetailPaneProps) {
  if (!node) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center text-muted-foreground bg-black/20 border-l border-white/5">
        <Fingerprint size={32} className="opacity-20 mb-3" />
        <div className="text-[11px] font-mono tracking-widest uppercase">Select Node for Evidence Context</div>
        <div className="text-[9px] font-mono opacity-50 mt-2 max-w-[200px]">Explorer selection determines OCIT capability scopes and LARI insights</div>
      </div>
    );
  }

  // Determine Mock OCIT UI Action Posture
  let actionPosture: OcitUiPosture = 'AVAILABLE';
  if (node.trust_state === 'mock') actionPosture = 'SIMULATED BRIDGE';
  if (node.canonical_class === 'System' || node.canonical_class === 'Devices') actionPosture = 'NATIVE PENDING';
  if (node.mutation_class === 'protected') actionPosture = 'POLICY BLOCKED';

  return (
    <div className="flex flex-col h-full bg-black/30 border-l border-white/5 overflow-y-auto w-[320px] shrink-0">
      
      {/* Detail Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-start gap-4 mb-3">
          <div className="p-2.5 bg-background border border-white/10 rounded-md shrink-0">
             <RepoIconBuilder canonicalClass={node.canonical_class as string} kind={node.node_kind} size={24} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
             <div className="text-[13px] font-semibold text-foreground truncate">{node.label}</div>
             <div className="text-[10px] font-mono text-muted-foreground opacity-80 mt-0.5">{node.id}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <TruthStateBadge state={node.trust_state} />
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded border border-white/10 bg-black/40">
            {node.mutation_class.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded border border-blue-500/20 bg-blue-500/10 text-blue-400">
            {node.visibility_policy.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-4 space-y-5 flex-1">
        
        {/* Node Metadata Matrix */}
        <section className="space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1 opacity-70 flex items-center gap-1.5">
            <Activity size={10} /> Structural Provenance
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <div className="bg-black/40 border border-white/5 rounded pl-2.5 pr-2 py-1.5">
               <div className="text-[9px] text-muted-foreground font-mono mb-0.5">Classification</div>
               <div className="text-[11px] font-medium truncate">{node.canonical_class}</div>
            </div>
            <div className="bg-black/40 border border-white/5 rounded pl-2.5 pr-2 py-1.5">
               <div className="text-[9px] text-muted-foreground font-mono mb-0.5">Node Kind</div>
               <div className="text-[11px] font-medium capitalize">{node.node_kind}</div>
            </div>
          </div>
        </section>

        {/* Time Tracking */}
        <section className="space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1 opacity-70 flex items-center gap-1.5">
            <Calendar size={10} /> Governance Timestamps
          </div>
          <div className="bg-black/40 flex flex-col gap-2 p-2.5 rounded border border-white/5 text-[11px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1"><Clock size={10} /> Created</span>
              <span>{node.timestamp ? new Date(node.timestamp).toLocaleString() : 'System Genesis'}</span>
            </div>
          </div>
        </section>

        {/* OCIT Native Bridge Posture */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-70">
            <div className="flex items-center gap-1.5"><ShieldAlert size={10} /> OCIT Native Bridge</div>
            <div className={`px-1 rounded-sm text-[8px] border ${
              actionPosture === 'NATIVE PENDING' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
              actionPosture === 'SIMULATED BRIDGE' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' :
              actionPosture === 'POLICY BLOCKED' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
              'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
            }`}>
              {actionPosture}
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-md p-3 space-y-3">
             <div className="text-[11px] text-muted-foreground leading-relaxed">
               {actionPosture === 'NATIVE PENDING' && "Native REBEL binding required for deep root manipulation. Capability scope demands physical device sync."}
               {actionPosture === 'SIMULATED BRIDGE' && "Displaying mock frontend behavior. OCIT handshake logic is captured synthetically for log verification."}
               {actionPosture === 'POLICY BLOCKED' && "Node mutability strictly gated. Current auth scope lacks overrides for BANE protected root layer."}
               {actionPosture === 'AVAILABLE' && "Standard read/write scopes permitted."}
             </div>
             
             <Separator className="bg-white/5" />
             
             <div className="flex flex-col gap-2">
               <Button variant="outline" size="sm" className="w-full text-[11px] h-8 justify-start gap-2 bg-black/40 hover:bg-white/5" disabled={actionPosture === 'POLICY BLOCKED' || actionPosture === 'NATIVE PENDING'}>
                  <FileSearch size={12} className="text-primary" /> Execute Capability Inspection
               </Button>
               <Button variant="outline" size="sm" className="w-full text-[11px] h-8 justify-start gap-2 bg-black/40 hover:bg-white/5 border-red-500/20 text-red-400 hover:text-red-300 transition-colors" disabled={node.mutation_class !== 'protected'}>
                  <FileLock2 size={12} /> BANE Seal / Append Root
               </Button>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}
