/**
 * @fileOverview Map & Scheduler Output Hooks — Passive Advisory Payloads
 * @domain Inspections / Field Intelligence / Evidence Pipeline
 * @classification OUTPUT_HOOK — advisory payloads
 * @phase Phase 4 — Domain Intelligence Activated Hook Enrichment
 *
 * Creates map-ready and scheduler-ready hook payloads from recognition stack
 * evidence results. These hooks are PASSIVE and NON-MUTATING in this phase —
 * they produce structured advisory payloads that downstream systems may
 * consume but do not trigger autonomous actions.
 *
 * HARD RULES:
 * - No autonomous scheduling mutation
 * - No automatic map event publication that outranks evidence truth-state
 * - Hook payloads remain advisory and attributable only
 * - Payloads include source attribution for traceability
 *
 * @see src/lib/constants/domain-awareness.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

import { persistMapAdvisory, persistSchedulerAdvisory } from '@/lib/services/recognition-advisory-service';
import type {
  MediaAnalysisState,
  ConfidenceBand,
  InspectionDomainClass,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Map Hook Payload
// ---------------------------------------------------------------------------

/**
 * Advisory map-ready payload for geospatial display of evidence results.
 * Does NOT publish to any map service — downstream consumer responsibility.
 */
export interface MapReadyHookPayload {
  /** Unique payload identifier */
  payloadId: string;
  /** Source evidence asset ID */
  mediaAssetId: string;
  /** Source inspection ID */
  inspectionId: string;
  /** Payload type discriminator */
  type: 'hazard' | 'site_state' | 'visibility_limited' | 'review_required'
    | 'industrial_corrosion' | 'safety_ppe' | 'drawing_discrepancy_readiness'
    | 'weather_exposed_site' | 'unsafe_condition';
  /** Human-readable summary */
  summary: string;
  /** Severity for display prioritization */
  severity: 'critical' | 'warning' | 'info';
  /** Confidence band from recognition */
  confidenceBand: ConfidenceBand;
  /** Domain class context */
  domainClass: InspectionDomainClass;
  /** Source attribution */
  sourcePacketId?: string;
  /** Advisory flag — this payload is NOT a validated map event */
  advisory: true;
  /** ISO 8601 timestamp of payload generation */
  generatedAt: string;
  /** Attribution: who/what generated this payload */
  generatedBy: string;
}

/**
 * Generates map-ready hook payloads from evidence state and recognition results.
 *
 * HARD RULE: These payloads are advisory only. They do not publish to any
 * map service or create map markers autonomously.
 */
