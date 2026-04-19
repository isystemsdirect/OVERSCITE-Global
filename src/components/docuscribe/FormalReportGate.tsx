/**
 * DocuSCRIBE™ — Formal Report Gate
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Controls formal report generation. Generation is BLOCKED
 * until a valid Trust Stamp is applied to the document.
 * Export and Send actions are gated behind stamp presence.
 */

'use client';

import React from 'react';
import { FileOutput, ShieldOff, ShieldCheck, Lock } from 'lucide-react';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { canGenerateFormalReport } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface FormalReportGateProps {
  document: DocuScribeDocument;
  onGenerate: () => void;
  className?: string;
}

export function FormalReportGate({ document, onGenerate, className }: FormalReportGateProps) {
  const authorized = canGenerateFormalReport(document);

  return (
    <div className={cn("space-y-2", className)}>
      {/* ─── Header ─── */}
      <div className="flex items-center gap-2">
        <FileOutput className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Formal Report
        </span>
      </div>

      {authorized ? (
        /* ─── Authorized State ─── */
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Generation Authorized
            </span>
          </div>
          <button
            onClick={onGenerate}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/15 transition-all duration-300"
          >
            <FileOutput className="w-3.5 h-3.5" />
            Generate Formal Report
          </button>
        </div>
      ) : (
        /* ─── Blocked State ─── */
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-500/10 border border-zinc-500/20">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Generation Blocked
            </span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/[0.02] border border-white/5">
            <ShieldOff className="w-3 h-3 text-zinc-600" />
            <span className="text-[9px] text-white/30 leading-tight">
              A valid Trust Stamp is required before formal report generation, export, or send actions can proceed.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
