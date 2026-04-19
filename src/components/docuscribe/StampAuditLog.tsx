/**
 * DocuSCRIBE™ — Stamp Audit Log Display
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * View-only chronological display of stamp audit entries.
 * No edit/delete UI — protected by design.
 * Shows hash chain linkage for integrity verification.
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Link2, ShieldCheck } from 'lucide-react';
import type { StampAuditEntry } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface StampAuditLogProps {
  entries: StampAuditEntry[];
  className?: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  stamp_issued: { label: 'Stamp Issued', color: 'text-emerald-400' },
  stamp_revoked: { label: 'Stamp Revoked', color: 'text-rose-400' },
  stamp_reissued: { label: 'Stamp Reissued', color: 'text-blue-400' },
  stamp_viewed: { label: 'Stamp Viewed', color: 'text-zinc-400' },
  generation_blocked: { label: 'Generation Blocked', color: 'text-amber-400' },
  generation_authorized: { label: 'Generation Authorized', color: 'text-emerald-400' },
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function StampAuditLog({ entries, className }: StampAuditLogProps) {
  const [expanded, setExpanded] = useState(false);

  if (entries.length === 0) {
    return (
      <div className={cn("text-[10px] text-white/20 italic", className)}>
        No audit entries
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {/* ─── Toggle Header ─── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left py-1"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            Stamp Audit Trail
          </span>
          <span className="text-[9px] font-mono text-white/15">
            ({entries.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-white/30" />
        ) : (
          <ChevronDown className="w-3 h-3 text-white/30" />
        )}
      </button>

      {/* ─── Entries ─── */}
      {expanded && (
        <div className="space-y-1 pt-2">
          {entries.map((entry, idx) => {
            const meta = actionLabels[entry.action] ?? { label: entry.action, color: 'text-white/50' };
            return (
              <div
                key={entry.entry_id}
                className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg space-y-1"
              >
                {/* Action + Time */}
                <div className="flex items-center justify-between">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", meta.color)}>
                    {meta.label}
                  </span>
                  <span className="text-[9px] font-mono text-white/20">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>

                {/* Detail */}
                <p className="text-[10px] text-white/50 leading-relaxed">
                  {entry.detail}
                </p>

                {/* Actor + Hash */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-white/30">
                    Actor: <span className="font-mono text-white/40">{entry.actor}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Link2 className="w-2.5 h-2.5 text-white/15" />
                    <span className="text-[8px] font-mono text-white/15 truncate max-w-[80px]">
                      {entry.hash.slice(0, 12)}…
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
