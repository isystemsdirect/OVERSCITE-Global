"use client";

/**
 * @fileOverview Drafting Artifact Panel — Drawing Intelligence Review Surface
 * @domain Inspections / Field Intelligence / Drafting & Design Intelligence
 * @phase Phase 4 — Domain Intelligence Activation
 *
 * Renders the LARI_DRAFTING analysis output for a drawing/document asset
 * within the Evidence lane contextual intelligence region.
 *
 * Displays:
 * - Sheet classification and discipline
 * - Title block extracted fields
 * - Symbol detection summary
 * - Dimension and note density
 * - GD&T feature control frames (structured)
 * - Drawing-to-field comparison readiness
 * - Fidelity warning (always shown for field photos)
 * - Partial-read truthfulness
 *
 * HARD RULES:
 * - Partial-read states must be explicit and truthful
 * - No CAD/BIM fidelity claim without validated source
 * - No design approval or compliance finality
 *
 * @see src/ai/flows/lari-drafting.ts
 * @see src/lib/contracts/drafting-artifact-contract.ts
 */

import { useState } from "react";
import {
  FileImage,
  ChevronDown,
  ChevronUp,
  Ruler,
  Hash,
  FileText,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ConfidenceBandBadge,
} from "@/components/inspections/recognition-truth-state-badge";
import type { ConfidenceBand, DraftingState } from "@/lib/constants/recognition-truth-states";

// ---------------------------------------------------------------------------
// Drafting Panel Data Type
// ---------------------------------------------------------------------------

