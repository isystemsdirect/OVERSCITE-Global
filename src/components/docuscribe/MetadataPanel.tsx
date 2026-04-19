/**
 * DocuSCRIBE™ — Metadata Panel
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Right panel displaying document metadata, state, authority class,
 * version/lineage, verification status, Trust Stamp, CARR, audit trail,
 * and formal report generation gate.
 */

'use client';

import React from 'react';
import {
  FileText,
  Shield,
  GitBranch,
  Clock,
  CheckCircle,
  AlertTriangle,
  Hash,
  Stamp,
} from 'lucide-react';
import type { DocuScribeDocument, StampAuditEntry } from '@/lib/docuscribe/types';
import { getAuthorityClassLabel, getAuthorityClassColor, canEdit } from '@/lib/docuscribe/types';
import { TrustStampBadge } from './TrustStampBadge';
import { CARRDisplay } from './CARRDisplay';
import { StampAuditLog } from './StampAuditLog';
import { FormalReportGate } from './FormalReportGate';
import { cn } from '@/lib/utils';

interface MetadataPanelProps {
  document: DocuScribeDocument;
  stampAuditLog?: StampAuditEntry[];
  onApplyStamp?: () => void;
  onGenerateReport?: () => void;
}

/** Format ISO date string to readable local format */
function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function MetadataPanel({
  document,
  stampAuditLog = [],
  onApplyStamp,
  onGenerateReport,
}: MetadataPanelProps) {
  const statusColors: Record<string, string> = {
    draft: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    superseded: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const hasStamp = !!document.trust_stamp;
  const hasFindings = (document.findings?.length ?? 0) > 0;
  const isStampEligible = document.is_verified || document.status === 'approved' || canEdit(document.authority_class);

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div className="shrink-0 p-4 border-b border-white/5">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/60">
          Document Info
        </h3>
      </div>

      {/* ─── Metadata Fields ─── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Document ID */}
        <MetadataField
          icon={<Hash className="w-3.5 h-3.5" />}
          label="Document ID"
          value={document.document_id}
          mono
        />

        {/* Status */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Status
            </span>
          </div>
          <span className={cn(
            "inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
            statusColors[document.status] || 'bg-white/5 text-white/50 border-white/10'
          )}>
            {document.status.replace('_', ' ')}
          </span>
        </div>

        {/* Authority Class */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Authority Class
            </span>
          </div>
          <span className={cn(
            "inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
            getAuthorityClassColor(document.authority_class)
          )}>
            {getAuthorityClassLabel(document.authority_class)}
          </span>
        </div>

        {/* Verification State */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {document.is_verified ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Verification
            </span>
          </div>
          <span className={cn(
            "text-xs font-semibold",
            document.is_verified ? "text-emerald-400" : "text-amber-400"
          )}>
            {document.is_verified ? 'Verified' : 'Unverified'}
          </span>
        </div>

        {/* ─── Trust Stamp (P2) ─── */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Stamp className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Trust Stamp
            </span>
          </div>
          <TrustStampBadge stamp={document.trust_stamp ?? null} />

          {/* Stamp metadata when present */}
          {hasStamp && document.trust_stamp && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/25">Issued by</span>
                <span className="text-[10px] font-mono text-white/50">{document.trust_stamp.issued_by}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/25">Issued at</span>
                <span className="text-[10px] font-mono text-white/50">{formatTimestamp(document.trust_stamp.issued_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/25">Content Hash</span>
                <span className="text-[8px] font-mono text-white/30 truncate max-w-[120px]">{document.trust_stamp.content_hash.slice(0, 16)}…</span>
              </div>
            </div>
          )}

          {/* Apply Stamp button when eligible and no stamp yet */}
          {!hasStamp && isStampEligible && onApplyStamp && (
            <button
              onClick={onApplyStamp}
              className="mt-2 flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/15 transition-all duration-300"
            >
              <Stamp className="w-3 h-3" />
              Apply Trust Stamp
            </button>
          )}
        </div>

        {/* ─── CARR (P2) ─── */}
        {hasFindings && (
          <div className="pt-2 border-t border-white/5">
            <CARRDisplay findings={document.findings!} />
          </div>
        )}

        {/* ─── Formal Report Gate (P2) ─── */}
        <div className="pt-2 border-t border-white/5">
          <FormalReportGate
            document={document}
            onGenerate={onGenerateReport ?? (() => {})}
          />
        </div>

        {/* ─── Stamp Audit Trail (P2) ─── */}
        <div className="pt-2 border-t border-white/5">
          <StampAuditLog entries={stampAuditLog} />
        </div>

        {/* Version */}
        <MetadataField
          icon={<GitBranch className="w-3.5 h-3.5" />}
          label="Version"
          value={`v${document.version}.${document.sub_version}`}
          mono
        />

        {/* Lineage Parent */}
        {document.lineage_parent_id && (
          <MetadataField
            icon={<GitBranch className="w-3.5 h-3.5" />}
            label="Lineage Parent"
            value={document.lineage_parent_id}
            mono
          />
        )}

        {/* Created */}
        <MetadataField
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Created"
          value={formatTimestamp(document.created_at)}
        />

        {/* Updated */}
        <MetadataField
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Last Updated"
          value={formatTimestamp(document.updated_at)}
        />

        {/* Template Reference */}
        {document.template_id && (
          <MetadataField
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Template"
            value={document.template_id}
            mono
          />
        )}
      </div>
    </div>
  );
}

// ─── Reusable Metadata Field ─────────────────────────────────────────

function MetadataField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-white/30">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          {label}
        </span>
      </div>
      <span className={cn(
        "text-xs text-white/70 break-all",
        mono && "font-mono text-[11px]"
      )}>
        {value}
      </span>
    </div>
  );
}
