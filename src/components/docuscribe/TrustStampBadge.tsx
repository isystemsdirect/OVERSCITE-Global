/**
 * DocuSCRIBE™ — Trust Stamp Badge
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Visual indicator for Trust Stamp presence and validity.
 * Compact mode for document list, expanded mode for metadata panel.
 */

'use client';

import React from 'react';
import { Stamp, ShieldCheck, ShieldOff } from 'lucide-react';
import type { TrustStamp } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface TrustStampBadgeProps {
  stamp: TrustStamp | null | undefined;
  compact?: boolean;
}

export function TrustStampBadge({ stamp, compact = false }: TrustStampBadgeProps) {
  if (!stamp) {
    return (
      <div className={cn(
        "flex items-center gap-2",
        compact ? "gap-1.5" : "gap-2"
      )}>
        <ShieldOff className={cn(
          "text-zinc-500",
          compact ? "w-3 h-3" : "w-4 h-4"
        )} />
        <span className={cn(
          "font-bold uppercase tracking-wider text-zinc-500",
          compact ? "text-[8px]" : "text-[10px]"
        )}>
          Unstamped
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center border rounded-md",
      stamp.is_valid
        ? "bg-emerald-500/10 border-emerald-500/20"
        : "bg-rose-500/10 border-rose-500/20",
      compact ? "gap-1.5 px-1.5 py-0.5" : "gap-2 px-2.5 py-1.5"
    )}>
      {stamp.is_valid ? (
        <ShieldCheck className={cn(
          "text-emerald-400",
          compact ? "w-3 h-3" : "w-4 h-4"
        )} />
      ) : (
        <ShieldOff className={cn(
          "text-rose-400",
          compact ? "w-3 h-3" : "w-4 h-4"
        )} />
      )}
      <div className="flex flex-col">
        <span className={cn(
          "font-bold uppercase tracking-wider",
          stamp.is_valid ? "text-emerald-400" : "text-rose-400",
          compact ? "text-[8px]" : "text-[10px]"
        )}>
          {stamp.is_valid ? 'Stamped' : 'Stamp Invalid'}
        </span>
        {!compact && (
          <span className="text-[9px] font-mono text-white/30">
            CARR: {stamp.carr_score.toFixed(2)}
          </span>
        )}
      </div>
      {!compact && (
        <Stamp className={cn(
          "ml-auto",
          stamp.is_valid ? "text-emerald-400/30" : "text-rose-400/30",
          "w-5 h-5"
        )} />
      )}
    </div>
  );
}