export interface DraftingPanelData {
  drawingDetected: boolean;
  sheetType?: string;
  disciplineClass?: string;
  draftingState: DraftingState;
  fidelityWarning: 'field_photo_interpretation' | 'validated_source';
  titleBlockPresent: boolean;
  titleBlockFields?: Partial<{
    projectName: string;
    sheetNumber: string;
    revisionMarker: string;
    drawnBy: string;
    checkedBy: string;
    scale: string;
    date: string;
  }>;
  revisionMarkersPresent: boolean;
  symbolClassesDetected: { symbolCategory: string; confidence: ConfidenceBand; inActiveLibrary: boolean }[];
  dimensionContextDetected: { rawText: string; dimensionType?: string; confidence: ConfidenceBand }[];
  noteDensityProfile: { totalNotes: number; specNoteCount: number; standardRefCount: number };
  gdtDetected: boolean;
  gdtFrames: { characteristicSymbol: string; datumRefs: string[]; confidence: ConfidenceBand; interpretationNote: string }[];
  fieldComparisonReadiness: {
    isReadyForComparison: boolean;
    readinessScore: number;
    limitingFactors: string[];
    sheetNumber?: string;
    revisionLevel?: string;
  };
  drawingReviewPosture: 'no_review_required' | 'review_recommended' | 'review_required';
  overallConfidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Drafting State Labels
// ---------------------------------------------------------------------------

const DRAFTING_STATE_LABELS: Record<DraftingState, { label: string; color: string }> = {
  document_detected: { label: "Document Detected", color: "text-blue-400 border-blue-700" },
  sheet_structure_detected: { label: "Sheet Structure Detected", color: "text-emerald-400 border-emerald-700" },
  symbol_set_partial: { label: "Symbol Set Partial", color: "text-amber-400 border-amber-700" },
  dimension_context_partial: { label: "Dimension Context Partial", color: "text-amber-400 border-amber-700" },
  drawing_review_required: { label: "Drawing Review Required", color: "text-rose-400 border-rose-700" },
  no_drawing_present: { label: "No Drawing Present", color: "text-zinc-400 border-zinc-700" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DraftingArtifactPanel({ data }: { data: DraftingPanelData }) {
  const [symbolsExpanded, setSymbolsExpanded] = useState(false);
  const [dimensionsExpanded, setDimensionsExpanded] = useState(false);
  const [gdtExpanded, setGdtExpanded] = useState(false);

  if (!data.drawingDetected) return null;

  const stateStyle = DRAFTING_STATE_LABELS[data.draftingState];

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileImage className="h-3.5 w-3.5 text-sky-400" />
        <span className="text-[10px] font-black tracking-widest uppercase text-sky-400">
          Drawing Artifact Profile
        </span>
        <Badge variant="outline" className="text-[8px] font-bold px-1 h-3.5 bg-sky-950/20 border-sky-700 text-sky-400">
          LARI_DRAFTING
        </Badge>
      </div>

      {/* Fidelity Warning */}
      {data.fidelityWarning === 'field_photo_interpretation' && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 bg-amber-950/15 rounded-lg px-2 py-1 border border-amber-800/20">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          Field photo interpretation — confidence-qualified, NOT CAD/BIM fidelity
        </div>
      )}

      {/* Sheet Classification */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-0.5 bg-card/30 rounded-lg p-2 border border-border/20">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Sheet Type</span>
          <span className="text-xs font-semibold text-foreground capitalize">{data.sheetType ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-card/30 rounded-lg p-2 border border-border/20">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Discipline</span>
          <span className="text-xs font-semibold text-foreground capitalize">{data.disciplineClass ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-card/30 rounded-lg p-2 border border-border/20">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">State</span>
          <Badge variant="outline" className={cn("text-[8px] font-black px-1 h-3.5 w-fit", stateStyle.color)}>
            {stateStyle.label}
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5 bg-card/30 rounded-lg p-2 border border-border/20">
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Confidence</span>
          <ConfidenceBandBadge band={data.overallConfidence} />
        </div>
      </div>

      {/* Title Block */}
      {data.titleBlockPresent && data.titleBlockFields && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Title Block</span>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(data.titleBlockFields).filter(([, v]) => v).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0 bg-card/20 rounded px-2 py-1 border border-border/15">
                <span className="text-[8px] text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-[10px] font-medium text-foreground truncate">{value}</span>
              </div>
            ))}
          </div>
          {data.revisionMarkersPresent && (
            <Badge variant="outline" className="text-[8px] font-bold px-1 h-3.5 w-fit border-violet-700 text-violet-400">
              REVISION MARKERS PRESENT
            </Badge>
          )}
        </div>
      )}

      {/* Symbol Detection */}
      {data.symbolClassesDetected.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <button onClick={() => setSymbolsExpanded(!symbolsExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
            <Hash className="h-3 w-3" />
            Symbols ({data.symbolClassesDetected.length})
            {symbolsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {symbolsExpanded && (
            <div className="flex flex-col gap-1">
              {data.symbolClassesDetected.map((sym, i) => (
                <div key={i} className="flex items-center justify-between bg-card/20 rounded px-2 py-1 border border-border/15">
                  <span className="text-[10px] text-foreground capitalize">{sym.symbolCategory.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-1">
                    <ConfidenceBandBadge band={sym.confidence} />
                    {!sym.inActiveLibrary && (
                      <Badge variant="outline" className="text-[7px] px-0.5 h-3 border-orange-700 text-orange-400">UNKNOWN</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dimension Context */}
      {data.dimensionContextDetected.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <button onClick={() => setDimensionsExpanded(!dimensionsExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
            <Ruler className="h-3 w-3" />
            Dimensions ({data.dimensionContextDetected.length})
            {dimensionsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {dimensionsExpanded && (
            <div className="flex flex-col gap-1">
              {data.dimensionContextDetected.map((dim, i) => (
                <div key={i} className="flex items-center justify-between bg-card/20 rounded px-2 py-1 border border-border/15">
                  <span className="text-[10px] text-foreground font-mono">{dim.rawText}</span>
                  <div className="flex items-center gap-1">
                    {dim.dimensionType && (
                      <Badge variant="outline" className="text-[7px] px-0.5 h-3 border-zinc-700 text-zinc-400">{dim.dimensionType}</Badge>
                    )}
                    <ConfidenceBandBadge band={dim.confidence} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Density */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <FileText className="h-3 w-3" />
        <span>{data.noteDensityProfile.totalNotes} notes</span>
        <span>•</span>
        <span>{data.noteDensityProfile.specNoteCount} spec notes</span>
        <span>•</span>
        <span>{data.noteDensityProfile.standardRefCount} standard refs</span>
      </div>

      {/* GD&T */}
      {data.gdtDetected && data.gdtFrames.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <button onClick={() => setGdtExpanded(!gdtExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">
            <Layers className="h-3 w-3" />
            GD&T Frames ({data.gdtFrames.length})
            {gdtExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {gdtExpanded && (
            <div className="flex flex-col gap-1">
              {data.gdtFrames.map((frame, i) => (
                <div key={i} className="bg-violet-950/15 rounded px-2 py-1.5 border border-violet-800/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-violet-400">{frame.characteristicSymbol}</span>
                    <ConfidenceBandBadge band={frame.confidence} />
                  </div>
                  {frame.datumRefs.length > 0 && (
                    <span className="text-[9px] text-muted-foreground">Datums: {frame.datumRefs.join(', ')}</span>
                  )}
                  <span className="text-[9px] text-violet-400/60 italic">{frame.interpretationNote}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparison Readiness */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Field Comparison</span>
        <div className="flex items-center gap-2 bg-card/20 rounded-lg px-2 py-1.5 border border-border/15">
          {data.fieldComparisonReadiness.isReadyForComparison
            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            : <Circle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          }
          <div className="flex flex-col gap-0">
            <span className={cn(
              "text-[10px] font-bold",
              data.fieldComparisonReadiness.isReadyForComparison ? "text-emerald-400" : "text-zinc-400"
            )}>
              {data.fieldComparisonReadiness.isReadyForComparison ? 'Ready for Comparison' : 'Not Ready'}
            </span>
            <span className="text-[9px] text-muted-foreground">
              Score: {Math.round(data.fieldComparisonReadiness.readinessScore * 100)}%
              {data.fieldComparisonReadiness.sheetNumber && ` • Sheet: ${data.fieldComparisonReadiness.sheetNumber}`}
              {data.fieldComparisonReadiness.revisionLevel && ` • Rev: ${data.fieldComparisonReadiness.revisionLevel}`}
            </span>
          </div>
        </div>
        {data.fieldComparisonReadiness.limitingFactors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.fieldComparisonReadiness.limitingFactors.map((f, i) => (
              <Badge key={i} variant="outline" className="text-[7px] px-1 h-3 border-amber-700 text-amber-400">
                {f.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Review Posture */}
      {data.drawingReviewPosture !== 'no_review_required' && (
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] rounded-lg px-2 py-1 border",
          data.drawingReviewPosture === 'review_required'
            ? "text-rose-400 bg-rose-950/15 border-rose-800/20"
            : "text-amber-400 bg-amber-950/15 border-amber-800/20"
        )}>
          <Info className="h-3 w-3 shrink-0" />
          {data.drawingReviewPosture === 'review_required'
            ? 'Drawing review required — partial interpretation, human review needed'
            : 'Drawing review recommended — confidence is moderate'}
        </div>
      )}
    </div>
  );
}
