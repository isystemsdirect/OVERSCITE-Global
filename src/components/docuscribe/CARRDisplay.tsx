/**
 * DocuSCRIBE™ — CARR Display
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Confidence-Adjusted Report Rating visualization.
 * Shows numeric score, visual bar, and per-finding confidence breakdown.
 */

'use client';

import React from 'react';
import { BarChart3, CircleDot } from 'lucide-react';
import type { DocumentFinding } from '@/lib/docuscribe/types';
import { calculateCARR, getConfidenceColor, getConfidenceWeight } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface CARRDisplayProps {
  findings: DocumentFinding[];
  className?: string;
}

/** Returns gradient color stop based on CARR score. */
function getScoreColor(score: number): string {
  if (score >= 0.8) return 'text-emerald-400';
  if (score >= 0.6) return 'text-amber-400';
  if (score >= 0.4) return 'text-orange-400';
  return 'text-rose-400';
}

function getBarColor(score: number): string {
  if (score >= 0.8) return 'bg-emerald-500';
  if (score >= 0.6) return 'bg-amber-500';
  if (score >= 0.4) return 'bg-orange-500';
  return 'bg-rose-500';
}

export function CARRDisplay({ findings, className }: CARRDisplayProps) {
  const score = calculateCARR(findings);
  const hasFindingsData = findings && findings.length > 0;

  if (!hasFindingsData) {
    return (
      <div className={cn("text-[10px] text-white/20 italic", className)}>
        No findings — CARR unavailable
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* ─── CARR Score Header ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            CARR Score
          </span>
        </div>
        <span className={cn("text-lg font-black tabular-nums", getScoreColor(score))}>
          {score.toFixed(2)}
        </span>
      </div>

      {/* ─── Visual Bar ─── */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor(score))}
          style={{ width: `${score * 100}%` }}
        />
      </div>

      {/* ─── Finding Confidence Breakdown ─── */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
          Finding Confidence
        </span>
        {findings.map((finding) => (
          <div
            key={finding.id}
            className="flex items-center gap-2 py-1"
          >
            <CircleDot className={cn(
              "w-2.5 h-2.5 shrink-0",
              finding.confidence === 'high' ? 'text-emerald-400' :
              finding.confidence === 'medium' ? 'text-amber-400' :
              finding.confidence === 'low' ? 'text-orange-400' :
              'text-rose-400'
            )} />
            <span className="text-[10px] text-white/60 flex-1 truncate">
              {finding.title}
            </span>
            <span className={cn(
              "text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border shrink-0",
              getConfidenceColor(finding.confidence)
            )}>
              {finding.confidence}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
