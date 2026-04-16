"use client";

/**
 * @fileOverview Evidence Lane — Phase 4 Domain Intelligence Activated Review Surface
 * @domain Inspections / Field Intelligence
 * @phase Phase 4 — LARI_DRAFTING + LARI_SITEOPS activated
 *
 * Renders the Evidence queue with:
 * - Real-time state subscription awareness
 * - BANE-gated verification and reanalysis actions
 * - Active domain filtering and prioritization
 * - Denied/blocked action rendering
 * - Observation/Identification separation
 * - Pass results, unknowns, visibility limits
 *
 * HARD RULES:
 * - accepted_unanalyzed must appear — never hidden
 * - No client-side direct verified_by_overscite assignment
 * - No verification action for accepted_unanalyzed or analysis_in_progress
 * - review_required is NEVER hidden by domain filtering
 * - Engine actors may never surface as authorized verification actors
 * - UI must show blocked/denied posture truthfully when BANE denies action
 * - Live UI may not claim a transition before persistence confirms it
 *
 * @see src/lib/services/recognition-governed-actions.ts
 * @see src/lib/constants/domain-awareness.ts
 * @see src/lib/hooks/use-evidence-subscription.ts
 */

import React, { useState, useCallback } from "react";
import {
  Microscope,
  ScanLine,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Circle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldOff,
  Layers,
  RotateCcw,
  Wifi,
  WifiOff,
  Filter,
  AlertTriangle,
  FileImage,
  Factory,
} from "lucide-react";
import { DraftingArtifactPanel, type DraftingPanelData } from "@/components/inspections/drafting-artifact-panel";
import { SiteopsPanel, type SiteopsPanelData } from "@/components/inspections/siteops-panel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MediaAnalysisStateBadge,
  ConfidenceBandBadge,
  RecognitionFlagRow,
} from "@/components/inspections/recognition-truth-state-badge";
import type {
  InspectionDomainClass,
  MediaAnalysisState,
  ConfidenceBand,
  RecognitionPassId,
} from "@/lib/constants/recognition-truth-states";
import {
  DOMAIN_MODE_LABELS,
  RECOGNITION_PASS_LABELS,
} from "@/lib/constants/recognition-truth-states";
import {
  DOMAIN_EXPANSION_REGISTRY,
  isDomainEngineActivated,
} from "@/lib/constants/domain-awareness";
import type { SubscriptionStatus } from "@/lib/hooks/use-evidence-subscription";

// ---------------------------------------------------------------------------
// Evidence Entry Type
// ---------------------------------------------------------------------------

export interface EvidenceEntry {
  id: string;
  name: string;
  assetType: "photo" | "drawing" | "document";
  mediaAnalysisState: MediaAnalysisState;
  domainClass?: InspectionDomainClass;
  hasLivingEntityOcclusion?: boolean;
  hasPestEvidence?: boolean;
  hasUnresolvedUnknowns?: boolean;
  hasVisibilityLimitations?: boolean;
  isDrawingArtifact?: boolean;
  confidence?: ConfidenceBand;
  findingsCount?: number;
  updatedAt: string;
  observedFindings?: string[];
  identifiedCandidates?: { label: string; confidence: ConfidenceBand }[];
  unknowns?: { reason: string; partialObservation?: string }[];
  visibilityLimits?: { targetDescription: string; visibilityState: string; cause: string }[];
  passResults?: Partial<Record<RecognitionPassId, {
    passStatus: string;
    passConfidenceBand: ConfidenceBand;
    observations: string[];
    candidates: { label: string; confidence: ConfidenceBand }[];
  }>>;
  recognitionPacketId?: string;
  analysisRequestedBy?: string;
  analysisRequestedAt?: string;
  reviewRequiredReason?: string;
  /** Phase 3: verification posture */
  verificationRequestedBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  /** Phase 3: BANE denial reason (rendered truthfully) */
  lastDenialReason?: string;
  /** Phase 4: LARI_DRAFTING panel data (drawing/document assets only) */
  draftingPanel?: DraftingPanelData;
  /** Phase 4: LARI_SITEOPS panel data (industrial/site/safety/insurance assets) */
  siteopsPanel?: SiteopsPanelData;
}

// ---------------------------------------------------------------------------
// Mock Evidence Queue
// ---------------------------------------------------------------------------

