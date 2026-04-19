/**
 * DocuSCRIBE™ — Flow Workspace
 *
 * @classification PAGE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * State flow and document lifecycle visualization.
 */

'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  FileEdit,
  UserCheck,
  ShieldCheck,
  Stamp,
  Send,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_DOCUMENTS } from '@/lib/docuscribe/mock-data';

export default function FlowWorkspacePage() {
  
  // Calculate stats for the flow visualization based on authority classes
  const stats = {
    drafts: MOCK_DOCUMENTS.filter(d => d.authority_class === 'draft_editable' || d.authority_class === 'partial_edit').length,
    review: 0, // In mock data, mostly just drafts and final logs
    approved: MOCK_DOCUMENTS.filter(d => d.is_verified).length,
    stamped: MOCK_DOCUMENTS.filter(d => Boolean(d.trust_stamp?.is_valid)).length,
    formal: MOCK_DOCUMENTS.filter(d => d.authority_class === 'protected_log_view_only').length,
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      <div className="p-6 md:p-8 lg:p-10 pb-0">
        <PageHeader
          title="Flow Intelligence"
          status="live"
          guidanceId="docuscribe-flow"
          description="Document lifecycle trajectory and authority class progression visualization across the workspace."
        />
      </div>

      <div className="flex-1 min-h-0 px-6 md:px-8 lg:px-10 pb-4 pt-10 overflow-hidden flex flex-col items-center justify-center">
        
        <div className="w-full max-w-5xl">
          <div className="text-xs uppercase tracking-widest font-bold text-white/30 text-center mb-16">
            Standard Operating Procedure — Document Maturation Pipeline
          </div>

          <div className="relative flex justify-between items-center">
            
            {/* Connecting Line */}
            <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-0.5 bg-white/5 z-0" />
            <div className="absolute left-[5%] w-[65%] top-1/2 -translate-y-1/2 h-0.5 bg-primary/30 z-0" />

            {/* Nodes */}
            <FlowNode 
              icon={<FileEdit className="w-6 h-6" />}
              title="Draft editable"
              count={stats.drafts}
              state="active"
            />
            <FlowNode 
              icon={<UserCheck className="w-6 h-6" />}
              title="Partial Edit"
              count={stats.review}
              state="idle"
            />
            <FlowNode 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Immutable View"
              count={stats.approved}
              state="active"
            />
            <FlowNode 
              icon={<Stamp className="w-6 h-6" />}
              title="Trust Stamped"
              count={stats.stamped}
              state="active"
              highlight
            />
            <FlowNode 
              icon={<Send className="w-6 h-6" />}
              title="Protected Log"
              count={stats.formal}
              state="active"
            />

          </div>
        </div>

      </div>
    </div>
  );
}

function FlowNode({ icon, title, count, state, highlight }: { icon: React.ReactNode, title: string, count: number, state: 'active' | 'idle', highlight?: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-4 w-32">
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-xl",
        highlight ? "bg-primary/20 text-primary border-primary shadow-primary/20" :
        state === 'active' ? "bg-[#111] text-white/80 border-white/20" : "bg-black text-white/30 border-white/5"
      )}>
        {icon}
      </div>
      
      <div className="text-center">
        <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-1", state === 'active' ? "text-white" : "text-white/40")}>{title}</h3>
        <div className={cn("text-[10px] font-mono", highlight ? "text-primary" : "text-white/30")}>
          {count} Document{count !== 1 && 's'}
        </div>
      </div>
    </div>
  );
}
