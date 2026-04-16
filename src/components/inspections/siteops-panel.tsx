"use client";

/**
 * @fileOverview SiteOps Domain Panel — Site/Industrial/Safety Intelligence Surface
 * @domain Inspections / Field Intelligence / Site-State Intelligence
 * @phase Phase 4 — Domain Intelligence Activation
 *
 * Renders LARI_SITEOPS enrichment output for industrial/site/safety/insurance
 * domain assets within the Evidence lane contextual intelligence region.
 *
 * Displays:
 * - Industrial equipment observations and identifications
 * - Site state: access/egress, debris, barricades, weather
 * - Safety posture: PPE, fall hazards, blocked exits, unsafe zones
 * - Insurance/risk emphasis and claim-support posture
 * - Domain-specific visibility limits
 * - Unresolved elements
 *
 * HARD RULES:
 * - All outputs are observational/identification, not legal-final
 * - Insurance/risk emphasis is evidentiary, not compliance-final
 * - No hide of base recognition truth-state behind domain chrome
 * - Visibility limits remain visible
 *
 * @see src/ai/flows/lari-siteops.ts
 * @see src/lib/contracts/siteops-enrichment-contract.ts
 */

import { useState } from "react";
import {
  Factory,
  HardHat,
  ShieldAlert,
  FileBarChart,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ConfidenceBandBadge,
} from "@/components/inspections/recognition-truth-state-badge";
import type { ConfidenceBand, InspectionDomainClass } from "@/lib/constants/recognition-truth-states";

// ---------------------------------------------------------------------------
// SiteOps Panel Data Type
// ---------------------------------------------------------------------------

export interface SiteopsPanelData {
  enrichedDomain: InspectionDomainClass;
  domainConfidence: ConfidenceBand;
  industrialEquipment: {
    equipmentObserved: boolean;
    observations: { observation: string; category: string; severity: string; confidence: ConfidenceBand }[];
    identifications: { identification: string; category: string; confidence: ConfidenceBand }[];
  };
  siteState: {
    accessEgressAssessed: boolean;
    accessObservations: { observation: string; severity: string; confidence: ConfidenceBand }[];
    debrisHousekeeping: { observation: string; severity: string; confidence: ConfidenceBand }[];
    barricadeStaging: { observation: string; severity: string; confidence: ConfidenceBand }[];
    weatherExposure: { observation: string; severity: string; confidence: ConfidenceBand }[];
    readinessAffecting: { observation: string; severity: string; confidence: ConfidenceBand }[];
  };
  safetyPosture: {
    safetyAssessed: boolean;
    ppeObservations: { observation: string; severity: string; confidence: ConfidenceBand }[];
    fallHazards: { observation: string; severity: string; confidence: ConfidenceBand }[];
    blockedExits: { observation: string; severity: string; confidence: ConfidenceBand }[];
    unsafeZones: { observation: string; severity: string; confidence: ConfidenceBand }[];
    signageControl: { observation: string; severity: string; confidence: ConfidenceBand }[];
  };
  insuranceEmphasis: {
    conditionDocumentation: { observation: string; severity: string; confidence: ConfidenceBand }[];
    lossRiskIndicators: { observation: string; severity: string; confidence: ConfidenceBand }[];
    claimSupportPosture: string;
  };
  domainVisibilityLimits: { targetDescription: string; visibilityState: string; cause: string }[];
  unresolvedElements: { description: string; reason: string }[];
  reviewRecommended: boolean;
  reviewReasons: string[];
  overallConfidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Severity Styles
// ---------------------------------------------------------------------------

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-rose-500 bg-rose-950/15 text-rose-400",
  warning: "border-l-amber-500 bg-amber-950/15 text-amber-400",
  info: "border-l-blue-500 bg-blue-950/15 text-blue-400",
  observation_only: "border-l-zinc-600 bg-card/20 text-foreground/80",
};

// ---------------------------------------------------------------------------
// Observation List
// ---------------------------------------------------------------------------