export function generateMapHookPayloads(params: {
  mediaAssetId: string;
  inspectionId: string;
  domainClass: InspectionDomainClass;
  mediaState: MediaAnalysisState;
  confidenceBand?: ConfidenceBand;
  observations?: string[];
  hasVisibilityLimitations?: boolean;
  hasUnresolvedUnknowns?: boolean;
  hasPestEvidence?: boolean;
  sourcePacketId?: string;
  /** Phase 4: LARI_SITEOPS enrichment observations (if available) */
  siteopsObservations?: { observation: string; category: string; severity: string }[];
  /** Phase 4: LARI_DRAFTING comparison readiness (if available) */
  draftingComparisonReady?: boolean;
  draftingReadinessScore?: number;
}): MapReadyHookPayload[] {
  const now = new Date().toISOString();
  const payloads: MapReadyHookPayload[] = [];

  const basePayload = {
    mediaAssetId: params.mediaAssetId,
    inspectionId: params.inspectionId,
    domainClass: params.domainClass,
    sourcePacketId: params.sourcePacketId,
    advisory: true as const,
    generatedAt: now,
    generatedBy: 'recognition_output_hook',
  };

  // Review required → always surface
  if (params.mediaState === 'review_required') {
    payloads.push({
      ...basePayload,
      payloadId: `map-review-${params.mediaAssetId}`,
      type: 'review_required',
      summary: 'Evidence requires human review — recognition confidence insufficient',
      severity: 'warning',
      confidenceBand: params.confidenceBand ?? 'review_required',
    });
  }

  // Visibility limitations
  if (params.hasVisibilityLimitations) {
    payloads.push({
      ...basePayload,
      payloadId: `map-vis-${params.mediaAssetId}`,
      type: 'visibility_limited',
      summary: 'Visibility limitations detected at this location — inspection may be incomplete',
      severity: 'info',
      confidenceBand: params.confidenceBand ?? 'moderate',
    });
  }

  // Site/safety hazard patterns
  if ((params.domainClass === 'site' || params.domainClass === 'safety') && params.observations) {
    const hazardTerms = ['hazard', 'unsafe', 'blocked', 'fall', 'tripping', 'exposed', 'unguarded'];
    const hazardObs = params.observations.filter((obs) =>
      hazardTerms.some((term) => obs.toLowerCase().includes(term))
    );
    if (hazardObs.length > 0) {
      payloads.push({
        ...basePayload,
        payloadId: `map-hazard-${params.mediaAssetId}`,
        type: 'hazard',
        summary: `Potential hazard indicators: ${hazardObs.slice(0, 2).join('; ')}`,
        severity: 'critical',
        confidenceBand: params.confidenceBand ?? 'moderate',
      });
    }
  }

  // Phase 4: Industrial corrosion/leak from LARI_SITEOPS
  if (params.siteopsObservations) {
    const corrosionObs = params.siteopsObservations.filter((o) =>
      ['corrosion_leak', 'piping_valve'].includes(o.category) && o.severity !== 'observation_only'
    );
    if (corrosionObs.length > 0) {
      payloads.push({
        ...basePayload,
        payloadId: `map-corrosion-${params.mediaAssetId}`,
        type: 'industrial_corrosion',
        summary: `Industrial corrosion/piping concern: ${corrosionObs[0].observation}`,
        severity: corrosionObs.some((o) => o.severity === 'critical') ? 'critical' : 'warning',
        confidenceBand: params.confidenceBand ?? 'moderate',
      });
    }

    // Safety PPE concern
    const ppeObs = params.siteopsObservations.filter((o) =>
      o.category === 'ppe_presence' && o.severity === 'critical'
    );
    if (ppeObs.length > 0) {
      payloads.push({
        ...basePayload,
        payloadId: `map-ppe-${params.mediaAssetId}`,
        type: 'safety_ppe',
        summary: `Safety concern — PPE observation: ${ppeObs[0].observation}`,
        severity: 'critical',
        confidenceBand: params.confidenceBand ?? 'low',
      });
    }
  }

  // Phase 4: Drawing-to-field comparison readiness
  if (params.draftingComparisonReady) {
    payloads.push({
      ...basePayload,
      payloadId: `map-drawing-compare-${params.mediaAssetId}`,
      type: 'drawing_discrepancy_readiness',
      summary: `Drawing-to-field comparison ready (score: ${Math.round((params.draftingReadinessScore ?? 0) * 100)}%) — advisory, not final discrepancy`,
      severity: 'info',
      confidenceBand: params.confidenceBand ?? 'moderate',
    });
  }

  return payloads;
}

// ---------------------------------------------------------------------------
// Scheduler Hook Payload
// ---------------------------------------------------------------------------

/**
 * Advisory scheduler-ready payload for workflow/scheduling system consumption.
 * Does NOT mutate any schedule — downstream consumer responsibility.
 */
