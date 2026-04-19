"use client";

/**
 * @fileOverview RecognitionTruthStateBadge
 * @domain Inspections / Field Intelligence
 * @phase Phase 1 — Foundation
 *
 * Recognition-specific truth state badge for the Inspections Evidence surface.
 * Renders the `MediaAnalysisState` and `RecognitionState` for a media asset or finding,
 * distinct from the canonical `TruthStateBadge` which renders core system truth states.
 *
 * @see src/lib/constants/recognition-truth-states.ts
 * @see src/components/layout/TruthStateBadge.tsx (canonical base system badge)
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MediaAnalysisState, ConfidenceBand, DraftingState } from "@/lib/constants/recognition-truth-states";

// ---------------------------------------------------------------------------
// Media Analysis State Configuration
// ---------------------------------------------------------------------------

interface StateConfig {
  label: string;
  color: string;
  dot: string;
  description: string;
}

const MEDIA_STATE_CONFIG: Record<MediaAnalysisState, StateConfig> = {
  accepted_unanalyzed: {
    label: "UNANALYZED",
    color: "border-zinc-600 text-zinc-400 bg-zinc-900/40",
    dot: "bg-zinc-600",
    description: "Media accepted and stored. No analysis has been run.",
  },
  accepted_analysis_requested: {
    label: "REQUESTED",
    color: "border-blue-600 text-blue-400 bg-blue-950/40",
    dot: "bg-blue-500 animate-pulse",
    description: "Analysis has been explicitly requested and is queued.",
  },
  analysis_in_progress: {
    label: "ANALYZING",
    color: "border-amber-500 text-amber-400 bg-amber-950/40",
    dot: "bg-amber-400 animate-pulse",
    description: "Recognition stack passes are currently executing.",
  },
  analysis_complete: {
    label: "COMPLETE",
    color: "border-emerald-600 text-emerald-400 bg-emerald-950/40",
    dot: "bg-emerald-500",
    description: "Analysis complete. Awaiting review or verification.",
  },
  verification_pending: {
    label: "PENDING VERIFY",
    color: "border-violet-500 text-violet-400 bg-violet-950/40",
    dot: "bg-violet-500 animate-pulse",
    description: "Analysis complete. Waiting for human authority verification.",
  },
  verified_by_overscite: {
    label: "VERIFIED",
    color: "border-emerald-400 text-emerald-300 bg-emerald-950/60",
    dot: "bg-emerald-400",
    description: "Verified by human authority through governed path.",
  },
  review_required: {
    label: "REVIEW REQUIRED",
    color: "border-rose-500 text-rose-400 bg-rose-950/40",
    dot: "bg-rose-500",
    description: "Review required — confidence failure, anomaly, or escalation.",
  },
};

// ---------------------------------------------------------------------------
// Confidence Band Configuration
// ---------------------------------------------------------------------------

const CONFIDENCE_CONFIG: Record<ConfidenceBand, { label: string; color: string }> = {
  high:           { label: "HIGH",     color: "border-emerald-600 text-emerald-400 bg-emerald-950/30" },
  moderate:       { label: "MOD",      color: "border-amber-500 text-amber-400 bg-amber-950/30" },
  low:            { label: "LOW",      color: "border-orange-600 text-orange-400 bg-orange-950/30" },
  review_required:{ label: "REVIEW",   color: "border-rose-500 text-rose-400 bg-rose-950/30" },
  verified_by_overscite: { label: "VERIFIED", color: "border-emerald-400 text-emerald-300 bg-emerald-950/60" },
};

// ---------------------------------------------------------------------------
// Component: MediaAnalysisStateBadge
// ---------------------------------------------------------------------------

interface MediaAnalysisStateBadgeProps {
  state: MediaAnalysisState;
  className?: string;
  showDot?: boolean;
}

export function MediaAnalysisStateBadge({
  state,
  className,
  showDot = true,
}: MediaAnalysisStateBadgeProps) {
  const config = MEDIA_STATE_CONFIG[state];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "font-black tracking-widest text-[9px] uppercase px-2 py-0 h-5 border shadow-sm flex items-center gap-1.5 cursor-default",
              config.color,
              className
            )}
          >
            {showDot && (
              <span className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
            )}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-xs">
          <p className="font-mono text-[10px] text-muted-foreground mb-0.5">{state}</p>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Component: ConfidenceBandBadge
// ---------------------------------------------------------------------------

interface ConfidenceBandBadgeProps {
  band: ConfidenceBand;
  className?: string;
}

export function ConfidenceBandBadge({ band, className }: ConfidenceBandBadgeProps) {
  const config = CONFIDENCE_CONFIG[band];
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-black tracking-widest text-[9px] uppercase px-2 py-0 h-5 border shadow-sm",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Component: DraftingStateBadge
// ---------------------------------------------------------------------------

const DRAFTING_STATE_LABELS: Record<DraftingState, string> = {
  document_detected:      "DOC DETECTED",
  sheet_structure_detected:"SHEET PARSED",
  symbol_set_partial:     "SYMBOL PARTIAL",
  dimension_context_partial:"DIM PARTIAL",
  drawing_review_required:"DRAW REVIEW",
  no_drawing_present:     "NO DRAWING",
};

interface DraftingStateBadgeProps {
  state: DraftingState;
  className?: string;
}

export function DraftingStateBadge({ state, className }: DraftingStateBadgeProps) {
  const label = DRAFTING_STATE_LABELS[state];
  const isPartial = state.includes("partial") || state === "drawing_review_required";
  const isDetected = state === "document_detected" || state === "sheet_structure_detected";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-black tracking-widest text-[9px] uppercase px-2 py-0 h-5 border shadow-sm",
        isDetected && "border-sky-600 text-sky-400 bg-sky-950/30",
        isPartial && "border-amber-500 text-amber-400 bg-amber-950/30",
        state === "no_drawing_present" && "border-zinc-600 text-zinc-500 bg-zinc-900/30",
        className
      )}
    >
      {label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Component: RecognitionFlagRow — living entity / pest / unknown / occlusion flags
// ---------------------------------------------------------------------------

interface RecognitionFlagRowProps {
  hasLivingEntityOcclusion?: boolean;
  hasPestEvidence?: boolean;
  hasUnresolvedUnknowns?: boolean;
  hasVisibilityLimitations?: boolean;
  isDrawingArtifact?: boolean;
  className?: string;
}

export function RecognitionFlagRow({
  hasLivingEntityOcclusion,
  hasPestEvidence,
  hasUnresolvedUnknowns,
  hasVisibilityLimitations,
  isDrawingArtifact,
  className,
}: RecognitionFlagRowProps) {
  const flags = [
    hasLivingEntityOcclusion && { label: "ENTITY OCCLUSION", color: "text-amber-400 border-amber-600 bg-amber-950/30" },
    hasPestEvidence          && { label: "PEST EVIDENCE",     color: "text-rose-400 border-rose-600 bg-rose-950/30" },
    hasUnresolvedUnknowns    && { label: "UNKNOWNS",          color: "text-orange-400 border-orange-600 bg-orange-950/30" },
    hasVisibilityLimitations && { label: "VIS LIMITED",       color: "text-violet-400 border-violet-600 bg-violet-950/30" },
    isDrawingArtifact        && { label: "DRAWING",           color: "text-sky-400 border-sky-600 bg-sky-950/30" },
  ].filter(Boolean) as { label: string; color: string }[];

  if (flags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {flags.map((f) => (
        <Badge
          key={f.label}
          variant="outline"
          className={cn(
            "font-black tracking-widest text-[8px] uppercase px-1.5 py-0 h-4 border shadow-sm",
            f.color
          )}
        >
          {f.label}
        </Badge>
      ))}
    </div>
  );
}
