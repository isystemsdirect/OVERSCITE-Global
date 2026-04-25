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
 * - No client-side direct verified_by_SCINGULAR assignment
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

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useEvidenceSubscription } from "@/lib/hooks/use-evidence-subscription";
import { getRecognitionPacket } from "@/lib/services/recognition-persistence-service";
import { requestAnalysis, type RequestAnalysisInput } from "@/lib/services/recognition-orchestration";
import { requestVerification, requestReanalysis } from "@/lib/services/recognition-governed-actions";
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
  mediaState: MediaAnalysisState;
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
// Real-time Evidence Queue Hydration
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Analysis State Icon
// ---------------------------------------------------------------------------

function AnalysisStateIcon({ state }: { state: MediaAnalysisState }) {
  switch (state) {
    case "verified_by_SCINGULAR":   return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
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
        <MediaAnalysisStateBadge state={entry.mediaState} />
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
        {entry.verificationRequestedBy && entry.mediaState === "verification_pending" && (
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
      {entry.mediaState === "review_required" && entry.reviewRequiredReason && (
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
        {entry.mediaState === "accepted_unanalyzed" && (
          <Button size="sm" className="w-full gap-2 h-8 text-xs font-bold" id={`request-analysis-${entry.id}`}
            onClick={() => onRequestAnalysis(entry.id)} disabled={analysisLoading}>
            {analysisLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanLine className="h-3.5 w-3.5" />}
            {analysisLoading ? "Requesting..." : "Request Analysis"}
          </Button>
        )}

        {/* Request Verification — only analysis_complete */}
        {entry.mediaState === "analysis_complete" && (
          <Button size="sm" variant="outline" className="w-full gap-2 h-8 text-xs font-bold" id={`request-verification-${entry.id}`}
            onClick={() => onRequestVerification(entry.id)} disabled={verificationLoading}>
            {verificationLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {verificationLoading ? "Requesting..." : "Request Verification"}
          </Button>
        )}

        {/* Verification Pending state */}
        {entry.mediaState === "verification_pending" && (
          <div className="flex items-center gap-2 text-xs text-violet-400 bg-violet-950/15 rounded-lg px-2.5 py-2 border border-violet-800/20">
            <Clock className="h-3.5 w-3.5 animate-pulse shrink-0" />
            <span className="font-bold">Verification Pending</span> — awaiting human authority review
          </div>
        )}

        {/* Verified state */}
        {entry.mediaState === "verified_by_SCINGULAR" && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/15 rounded-lg px-2.5 py-2 border border-emerald-800/20">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="font-bold">Verified by SCINGULAR</span>
          </div>
        )}

        {/* Review Required */}
        {entry.mediaState === "review_required" && (
          <Button size="sm" variant="outline" className="w-full gap-2 h-8 text-xs font-bold border-rose-700 text-rose-400 hover:bg-rose-950/20" id={`open-review-${entry.id}`}>
            <AlertCircle className="h-3.5 w-3.5" />
            Open Review
          </Button>
        )}

        {/* Reanalysis — analysis_complete, review_required, or verified_by_SCINGULAR */}
        {(entry.mediaState === "analysis_complete" || entry.mediaState === "review_required" || entry.mediaState === "verified_by_SCINGULAR") && (
          <Button size="sm" variant="ghost" className="w-full gap-2 h-7 text-[10px] font-bold text-muted-foreground hover:text-foreground" id={`request-reanalysis-${entry.id}`}
            onClick={() => onRequestReanalysis(entry.id)} disabled={reanalysisLoading}>
            {reanalysisLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
            {reanalysisLoading ? "Requesting..." : "Request Reanalysis"}
          </Button>
        )}

        {/* Not eligible for actions banner */}
        {entry.mediaState === "analysis_in_progress" && (
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
  inspectionId?: string | null;
  subscriptionStatus?: SubscriptionStatus;
}

export function EvidenceLane({ activeDomain, inspectionId, subscriptionStatus: propSubscriptionStatus }: EvidenceLaneProps) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [reanalysisLoading, setReanalysisLoading] = useState(false);
  const [domainFilter, setDomainFilter] = useState(false);

  // Live Subscription
  const { evidenceStates, status: subStatus } = useEvidenceSubscription(inspectionId ?? null);
  const subscriptionStatus = propSubscriptionStatus && propSubscriptionStatus !== 'idle' ? propSubscriptionStatus : subStatus;

  // Local state to hold hydrated queue entries
  const [evidenceQueue, setEvidenceQueue] = useState<EvidenceEntry[]>([]);
  const packetCacheRef = useRef<Record<string, any>>({});

  // Hydrate evidence states into EvidenceEntry artifacts for UI display
  useEffect(() => {
    let isMounted = true;
    
    const hydrateQueue = async () => {
      const hydrated: EvidenceEntry[] = [];
      
      for (const state of evidenceStates) {
        let entry: EvidenceEntry = {
          id: state.stateId,
          name: `Asset ${state.mediaAssetId.substring(0, 8)}`,
          assetType: 'photo',
          mediaState: state.mediaState,
          updatedAt: state.updatedAt ? new Date(state.updatedAt).toLocaleString() : 'Just now',
          analysisRequestedBy: state.analysisRequestedBy,
          analysisRequestedAt: state.analysisRequestedAt,
          recognitionPacketId: state.recognitionPacketId,
          reviewRequiredReason: state.reviewRequiredReason,
          verificationRequestedBy: (state as any).verificationRequestedBy,
          verifiedBy: state.verifiedBy,
          verifiedAt: state.verifiedAt,
        };

        if (state.recognitionPacketId) {
          let packet = packetCacheRef.current[state.recognitionPacketId];
          if (!packet) {
            try {
              packet = await getRecognitionPacket(state.recognitionPacketId);
              if (packet && isMounted) {
                packetCacheRef.current[state.recognitionPacketId] = packet;
              }
            } catch (err) {
              console.error("[EVIDENCE_LANE] Hydration failed for packet:", state.recognitionPacketId, err);
            }
          }

          if (packet) {
            entry.domainClass = packet.domainClass;
            entry.confidence = packet.confidenceProfile?.overall;
            entry.findingsCount = packet.observedFindings?.length;
            entry.hasLivingEntityOcclusion = packet.livingEntities?.some((e: any) => e.causesOcclusion);
            entry.hasPestEvidence = packet.pestEvidence?.length > 0;
            entry.hasUnresolvedUnknowns = packet.confidenceProfile?.unresolvedUnknowns;
            entry.hasVisibilityLimitations = packet.confidenceProfile?.occlusionImpact;
            entry.isDrawingArtifact = packet.sceneContext?.isDrawingArtifact;
            entry.observedFindings = packet.observedFindings;
            entry.identifiedCandidates = packet.identifiedCandidates;
            entry.unknowns = packet.unknowns;
            entry.visibilityLimits = packet.visibilityLimits;
            entry.passResults = packet.passResults;
            
            if (packet.draftingArtifact) {
              entry.assetType = 'drawing';
            }
          }
        }
        
        hydrated.push(entry);
      }

      if (isMounted) {
        setEvidenceQueue(hydrated);
      }
    };

    hydrateQueue();

    return () => { isMounted = false; };
  }, [evidenceStates]);

  // Domain-aware filtering: prioritize matching domain, never hide review_required
  let filteredQueue = domainFilter
    ? evidenceQueue.filter((e) =>
        e.domainClass === activeDomain
        || e.mediaState === 'review_required'
        || e.mediaState === 'accepted_unanalyzed'
        || !e.domainClass
      )
    : evidenceQueue;

  // Render something if no items found in the inspection
  if (!inspectionId) {
    filteredQueue = [];
  }

  const unanalyzedCount = filteredQueue.filter((e) => e.mediaState === "accepted_unanalyzed").length;
  const reviewCount = filteredQueue.filter((e) => e.mediaState === "review_required").length;

  const selectedEntryData = selectedEntry ? filteredQueue.find((e) => e.id === selectedEntry) ?? null : null;

  const handleRequestAnalysis = useCallback(async (entryId: string) => {
    setAnalysisLoading(true);
    try {
      const state = evidenceStates.find(s => s.stateId === entryId);
      if (!state) return;

      const payload: RequestAnalysisInput = {
        mediaAssetId: state.mediaAssetId,
        mediaDataUri: 'placeholder_for_now',
        mediaMimeType: 'image/jpeg',
        inspectionId: state.inspectionId,
        projectId: 'project-1',
        siteId: 'site-1',
        requestedBy: 'current_user',
        requestedAt: new Date().toISOString(),
        domainHint: activeDomain,
        analysisTier: 'standard',
      };

      const res = await requestAnalysis(payload);
      if (!res.success) {
        console.error("[EVIDENCE_LANE] Request analysis failed:", res.error);
        // Toast or Error message could be shown here.
      }
    } finally { setAnalysisLoading(false); }
  }, [evidenceStates, activeDomain]);

  const handleRequestVerification = useCallback(async (entryId: string) => {
    setVerificationLoading(true);
    try {
      if (!inspectionId) return;
      const state = evidenceStates.find(s => s.stateId === entryId);
      if (!state) return;

      const res = await requestVerification({
        mediaAssetId: state.mediaAssetId,
        inspectionId: inspectionId,
        requestedBy: 'current_user',
      });
      
      if (!res.success) {
        console.error("[EVIDENCE_LANE] Verification request denied/failed:", res.error);
      }
    } finally { setVerificationLoading(false); }
  }, [evidenceStates, inspectionId]);

  const handleRequestReanalysis = useCallback(async (entryId: string) => {
    setReanalysisLoading(true);
    try {
      if (!inspectionId) return;
      const state = evidenceStates.find(s => s.stateId === entryId);
      if (!state) return;

      const res = await requestReanalysis({
        mediaAssetId: state.mediaAssetId,
        inspectionId: inspectionId,
        requestedBy: 'current_user',
        reason: 'User requested manual reanalysis',
      });
      
      if (!res.success) {
        console.error("[EVIDENCE_LANE] Reanalysis request denied/failed:", res.error);
      }
    } finally { setReanalysisLoading(false); }
  }, [evidenceStates, inspectionId]);

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
                  <AnalysisStateIcon state={entry.mediaState} />
                  <span className="text-xs font-medium text-foreground truncate">{entry.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0">{entry.updatedAt}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap ml-6">
                <MediaAnalysisStateBadge state={entry.mediaState} showDot={false} />
                {entry.confidence && entry.mediaState !== "accepted_unanalyzed" && (
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