export interface SchedulerReadyHookPayload {
  /** Unique payload identifier */
  payloadId: string;
  /** Source evidence asset ID */
  mediaAssetId: string;
  /** Source inspection ID */
  inspectionId: string;
  /** Payload type discriminator */
  type:
    | 'review_required'
    | 'unsafe_condition'
    | 'weather_exposed_site'
    | 'readiness_affecting'
    | 'insurance_review_urgency'
    | 'safety_ppe_urgency'
    | 'industrial_maintenance'
    | 'drawing_field_comparison';
  /** Human-readable action suggestion */
  suggestedAction: string;
  /** Priority for scheduling consideration */
  priority: 'urgent' | 'high' | 'normal' | 'low';
  /** Domain class context */
  domainClass: InspectionDomainClass;
  /** Source attribution */
  sourcePacketId?: string;
  /** Advisory flag — no autonomous scheduling mutation */
  advisory: true;
  /** ISO 8601 timestamp */
  generatedAt: string;
  /** Attribution */
  generatedBy: string;
}

/**
 * Generates scheduler-ready hook payloads from evidence state and recognition results.
 *
 * HARD RULE: These payloads are advisory only. They do not create, modify,
 * or cancel any scheduled task or inspection event.
 */
export function generateSchedulerHookPayloads(params: {
  mediaAssetId: string;
  inspectionId: string;
  domainClass: InspectionDomainClass;
  mediaState: MediaAnalysisState;
  confidenceBand?: ConfidenceBand;
  observations?: string[];
  hasVisibilityLimitations?: boolean;
  hasUnresolvedUnknowns?: boolean;
  sourcePacketId?: string;
  /** Phase 4: LARI_SITEOPS enrichment */
  siteopsObservations?: { observation: string; category: string; severity: string }[];
  /** Phase 4: Insurance emphasis */
  insuranceClaimPosture?: string;
  /** Phase 4: Drafting comparison posture */
  draftingComparisonReady?: boolean;
}): SchedulerReadyHookPayload[] {
  const now = new Date().toISOString();
  const payloads: SchedulerReadyHookPayload[] = [];

  const base = {
    mediaAssetId: params.mediaAssetId,
    inspectionId: params.inspectionId,
    domainClass: params.domainClass,
    sourcePacketId: params.sourcePacketId,
    advisory: true as const,
    generatedAt: now,
    generatedBy: 'recognition_output_hook',
  };

  // Review required → schedule human reviewer
  if (params.mediaState === 'review_required') {
    payloads.push({
      ...base,
      payloadId: `sched-review-${params.mediaAssetId}`,
      type: 'review_required',
      suggestedAction: 'Schedule human review for evidence with unresolved recognition state',
      priority: 'high',
    });
  }

  // Unsafe condition observations
  if (params.observations) {
    const unsafeTerms = ['unsafe', 'hazard', 'danger', 'blocked exit', 'fall risk', 'exposed wire'];
    const unsafeObs = params.observations.filter((obs) =>
      unsafeTerms.some((term) => obs.toLowerCase().includes(term))
    );
    if (unsafeObs.length > 0) {
      payloads.push({
        ...base,
        payloadId: `sched-unsafe-${params.mediaAssetId}`,
        type: 'unsafe_condition',
        suggestedAction: `Urgent site safety review recommended: ${unsafeObs[0]}`,
        priority: 'urgent',
      });
    }
  }

  // Weather-exposed site (site domain)
  if (params.domainClass === 'site' && params.observations) {
    const weatherTerms = ['weather', 'exposure', 'rain', 'storm', 'wind', 'erosion', 'flooding'];
    const weatherObs = params.observations.filter((obs) =>
      weatherTerms.some((term) => obs.toLowerCase().includes(term))
    );
    if (weatherObs.length > 0) {
      payloads.push({
        ...base,
        payloadId: `sched-weather-${params.mediaAssetId}`,
        type: 'weather_exposed_site',
        suggestedAction: `Weather exposure detected — consider schedule adjustment: ${weatherObs[0]}`,
        priority: 'high',
      });
    }
  }

  // Readiness-affecting for site domain
  if (params.domainClass === 'site' && params.hasVisibilityLimitations) {
    payloads.push({
      ...base,
      payloadId: `sched-readiness-${params.mediaAssetId}`,
      type: 'readiness_affecting',
      suggestedAction: 'Visibility limitations may affect site readiness assessment — consider re-inspection',
      priority: 'normal',
    });
  }

  // Phase 4: Insurance review urgency
  if ((params.domainClass === 'insurance' || params.insuranceClaimPosture) && params.siteopsObservations) {
    const riskObs = params.siteopsObservations.filter((o) =>
      ['loss_risk_indicator', 'condition_documentation'].includes(o.category)
    );
    if (riskObs.length > 0) {
      payloads.push({
        ...base,
        payloadId: `sched-insurance-${params.mediaAssetId}`,
        type: 'insurance_review_urgency',
        suggestedAction: `Insurance/risk documentation review suggested: ${riskObs[0].observation}`,
        priority: 'high',
      });
    }
  }

  // Phase 4: Safety PPE urgency
  if (params.siteopsObservations) {
    const ppeUrgent = params.siteopsObservations.filter((o) =>
      o.category === 'ppe_presence' && o.severity === 'critical'
    );
    if (ppeUrgent.length > 0) {
      payloads.push({
        ...base,
        payloadId: `sched-ppe-${params.mediaAssetId}`,
        type: 'safety_ppe_urgency',
        suggestedAction: `PPE safety concern — site supervisor notification suggested: ${ppeUrgent[0].observation}`,
        priority: 'urgent',
      });
    }
  }

  // Phase 4: Industrial maintenance suggestion
  if (params.siteopsObservations) {
    const maintenanceObs = params.siteopsObservations.filter((o) =>
      ['corrosion_leak', 'equipment_posture', 'weld_structural'].includes(o.category) && o.severity !== 'observation_only'
    );
    if (maintenanceObs.length > 0) {
      payloads.push({
        ...base,
        payloadId: `sched-maintenance-${params.mediaAssetId}`,
        type: 'industrial_maintenance',
        suggestedAction: `Industrial maintenance review suggested: ${maintenanceObs[0].observation}`,
        priority: 'high',
      });
    }
  }

  // Phase 4: Drawing-to-field comparison scheduling
  if (params.draftingComparisonReady) {
    payloads.push({
      ...base,
      payloadId: `sched-drawing-compare-${params.mediaAssetId}`,
      type: 'drawing_field_comparison',
      suggestedAction: 'Drawing-to-field comparison ready — consider scheduling field verification walkthrough',
      priority: 'normal',
    });
  }

  return payloads;
}