function ObservationList({ items, title, icon: Icon }: {
  items: { observation: string; severity: string; confidence: ConfidenceBand }[];
  title: string;
  icon: React.ElementType;
}) {
  const [expanded, setExpanded] = useState(items.length <= 3);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
        <Icon className="h-3 w-3" />
        {title} ({items.length})
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <div key={i} className={cn(
              "text-[10px] rounded-lg px-2 py-1 border border-border/15 leading-tight border-l-2",
              SEVERITY_STYLES[item.severity] ?? SEVERITY_STYLES.observation_only
            )}>
              <div className="flex items-center justify-between gap-2">
                <span>{item.observation}</span>
                <ConfidenceBandBadge band={item.confidence} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SiteopsPanel({ data }: { data: SiteopsPanelData }) {
  const hasIndustrial = data.industrialEquipment.equipmentObserved;
  const hasSite = data.siteState.accessEgressAssessed;
  const hasSafety = data.safetyPosture.safetyAssessed;
  const hasInsurance = data.insuranceEmphasis.conditionDocumentation.length > 0 || data.insuranceEmphasis.lossRiskIndicators.length > 0;

  if (!hasIndustrial && !hasSite && !hasSafety && !hasInsurance) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Factory className="h-3.5 w-3.5 text-orange-400" />
        <span className="text-[10px] font-black tracking-widest uppercase text-orange-400">
          SiteOps Domain Summary
        </span>
        <Badge variant="outline" className="text-[8px] font-bold px-1 h-3.5 bg-orange-950/20 border-orange-700 text-orange-400">
          LARI_SITEOPS
        </Badge>
        <ConfidenceBandBadge band={data.overallConfidence} />
      </div>

      {/* Industrial Equipment */}
      {hasIndustrial && (
        <>
          <ObservationList
            items={data.industrialEquipment.observations}
            title="Equipment Observations"
            icon={Factory}
          />
          {data.industrialEquipment.identifications.length > 0 && (
            <div className="flex flex-col gap-1">
              {data.industrialEquipment.identifications.map((id, i) => (
                <div key={i} className="text-[10px] text-amber-400/80 bg-amber-950/15 rounded-lg px-2 py-1 border border-amber-800/20 border-l-2 border-l-amber-500 italic leading-tight">
                  {id.identification}
                  <ConfidenceBandBadge band={id.confidence} className="ml-1 inline-flex" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Site State */}
      {hasSite && (
        <>
          <ObservationList items={data.siteState.accessObservations} title="Access / Egress" icon={Eye} />
          <ObservationList items={data.siteState.debrisHousekeeping} title="Debris / Housekeeping" icon={AlertTriangle} />
          <ObservationList items={data.siteState.barricadeStaging} title="Barricades / Staging" icon={HardHat} />
          <ObservationList items={data.siteState.weatherExposure} title="Weather Exposure" icon={AlertTriangle} />
          <ObservationList items={data.siteState.readinessAffecting} title="Readiness Affecting" icon={AlertTriangle} />
        </>
      )}

      {/* Safety Posture */}
      {hasSafety && (
        <>
          <ObservationList items={data.safetyPosture.ppeObservations} title="PPE" icon={HardHat} />
          <ObservationList items={data.safetyPosture.fallHazards} title="Fall Hazards" icon={ShieldAlert} />
          <ObservationList items={data.safetyPosture.blockedExits} title="Blocked Exits" icon={ShieldAlert} />
          <ObservationList items={data.safetyPosture.unsafeZones} title="Unsafe Zones" icon={ShieldAlert} />
          <ObservationList items={data.safetyPosture.signageControl} title="Signage / Control" icon={AlertTriangle} />
        </>
      )}

      {/* Insurance / Risk */}
      {hasInsurance && (
        <div className="flex flex-col gap-1.5">
          <ObservationList items={data.insuranceEmphasis.conditionDocumentation} title="Condition Documentation" icon={FileBarChart} />
          <ObservationList items={data.insuranceEmphasis.lossRiskIndicators} title="Loss / Risk Indicators" icon={FileBarChart} />
          {data.insuranceEmphasis.claimSupportPosture !== 'not_applicable' && (
            <div className="flex items-center gap-2 text-[10px] bg-card/20 rounded-lg px-2 py-1 border border-border/15">
              <span className="text-muted-foreground">Claim Support:</span>
              <Badge variant="outline" className={cn(
                "text-[8px] font-black px-1 h-3.5",
                data.insuranceEmphasis.claimSupportPosture === 'strong_evidence' && "border-emerald-700 text-emerald-400",
                data.insuranceEmphasis.claimSupportPosture === 'partial_evidence' && "border-amber-700 text-amber-400",
                data.insuranceEmphasis.claimSupportPosture === 'insufficient_evidence' && "border-rose-700 text-rose-400",
              )}>
                {data.insuranceEmphasis.claimSupportPosture.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Domain Visibility Limits */}
      {data.domainVisibilityLimits.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest uppercase text-violet-500">Domain Visibility Limits</span>
          {data.domainVisibilityLimits.map((v, i) => (
            <div key={i} className="text-[10px] text-violet-400/80 bg-violet-950/15 rounded px-2 py-1 border border-violet-800/20 leading-tight">
              <span className="font-bold">{v.targetDescription}</span> — {v.visibilityState.replace(/_/g, ' ')} ({v.cause})
            </div>
          ))}
        </div>
      )}

      {/* Unresolved */}
      {data.unresolvedElements.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest uppercase text-orange-500">Unresolved Elements</span>
          {data.unresolvedElements.map((u, i) => (
            <div key={i} className="text-[10px] text-orange-400/80 bg-orange-950/15 rounded px-2 py-1 border border-orange-800/20 leading-tight">
              {u.description} ({u.reason.replace(/_/g, ' ')})
            </div>
          ))}
        </div>
      )}

      {/* Review */}
      {data.reviewRecommended && data.reviewReasons.length > 0 && (
        <div className="flex flex-col gap-0.5 text-[10px] text-amber-400/80 bg-amber-950/15 rounded-lg px-2 py-1.5 border border-amber-800/20">
          <span className="font-bold">Review Recommended:</span>
          {data.reviewReasons.map((r, i) => (
            <span key={i}>• {r}</span>
          ))}
        </div>
      )}
    </div>
  );
}