const MOCK_EVIDENCE_QUEUE: EvidenceEntry[] = [
  {
    id: "evd-001", name: "IMG_4821.jpg", assetType: "photo",
    mediaAnalysisState: "verified_by_overscite", domainClass: "residential",
    confidence: "high", findingsCount: 3, updatedAt: "2 hrs ago",
    analysisRequestedBy: "inspector_anderson", recognitionPacketId: "pkt-001",
    verifiedBy: "inspector_anderson", verifiedAt: "2026-04-14T19:30:00Z",
    observedFindings: [
      "Dark staining visible on ceiling surface in northwest corner",
      "Visible crack pattern along wall-to-ceiling junction",
      "Discoloration on drywall surface below window frame",
    ],
    identifiedCandidates: [
      { label: "Possible water intrusion from roof or plumbing above", confidence: "high" },
      { label: "Likely settlement crack at structural junction", confidence: "moderate" },
    ],
    passResults: {
      pass_1_scene: { passStatus: "complete", passConfidenceBand: "high", observations: ["Interior residential — bedroom"], candidates: [] },
      pass_7_condition_anomaly: { passStatus: "complete", passConfidenceBand: "high", observations: ["Dark staining on ceiling", "Crack at junction"], candidates: [{ label: "Water intrusion", confidence: "high" }] },
    },
  },
  {
    id: "evd-002", name: "IMG_4822.jpg", assetType: "photo",
    mediaAnalysisState: "analysis_complete", domainClass: "residential",
    confidence: "moderate", hasLivingEntityOcclusion: true, hasVisibilityLimitations: true,
    findingsCount: 1, updatedAt: "2 hrs ago",
    analysisRequestedBy: "inspector_anderson", recognitionPacketId: "pkt-002",
    observedFindings: ["White residue visible on foundation wall surface"],
    identifiedCandidates: [{ label: "Possible efflorescence from moisture migration", confidence: "moderate" }],
    visibilityLimits: [{ targetDescription: "Lower portion of foundation wall", visibilityState: "partially_visible", cause: "living_entity" }],
    passResults: {
      pass_3_living_entity: { passStatus: "complete", passConfidenceBand: "moderate", observations: ["Pet partially occluding lower wall"], candidates: [] },
      pass_7_condition_anomaly: { passStatus: "complete", passConfidenceBand: "moderate", observations: ["White residue on foundation wall"], candidates: [{ label: "Efflorescence", confidence: "moderate" }] },
    },
  },
  {
    id: "evd-003", name: "IMG_4823.jpg", assetType: "photo",
    mediaAnalysisState: "review_required", domainClass: "residential",
    hasUnresolvedUnknowns: true, hasPestEvidence: true, confidence: "review_required",
    findingsCount: 0, updatedAt: "3 hrs ago",
    reviewRequiredReason: "Unresolved unknowns and pest evidence detected — human review required",
    observedFindings: ["Dark particulate material on floor surface near baseboard"],
    identifiedCandidates: [{ label: "Possible pest droppings (rodent)", confidence: "low" }],
    unknowns: [{ reason: "insufficient_detail", partialObservation: "Small dark objects near HVAC duct — not classifiable" }],
  },
  {
    id: "evd-008", name: "IMG_4835.jpg", assetType: "photo",
    mediaAnalysisState: "verification_pending", domainClass: "commercial",
    confidence: "high", findingsCount: 2, updatedAt: "30 min ago",
    analysisRequestedBy: "inspector_anderson", recognitionPacketId: "pkt-008",
    verificationRequestedBy: "inspector_anderson",
    observedFindings: ["Fire extinguisher mounting bracket damaged", "Exit signage partially obscured"],
    identifiedCandidates: [{ label: "Possible code violation — fire extinguisher access", confidence: "high" }],
  },
  {
    id: "evd-004", name: "FloorPlan_A1.pdf", assetType: "drawing",
    mediaAnalysisState: "analysis_complete", domainClass: "drafting_design",
    isDrawingArtifact: true, confidence: "moderate", findingsCount: 0, updatedAt: "1 day ago",
    analysisRequestedBy: "inspector_anderson", recognitionPacketId: "pkt-004",
    observedFindings: ["Architectural floor plan with title block, gridlines, and dimension annotations"],
    identifiedCandidates: [{ label: "Detected as architectural floor plan", confidence: "moderate" }],
    passResults: {
      pass_8_drafting: { passStatus: "complete", passConfidenceBand: "moderate", observations: ["Title block detected", "Gridlines and dimension annotations present", "Revision cloud in NE corner"], candidates: [{ label: "Architectural floor plan — residential", confidence: "moderate" }] },
    },
    draftingPanel: {
      drawingDetected: true,
      sheetType: "architectural",
      disciplineClass: "architectural",
      draftingState: "sheet_structure_detected",
      fidelityWarning: "field_photo_interpretation",
      titleBlockPresent: true,
      titleBlockFields: {
        projectName: "Elm Street Residence",
        sheetNumber: "A-101",
        revisionMarker: "Rev. C",
        drawnBy: "JH",
        scale: "1/4\" = 1'-0\"",
        date: "2026-02-15",
      },
      revisionMarkersPresent: true,
      symbolClassesDetected: [
        { symbolCategory: "door_swing", confidence: "high", inActiveLibrary: true },
        { symbolCategory: "window_type_tag", confidence: "high", inActiveLibrary: true },
        { symbolCategory: "room_tag", confidence: "moderate", inActiveLibrary: true },
        { symbolCategory: "north_arrow", confidence: "high", inActiveLibrary: true },
        { symbolCategory: "grid_line_marker", confidence: "high", inActiveLibrary: true },
        { symbolCategory: "revision_cloud", confidence: "moderate", inActiveLibrary: true },
        { symbolCategory: "unknown_symbol", confidence: "low", inActiveLibrary: false },
      ],
      dimensionContextDetected: [
        { rawText: "12'-6\"", dimensionType: "linear", confidence: "high" },
        { rawText: "8'-0\"", dimensionType: "linear", confidence: "high" },
        { rawText: "3'-6\"", dimensionType: "linear", confidence: "moderate" },
      ],
      noteDensityProfile: { totalNotes: 8, specNoteCount: 3, standardRefCount: 1 },
      gdtDetected: false,
      gdtFrames: [],
      fieldComparisonReadiness: {
        isReadyForComparison: true,
        readinessScore: 0.78,
        limitingFactors: ["partial_view"],
        sheetNumber: "A-101",
        revisionLevel: "Rev. C",
      },
      drawingReviewPosture: "review_recommended",
      overallConfidence: "moderate",
    },
  },
  {
    id: "evd-009", name: "IMG_4840.jpg", assetType: "photo",
    mediaAnalysisState: "analysis_complete", domainClass: "industrial",
    confidence: "moderate", findingsCount: 4, updatedAt: "45 min ago",
    analysisRequestedBy: "inspector_anderson", recognitionPacketId: "pkt-009",
    observedFindings: [
      "Steel piping run with visible surface corrosion on elbow joint",
      "Flanged valve in closed position — no leakage visible",
      "Safety barrier partially displaced from original anchor point",
      "No PPE visible on worker in background",
    ],
    identifiedCandidates: [
      { label: "Possible corrosion degradation at pipe elbow — further inspection recommended", confidence: "moderate" },
      { label: "Possible safety barrier displacement — readiness affecting", confidence: "moderate" },
    ],
    visibilityLimits: [{ targetDescription: "Upper pipe run above 3m elevation", visibilityState: "angle_limited", cause: "angle" }],
    hasVisibilityLimitations: true,
    passResults: {
      pass_1_scene: { passStatus: "complete", passConfidenceBand: "high", observations: ["Industrial interior — mechanical room"], candidates: [] },
      pass_2_object: { passStatus: "complete", passConfidenceBand: "moderate", observations: ["Steel piping", "Flanged valve", "Safety barrier", "Worker"], candidates: [{ label: "Gate valve", confidence: "moderate" }] },
      pass_7_condition_anomaly: { passStatus: "complete", passConfidenceBand: "moderate", observations: ["Surface corrosion on pipe elbow", "Barrier displacement"], candidates: [{ label: "Corrosion degradation", confidence: "moderate" }] },
    },
    siteopsPanel: {
      enrichedDomain: "industrial",
      domainConfidence: "high",
      industrialEquipment: {
        equipmentObserved: true,
        observations: [
          { observation: "Steel piping run with flanged connections — elbow joint shows surface corrosion", category: "piping_valve", severity: "warning", confidence: "moderate" },
          { observation: "Gate valve in closed position — no active leakage observed", category: "piping_valve", severity: "observation_only", confidence: "high" },
          { observation: "Safety barrier partially displaced from floor anchor", category: "barrier_guard", severity: "warning", confidence: "moderate" },
        ],
        identifications: [
          { identification: "Possible external corrosion degradation at pipe elbow — material loss not assessable from image", category: "corrosion_leak", confidence: "moderate" },
        ],
      },
      siteState: {
        accessEgressAssessed: true,
        accessObservations: [{ observation: "Access pathway clear on ground level", severity: "observation_only", confidence: "high" }],
        debrisHousekeeping: [],
        barricadeStaging: [{ observation: "Safety barrier displaced — may affect controlled access to pipe run", severity: "warning", confidence: "moderate" }],
        weatherExposure: [],
        readinessAffecting: [{ observation: "Displaced barrier may need repositioning before next maintenance window", severity: "info", confidence: "moderate" }],
      },
      safetyPosture: {
        safetyAssessed: true,
        ppeObservations: [{ observation: "Worker visible in background without visible PPE", severity: "critical", confidence: "low" }],
        fallHazards: [],
        blockedExits: [],
        unsafeZones: [],
        signageControl: [],
      },
      insuranceEmphasis: {
        conditionDocumentation: [{ observation: "Pipe corrosion documented — supports condition assessment record", severity: "info", confidence: "moderate" }],
        lossRiskIndicators: [],
        claimSupportPosture: "partial_evidence",
      },
      domainVisibilityLimits: [{ targetDescription: "Upper pipe run above 3m", visibilityState: "angle_limited", cause: "angle" }],
      unresolvedElements: [],
      reviewRecommended: true,
      reviewReasons: ["PPE observation has low confidence — verify with site supervisor"],
      overallConfidence: "moderate",
    },
  },
  { id: "evd-005", name: "IMG_4830.jpg", assetType: "photo", mediaAnalysisState: "accepted_unanalyzed", updatedAt: "5 min ago" },
  { id: "evd-006", name: "IMG_4831.jpg", assetType: "photo", mediaAnalysisState: "accepted_unanalyzed", updatedAt: "5 min ago" },
  { id: "evd-007", name: "IMG_4832.jpg", assetType: "photo", mediaAnalysisState: "analysis_in_progress", updatedAt: "1 min ago" },
];