/**
 * Automatically persists high-value/critical advisories to the operational 
 * intelligence layer for downstream consumption.
 */
export async function autoPersistAdvisories(params: {
  mapPayloads: MapReadyHookPayload[];
  schedulerPayloads: SchedulerReadyHookPayload[];
}): Promise<{ mapCount: number; schedCount: number }> {
  let mapCount = 0;
  let schedCount = 0;

  // Persist high-severity map payloads
  for (const payload of params.mapPayloads) {
    if (payload.severity === 'critical' || payload.severity === 'warning') {
      try {
        await persistMapAdvisory(payload);
        mapCount++;
      } catch (err) {
        console.error('[ADVISORY_PERSIST] Failed to persist map payload:', payload.payloadId, err);
      }
    }
  }

  // Persist urgent/high priority scheduler payloads
  for (const payload of params.schedulerPayloads) {
    if (payload.priority === 'urgent' || payload.priority === 'high') {
      try {
        const schedPayload = {
          ...payload,
          summary: `Advisory: ${payload.type.replace(/_/g, ' ')}`,
          confidence: 0.9, // Default for generated advisories
        };
        await persistSchedulerAdvisory(schedPayload as any); 
        schedCount++;
      } catch (err) {
        console.error('[ADVISORY_PERSIST] Failed to persist scheduler payload:', payload.payloadId, err);
      }
    }
  }

  return { mapCount, schedCount };
}
