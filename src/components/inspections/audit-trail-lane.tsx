"use client";

/**
 * @fileOverview Audit Trail Lane — Recognition Pipeline Audit Surface
 * @domain Inspections / Field Intelligence / Audit
 * @phase Phase 3 — Audit Surface Activation
 *
 * Renders the immutable audit trail for recognition pipeline state transitions.
 * Displays actor, timestamp, prior state, new state, and policyRef where available.
 * Allows packet-level lineage trace from media asset to recognition packet.
 *
 * HARD RULES:
 * - Audit rendering must not edit audit history
 * - Audit entries must remain append-oriented and attributable
 * - No summary card may replace access to detailed lineage where state changed
 *
 * @see src/lib/hooks/use-evidence-subscription.ts
 * @see src/lib/services/recognition-persistence-service.ts
 */

import { useState } from "react";
import {
  BookOpen,
  Clock,
  User,
  Cpu,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Wifi,
  WifiOff,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MediaAnalysisStateBadge,
} from "@/components/inspections/recognition-truth-state-badge";
import type { MediaAnalysisState } from "@/lib/constants/recognition-truth-states";
import type { AuditLogEntry, AuditSubscriptionState } from "@/lib/hooks/use-evidence-subscription";

// ---------------------------------------------------------------------------
// Audit Action Labels
// ---------------------------------------------------------------------------

const AUDIT_ACTION_LABELS: Record<string, string> = {
  evidence_state_created: "Evidence State Created",
  analysis_requested: "Analysis Requested",
  analysis_started: "Analysis Started",
  analysis_completed: "Analysis Completed",
  review_required_flagged: "Review Required",
  verification_requested: "Verification Requested",
  verified_by_overscite: "Verified by OVERSCITE",
  recognition_packet_persisted: "Packet Persisted",
  reanalysis_requested: "Reanalysis Requested",
};

// ---------------------------------------------------------------------------
// Audit Entry Row
// ---------------------------------------------------------------------------

function AuditEntryRow({ entry }: { entry: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);

  const actionLabel = AUDIT_ACTION_LABELS[entry.action] ?? entry.action;
  const isHumanActor = entry.actorType === "human";
  const formattedTime = entry.timestamp
    ? new Date(entry.timestamp).toLocaleString()
    : "—";

  return (
    <div className="flex flex-col border-b border-border/10 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-start gap-3 px-4 py-2.5 text-left hover:bg-accent/10 transition-colors",
          expanded && "bg-accent/5"
        )}
      >
        {/* Actor Icon */}
        <div className={cn(
          "mt-0.5 shrink-0 rounded-full p-1",
          isHumanActor ? "bg-emerald-950/30 text-emerald-400" : "bg-blue-950/30 text-blue-400"
        )}>
          {isHumanActor ? <User className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{actionLabel}</span>
            {entry.banePolicyRef && (
              <Shield className="h-3 w-3 text-violet-400 shrink-0" />
            )}
            {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground ml-auto shrink-0" /> : <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{entry.actorId}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>
          {/* State Transition */}
          {(entry.fromState || entry.toState) && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {entry.fromState && (
                <MediaAnalysisStateBadge state={entry.fromState} showDot={false} />
              )}
              {entry.fromState && entry.toState && (
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
              )}
              {entry.toState && (
                <MediaAnalysisStateBadge state={entry.toState} showDot={false} />
              )}
            </div>
          )}
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-3 pl-11 flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-2">
            {entry.stateId && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">State ID</span>
                <span className="text-[10px] font-mono text-foreground truncate">{entry.stateId}</span>
              </div>
            )}
            {entry.packetId && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Packet ID</span>
                <span className="text-[10px] font-mono text-foreground truncate">{entry.packetId}</span>
              </div>
            )}
            {entry.banePolicyRef && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">BANE Policy Ref</span>
                <span className="text-[10px] font-mono text-violet-400 truncate">{entry.banePolicyRef}</span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Actor Type</span>
              <Badge variant="outline" className={cn(
                "text-[8px] font-black px-1 h-3.5 w-fit uppercase",
                isHumanActor ? "border-emerald-700 text-emerald-400" : "border-blue-700 text-blue-400"
              )}>
                {entry.actorType}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audit Trail Lane — Exported
// ---------------------------------------------------------------------------

interface AuditTrailLaneProps {
  auditState: AuditSubscriptionState;
}

export function AuditTrailLane({ auditState }: AuditTrailLaneProps) {
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  const filteredEntries = actionFilter
    ? auditState.entries.filter((e) => e.action === actionFilter)
    : auditState.entries;

  const uniqueActions = Array.from(new Set(auditState.entries.map((e) => e.action)));

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border/20 bg-card/20">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Audit Trail
          </span>
          <Badge variant="outline" className="text-[9px] font-black px-1.5 h-4 border-zinc-600 text-zinc-400">
            {auditState.entries.length} ENTRIES
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Live Status Indicator */}
          <div className={cn(
            "flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
            auditState.status === 'live' && "bg-emerald-950/30 text-emerald-400",
            auditState.status === 'degraded' && "bg-amber-950/30 text-amber-400",
            auditState.status === 'offline' && "bg-zinc-800/30 text-zinc-500",
            auditState.status === 'connecting' && "bg-blue-950/30 text-blue-400",
            auditState.status === 'idle' && "bg-zinc-800/30 text-zinc-500"
          )}>
            {auditState.status === 'live' ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
            {auditState.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {uniqueActions.length > 1 && (
        <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border/10 overflow-x-auto">
          <Filter className="h-3 w-3 text-muted-foreground/40 shrink-0" />
          <button
            onClick={() => setActionFilter(null)}
            className={cn(
              "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider transition-colors",
              !actionFilter ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {uniqueActions.map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action === actionFilter ? null : action)}
              className={cn(
                "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                actionFilter === action ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {AUDIT_ACTION_LABELS[action] ?? action}
            </button>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {auditState.error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-950/20 border-b border-amber-800/30 text-xs text-amber-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {auditState.error}
        </div>
      )}

      {/* Entries */}
      <div className="flex flex-col overflow-y-auto flex-1">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/20" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                {auditState.status === 'idle' ? 'Audit trail not loaded' : 'No audit entries'}
              </span>
              <span className="text-[11px] text-muted-foreground/60">
                State transitions, verification decisions, and analysis requests will appear here as they occur.
              </span>
            </div>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <AuditEntryRow key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {/* Footer */}
      {auditState.lastUpdated && (
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-border/10 bg-card/10">
          <span className="text-[9px] text-muted-foreground/40">
            Last updated: {new Date(auditState.lastUpdated).toLocaleTimeString()}
          </span>
          <span className="text-[9px] text-muted-foreground/40">
            Append-only • Immutable
          </span>
        </div>
      )}
    </div>
  );
}