// ---------------------------------------------------------------------------
// Analysis State Icon
// ---------------------------------------------------------------------------

function AnalysisStateIcon({ state }: { state: MediaAnalysisState }) {
  switch (state) {
    case "verified_by_overscite":   return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "analysis_complete":       return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "analysis_in_progress":    return <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />;
    case "accepted_analysis_requested": return <Clock className="h-4 w-4 text-blue-400" />;
    case "review_required":         return <AlertCircle className="h-4 w-4 text-rose-400" />;
    case "verification_pending":    return <Clock className="h-4 w-4 text-violet-400" />;
    default:                        return <Circle className="h-4 w-4 text-zinc-600" />;
  }
}

// ---------------------------------------------------------------------------
// Pass Results Panel
// ---------------------------------------------------------------------------

const PassResultsPanel = React.memo(function PassResultsPanel({ entry, activeDomain }: { entry: EvidenceEntry; activeDomain: InspectionDomainClass }) {
  const [expanded, setExpanded] = useState(false);
  if (!entry.passResults) return null;

  const passEntries = Object.entries(entry.passResults) as [RecognitionPassId, NonNullable<EvidenceEntry["passResults"]>[RecognitionPassId]][];
  if (passEntries.length === 0) return null;

  // Sort by domain weight (higher weight = shown first)
  const domainMeta = DOMAIN_EXPANSION_REGISTRY[activeDomain];
  const sorted = [...passEntries].sort((a, b) => {
    const wA = domainMeta?.passWeights.find((w) => w.passId === a[0])?.weight ?? 0.5;
    const wB = domainMeta?.passWeights.find((w) => w.passId === b[0])?.weight ?? 0.5;
    return wB - wA;
  });

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        <Layers className="h-3 w-3" />
        Pass Results ({sorted.length})
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="flex flex-col gap-1.5 ml-1">
          {sorted.map(([passId, result]) => {
            if (!result) return null;
            const weight = domainMeta?.passWeights.find((w) => w.passId === passId)?.weight ?? 1.0;
            return (
              <div key={passId} className={cn(
                "bg-card/30 rounded-lg p-2 border border-border/20 transition-opacity",
                weight < 0.4 && "opacity-50"
              )}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-bold text-foreground">
                    {RECOGNITION_PASS_LABELS[passId] ?? passId}
                  </span>
                  <div className="flex items-center gap-1">
                    <ConfidenceBandBadge band={result.passConfidenceBand} />
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-black px-1 h-3.5 uppercase",
                      result.passStatus === "complete" && "border-emerald-700 text-emerald-400",
                      result.passStatus === "partial" && "border-amber-700 text-amber-400",
                      result.passStatus === "failed" && "border-rose-700 text-rose-400",
                      result.passStatus === "skipped" && "border-zinc-700 text-zinc-400"
                    )}>
                      {result.passStatus}
                    </Badge>
                  </div>
                </div>
                {result.observations.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {result.observations.map((obs, i) => (
                      <span key={i} className="text-[10px] text-muted-foreground leading-tight pl-2 border-l border-emerald-800/30">{obs}</span>
                    ))}
                  </div>
                )}
                {result.candidates.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {result.candidates.map((c, i) => (
                      <span key={i} className="text-[10px] text-amber-400/80 leading-tight pl-2 border-l border-amber-800/30 italic">{c.label} [{c.confidence}]</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Contextual Intelligence Region
// ---------------------------------------------------------------------------

const ContextualIntelligenceRegion = React.memo(function ContextualIntelligenceRegion({
  entry,
  activeDomain,
  onRequestAnalysis,
  onRequestVerification,
  onRequestReanalysis,
  analysisLoading,
  verificationLoading,
  reanalysisLoading,
}: {
  entry: EvidenceEntry | null;
  activeDomain: InspectionDomainClass;
  onRequestAnalysis: (entryId: string) => void;
  onRequestVerification: (entryId: string) => void;
  onRequestReanalysis: (entryId: string) => void;
  analysisLoading: boolean;
  verificationLoading: boolean;
  reanalysisLoading: boolean;
}) {
  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6 text-center">
        <Microscope className="h-8 w-8 text-muted-foreground/20" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">No asset selected</span>
          <span className="text-[11px] text-muted-foreground/60">
            Select a media asset from the evidence queue to view its recognition truth state and available actions.
          </span>
        </div>
      </div>
    );
  }

  const domainMeta = DOMAIN_EXPANSION_REGISTRY[activeDomain];
  const isHookOnly = !isDomainEngineActivated(activeDomain);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Asset Info */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-black text-foreground">{entry.name}</span>
        <MediaAnalysisStateBadge state={entry.mediaAnalysisState} />
        {entry.analysisRequestedBy && (
          <span className="text-[10px] text-muted-foreground/60 mt-0.5">
            Requested by: {entry.analysisRequestedBy}
          </span>
        )}
        {entry.verifiedBy && (
          <span className="text-[10px] text-emerald-400/70 mt-0.5">
            Verified by: {entry.verifiedBy} • {entry.verifiedAt ? new Date(entry.verifiedAt).toLocaleString() : ''}
          </span>
        )}
        {entry.verificationRequestedBy && entry.mediaAnalysisState === "verification_pending" && (
          <span className="text-[10px] text-violet-400/70 mt-0.5">
            Verification requested by: {entry.verificationRequestedBy}
          </span>
        )}
      </div>

      {/* Domain Engine Status */}
      {isHookOnly && entry.domainClass === activeDomain && (
        <div className="text-[10px] text-sky-400/80 bg-sky-950/15 rounded-lg px-2.5 py-1.5 border border-sky-800/20">
          <span className="font-bold">{domainMeta?.label}</span> domain uses base recognition passes.
          {domainMeta?.expectedEngine && (
            <span className="text-muted-foreground/60"> {domainMeta.expectedEngine}</span>
          )}
        </div>
      )}

      {/* Truth State Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Truth State</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Domain", value: entry.domainClass ? DOMAIN_MODE_LABELS[entry.domainClass] : "—" },
            { label: "Confidence", value: entry.confidence ?? "—" },
            { label: "Findings", value: String(entry.findingsCount ?? "—") },
            { label: "Asset Type", value: entry.assetType },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 bg-card/30 rounded-lg p-2.5 border border-border/20">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</span>
              <span className="text-xs font-semibold text-foreground capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Observed Findings */}
      {entry.observedFindings && entry.observedFindings.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Observed Conditions</span>
          <div className="flex flex-col gap-1">
            {entry.observedFindings.map((obs, i) => (
              <div key={i} className="text-[11px] text-foreground/90 bg-card/30 rounded-lg px-2.5 py-1.5 border border-border/20 leading-tight border-l-2 border-l-emerald-600">{obs}</div>
            ))}
          </div>
        </div>
      )}

      {/* System Identification */}
      {entry.identifiedCandidates && entry.identifiedCandidates.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">System Identification</span>
          <div className="flex flex-col gap-1">
            {entry.identifiedCandidates.map((cand, i) => (
              <div key={i} className="text-[11px] text-amber-400/90 bg-amber-950/15 rounded-lg px-2.5 py-1.5 border border-amber-800/20 leading-tight border-l-2 border-l-amber-600 italic">
                <span>{cand.label}</span>
                <ConfidenceBandBadge band={cand.confidence} className="ml-1.5 inline-flex align-text-bottom" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unknowns */}
      {entry.unknowns && entry.unknowns.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-orange-500">Unresolved Unknowns</span>
          <div className="flex flex-col gap-1">
            {entry.unknowns.map((unk, i) => (
              <div key={i} className="text-[11px] text-orange-400/90 bg-orange-950/15 rounded-lg px-2.5 py-1.5 border border-orange-800/20 leading-tight">
                <span className="font-bold capitalize">{unk.reason.replace(/_/g, " ")}:</span>{" "}
                {unk.partialObservation || "No partial observation available"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visibility Limits */}
      {entry.visibilityLimits && entry.visibilityLimits.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-widest uppercase text-violet-500">Visibility Limits</span>
          <div className="flex flex-col gap-1">
            {entry.visibilityLimits.map((vis, i) => (
              <div key={i} className="text-[11px] text-violet-400/90 bg-violet-950/15 rounded-lg px-2.5 py-1.5 border border-violet-800/20 leading-tight">
                <span className="font-bold">{vis.targetDescription}</span> — {vis.visibilityState.replace(/_/g, " ")} ({vis.cause.replace(/_/g, " ")})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      <RecognitionFlagRow
        hasLivingEntityOcclusion={entry.hasLivingEntityOcclusion}
        hasPestEvidence={entry.hasPestEvidence}
        hasUnresolvedUnknowns={entry.hasUnresolvedUnknowns}
        hasVisibilityLimitations={entry.hasVisibilityLimitations}
        isDrawingArtifact={entry.isDrawingArtifact}
      />

      {/* Review Reason */}
      {entry.mediaAnalysisState === "review_required" && entry.reviewRequiredReason && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest uppercase text-rose-500">Review Reason</span>
          <div className="text-[11px] text-rose-400/90 bg-rose-950/15 rounded-lg px-2.5 py-1.5 border border-rose-800/20">{entry.reviewRequiredReason}</div>
        </div>
      )}

      {/* BANE Denial Banner */}
      {entry.lastDenialReason && (
        <div className="flex items-center gap-2 text-[11px] text-rose-400/80 bg-rose-950/15 rounded-lg px-2.5 py-1.5 border border-rose-800/20">
          <ShieldOff className="h-3.5 w-3.5 shrink-0" />
          <span>BANE Denied: {entry.lastDenialReason}</span>
        </div>
      )}

      {/* Phase 4: LARI_DRAFTING Panel */}
      {entry.draftingPanel && (
        <div className="border-t border-sky-800/20 pt-3">
          <DraftingArtifactPanel data={entry.draftingPanel} />
        </div>
      )}

      {/* Phase 4: LARI_SITEOPS Panel */}
      {entry.siteopsPanel && (
        <div className="border-t border-orange-800/20 pt-3">
          <SiteopsPanel data={entry.siteopsPanel} />
        </div>
      )}

      {/* Engine Status Indicators */}
      {entry.isDrawingArtifact && (
        <div className="flex items-center gap-1.5 text-[9px] bg-sky-950/10 rounded px-2 py-1 border border-sky-800/15">
          <FileImage className="h-3 w-3 text-sky-400" />
          <span className="text-sky-400 font-bold">LARI_DRAFTING</span>
          <span className="text-sky-400/60">{entry.draftingPanel ? 'ACTIVE' : 'AVAILABLE'}</span>
        </div>
      )}
      {(entry.domainClass === 'industrial' || entry.domainClass === 'site' || entry.domainClass === 'safety' || entry.domainClass === 'insurance') && (
        <div className="flex items-center gap-1.5 text-[9px] bg-orange-950/10 rounded px-2 py-1 border border-orange-800/15">
          <Factory className="h-3 w-3 text-orange-400" />
          <span className="text-orange-400 font-bold">LARI_SITEOPS</span>
          <span className="text-orange-400/60">{entry.siteopsPanel ? 'ACTIVE' : 'AVAILABLE'}</span>
        </div>
      )}

      {/* Pass Results */}
      <PassResultsPanel entry={entry} activeDomain={activeDomain} />

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-border/20">
        {/* Request Analysis — only accepted_unanalyzed */}
        {entry.mediaAnalysisState === "accepted_unanalyzed" && (
          <Button size="sm" className="w-full gap-2 h-8 text-xs font-bold" id={`request-analysis-${entry.id}`}
            onClick={() => onRequestAnalysis(entry.id)} disabled={analysisLoading}>
            {analysisLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanLine className="h-3.5 w-3.5" />}
            {analysisLoading ? "Requesting..." : "Request Analysis"}
          </Button>
        )}

        {/* Request Verification — only analysis_complete */}
        {entry.mediaAnalysisState === "analysis_complete" && (
          <Button size="sm" variant="outline" className="w-full gap-2 h-8 text-xs font-bold" id={`request-verification-${entry.id}`}
            onClick={() => onRequestVerification(entry.id)} disabled={verificationLoading}>
            {verificationLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {verificationLoading ? "Requesting..." : "Request Verification"}
          </Button>
        )}

        {/* Verification Pending state */}
        {entry.mediaAnalysisState === "verification_pending" && (
          <div className="flex items-center gap-2 text-xs text-violet-400 bg-violet-950/15 rounded-lg px-2.5 py-2 border border-violet-800/20">
            <Clock className="h-3.5 w-3.5 animate-pulse shrink-0" />
            <span className="font-bold">Verification Pending</span> — awaiting human authority review
          </div>
        )}

        {/* Verified state */}
        {entry.mediaAnalysisState === "verified_by_overscite" && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/15 rounded-lg px-2.5 py-2 border border-emerald-800/20">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="font-bold">Verified by OVERSCITE</span>
          </div>
        )}

        {/* Review Required */}
        {entry.mediaAnalysisState === "review_required" && (
          <Button size="sm" variant="outline" className="w-full gap-2 h-8 text-xs font-bold border-rose-700 text-rose-400 hover:bg-rose-950/20" id={`open-review-${entry.id}`}>
            <AlertCircle className="h-3.5 w-3.5" />
            Open Review
          </Button>
        )}

        {/* Reanalysis — analysis_complete, review_required, or verified_by_overscite */}
        {(entry.mediaAnalysisState === "analysis_complete" || entry.mediaAnalysisState === "review_required" || entry.mediaAnalysisState === "verified_by_overscite") && (
          <Button size="sm" variant="ghost" className="w-full gap-2 h-7 text-[10px] font-bold text-muted-foreground hover:text-foreground" id={`request-reanalysis-${entry.id}`}
            onClick={() => onRequestReanalysis(entry.id)} disabled={reanalysisLoading}>
            {reanalysisLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
            {reanalysisLoading ? "Requesting..." : "Request Reanalysis"}
          </Button>
        )}

        {/* Not eligible for actions banner */}
        {entry.mediaAnalysisState === "analysis_in_progress" && (
          <div className="text-[10px] text-muted-foreground/60 text-center py-1">
            Analysis in progress — actions available after completion
          </div>
        )}

        {entry.recognitionPacketId && (
          <span className="text-[9px] text-muted-foreground/40 font-mono text-center truncate">Packet: {entry.recognitionPacketId}</span>
        )}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Evidence Lane Component — Exported
// ---------------------------------------------------------------------------

interface EvidenceLaneProps {
  activeDomain: InspectionDomainClass;
  subscriptionStatus?: SubscriptionStatus;
}

export function EvidenceLane({ activeDomain, subscriptionStatus = 'idle' }: EvidenceLaneProps) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [reanalysisLoading, setReanalysisLoading] = useState(false);
  const [evidenceQueue, setEvidenceQueue] = useState<EvidenceEntry[]>(MOCK_EVIDENCE_QUEUE);
  const [domainFilter, setDomainFilter] = useState(false);

  // Domain-aware filtering: prioritize matching domain, never hide review_required
  const filteredQueue = domainFilter
    ? evidenceQueue.filter((e) =>
        e.domainClass === activeDomain
        || e.mediaAnalysisState === 'review_required'
        || e.mediaAnalysisState === 'accepted_unanalyzed'
        || !e.domainClass
      )
    : evidenceQueue;

  const unanalyzedCount = filteredQueue.filter((e) => e.mediaAnalysisState === "accepted_unanalyzed").length;
  const reviewCount = filteredQueue.filter((e) => e.mediaAnalysisState === "review_required").length;

  const selectedEntryData = selectedEntry ? filteredQueue.find((e) => e.id === selectedEntry) ?? null : null;

  const handleRequestAnalysis = useCallback(async (entryId: string) => {
    setAnalysisLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setEvidenceQueue((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, mediaAnalysisState: "accepted_analysis_requested" as MediaAnalysisState, analysisRequestedBy: "current_user", analysisRequestedAt: new Date().toISOString() } : e
      ));
      setTimeout(() => {
        setEvidenceQueue((prev) => prev.map((e) =>
          e.id === entryId && e.mediaAnalysisState === "accepted_analysis_requested" ? { ...e, mediaAnalysisState: "analysis_in_progress" as MediaAnalysisState } : e
        ));
      }, 2000);
    } finally { setAnalysisLoading(false); }
  }, []);

  const handleRequestVerification = useCallback(async (entryId: string) => {
    setVerificationLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setEvidenceQueue((prev) => prev.map((e) =>
        e.id === entryId && e.mediaAnalysisState === "analysis_complete"
          ? { ...e, mediaAnalysisState: "verification_pending" as MediaAnalysisState, verificationRequestedBy: "current_user" }
          : e
      ));
    } finally { setVerificationLoading(false); }
  }, []);

  const handleRequestReanalysis = useCallback(async (entryId: string) => {
    setReanalysisLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setEvidenceQueue((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, mediaAnalysisState: "accepted_unanalyzed" as MediaAnalysisState, recognitionPacketId: undefined, observedFindings: undefined, identifiedCandidates: undefined, passResults: undefined } : e
      ));
    } finally { setReanalysisLoading(false); }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full gap-0 min-h-[500px]">
      {/* Evidence Queue */}
      <div className="flex flex-col flex-1 min-w-0 border-r border-border/20">
        {/* Queue Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border/20 bg-card/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-muted-foreground">Evidence Queue</span>
            {unanalyzedCount > 0 && (
              <Badge variant="outline" className="text-[9px] font-black px-1.5 h-4 border-zinc-600 text-zinc-400">{unanalyzedCount} UNANALYZED</Badge>
            )}
            {reviewCount > 0 && (
              <Badge variant="outline" className="text-[9px] font-black px-1.5 h-4 border-rose-700 text-rose-400">{reviewCount} REVIEW</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Domain filter toggle */}
            <Button variant={domainFilter ? "default" : "ghost"} size="icon" className={cn("h-6 w-6", domainFilter && "bg-primary/20")}
              title={`Filter to ${DOMAIN_MODE_LABELS[activeDomain]} domain`}
              onClick={() => setDomainFilter(!domainFilter)}>
              <Filter className="h-3.5 w-3.5" />
            </Button>
            {/* Live status */}
            <div className={cn(
              "flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.5 rounded-full",
              subscriptionStatus === 'live' && "bg-emerald-950/30 text-emerald-400",
              subscriptionStatus === 'degraded' && "bg-amber-950/30 text-amber-400",
              (subscriptionStatus === 'idle' || subscriptionStatus === 'offline') && "bg-zinc-800/30 text-zinc-500"
            )}>
              {subscriptionStatus === 'live' ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Upload media">
              <Upload className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Queue Items */}
        <div className="flex flex-col divide-y divide-border/10 overflow-y-auto">
          {filteredQueue.map((entry) => (
            <button key={entry.id} id={`evidence-entry-${entry.id}`}
              onClick={() => setSelectedEntry(entry.id === selectedEntry ? null : entry.id)}
              className={cn(
                "flex flex-col gap-1.5 px-4 py-3 text-left hover:bg-accent/10 transition-colors",
                selectedEntry === entry.id && "bg-accent/15 border-l-2 border-l-primary"
              )}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AnalysisStateIcon state={entry.mediaAnalysisState} />
                  <span className="text-xs font-medium text-foreground truncate">{entry.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0">{entry.updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap ml-6">
                <MediaAnalysisStateBadge state={entry.mediaAnalysisState} showDot={false} />
                {entry.confidence && entry.mediaAnalysisState !== "accepted_unanalyzed" && (
                  <ConfidenceBandBadge band={entry.confidence} />
                )}
                {entry.findingsCount !== undefined && entry.findingsCount > 0 && (
                  <Badge variant="outline" className="text-[9px] font-black px-1.5 h-4 border-zinc-600 text-zinc-400">{entry.findingsCount} FINDINGS</Badge>
                )}
                {entry.domainClass && entry.domainClass !== activeDomain && domainFilter && (
                  <Badge variant="outline" className="text-[8px] font-bold px-1 h-3.5 border-sky-700 text-sky-400">CROSS-DOMAIN</Badge>
                )}
              </div>
              <RecognitionFlagRow
                hasLivingEntityOcclusion={entry.hasLivingEntityOcclusion} hasPestEvidence={entry.hasPestEvidence}
                hasUnresolvedUnknowns={entry.hasUnresolvedUnknowns} hasVisibilityLimitations={entry.hasVisibilityLimitations}
                isDrawingArtifact={entry.isDrawingArtifact} className="ml-6" />
            </button>
          ))}
        </div>
      </div>

      {/* Contextual Intelligence Region */}
      <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col bg-card/10">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/20 bg-card/20">
          <Microscope className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-black tracking-widest uppercase text-muted-foreground">Intelligence Region</span>
        </div>
        <ContextualIntelligenceRegion
          entry={selectedEntryData} activeDomain={activeDomain}
          onRequestAnalysis={handleRequestAnalysis} onRequestVerification={handleRequestVerification}
          onRequestReanalysis={handleRequestReanalysis}
          analysisLoading={analysisLoading} verificationLoading={verificationLoading} reanalysisLoading={reanalysisLoading}
        />
      </div>
    </div>
  );
}
