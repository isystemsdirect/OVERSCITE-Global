/**
 * @fileOverview SmartSCHEDULER™ Conflict Resolution Engine
 * @domain Scheduling / Conflict Resolution / Governance
 * @canonical true
 * @status Phase 2 Implementation
 *
 * Dedicated conflict resolution engine for multi-job scheduling.
 * Evaluates resource conflicts, crew availability, weather shift impact,
 * and produces deterministic resolution proposals without silent mutation.
 *
 * Doctrine:
 *   - All outputs are advisory — no automatic schedule mutation
 *   - Priority-tier enforcement: CRITICAL > HIGH > STANDARD > LOW
 *   - BANE gate required for any consequential scheduling change
 */

import type { SchedulePosture } from '@/lib/types';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export type PriorityTier = 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW';

export interface ScheduleProposal {
  proposalId: string;
  jobId: string;
  methodId: string;
  startTime: string;
  endTime: string;
  priorityTier: PriorityTier;
  requiredResources: string[];
  requiredCrew: number;
  locationLat?: number;
  locationLon?: number;
  posture: SchedulePosture;
}

export interface ResourceConflict {
  conflictId: string;
  resourceId: string;
  overlappingProposals: string[];
  severity: 'hard' | 'soft';
  resolution: 'defer_lower_priority' | 'split_window' | 'manual_review';
}

export interface CrewConflict {
  conflictId: string;
  timeWindow: { start: string; end: string };
  requiredCrew: number;
  availableCrew: number;
  deficit: number;
  affectedProposals: string[];
}

export interface WeatherShiftImpact {
  impactId: string;
  affectedProposals: string[];
  originalPosture: SchedulePosture;
  newPosture: SchedulePosture;
  reason: string;
}

export interface ConflictResolutionProposal {
  resolutionId: string;
  timestamp: string;
  isAdvisoryOnly: true;
  resourceConflicts: ResourceConflict[];
  crewConflicts: CrewConflict[];
  weatherImpacts: WeatherShiftImpact[];
  proposedResequencing: {
    proposalId: string;
    originalSlot: { start: string; end: string };
    suggestedSlot: { start: string; end: string };
    reason: string;
  }[];
  summary: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Priority Comparison
// ═══════════════════════════════════════════════════════════════════════

const PRIORITY_RANK: Record<PriorityTier, number> = {
  CRITICAL: 4,
  HIGH: 3,
  STANDARD: 2,
  LOW: 1,
};

function comparePriority(a: PriorityTier, b: PriorityTier): number {
  return PRIORITY_RANK[b] - PRIORITY_RANK[a];
}

// ═══════════════════════════════════════════════════════════════════════
// Resource Conflict Evaluation
// ═══════════════════════════════════════════════════════════════════════

function timeOverlaps(a: ScheduleProposal, b: ScheduleProposal): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

/**
 * Evaluates resource conflicts across a set of schedule proposals.
 * Identifies all cases where the same resource is required by
 * overlapping time windows.
 */
export function evaluateResourceConflicts(
  proposals: ScheduleProposal[]
): ResourceConflict[] {
  const conflicts: ResourceConflict[] = [];
  const resourceMap = new Map<string, ScheduleProposal[]>();

  // Group proposals by required resources
  for (const proposal of proposals) {
    for (const resource of proposal.requiredResources) {
      const existing = resourceMap.get(resource) || [];
      existing.push(proposal);
      resourceMap.set(resource, existing);
    }
  }

  // Check for time overlaps within each resource group
  for (const [resourceId, resourceProposals] of resourceMap) {
    for (let i = 0; i < resourceProposals.length; i++) {
      for (let j = i + 1; j < resourceProposals.length; j++) {
        if (timeOverlaps(resourceProposals[i], resourceProposals[j])) {
          const sorted = [resourceProposals[i], resourceProposals[j]]
            .sort((a, b) => comparePriority(a.priorityTier, b.priorityTier));

          conflicts.push({
            conflictId: `rc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            resourceId,
            overlappingProposals: sorted.map(p => p.proposalId),
            severity: 'hard',
            resolution: sorted[0].priorityTier === sorted[1].priorityTier
              ? 'manual_review'
              : 'defer_lower_priority',
          });
        }
      }
    }
  }

  return conflicts;
}

// ═══════════════════════════════════════════════════════════════════════
// Crew Conflict Evaluation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates crew availability conflicts across overlapping proposals.
 */
export function evaluateCrewConflicts(
  proposals: ScheduleProposal[],
  availableCrewCount: number
): CrewConflict[] {
  const conflicts: CrewConflict[] = [];

  // Simple pairwise overlap check with crew summation
  for (let i = 0; i < proposals.length; i++) {
    const overlapping = proposals.filter(
      (p, j) => j !== i && timeOverlaps(proposals[i], p)
    );

    if (overlapping.length > 0) {
      const totalCrewNeeded = overlapping.reduce(
        (sum, p) => sum + p.requiredCrew, proposals[i].requiredCrew
      );

      if (totalCrewNeeded > availableCrewCount) {
        const affectedIds = [proposals[i].proposalId, ...overlapping.map(p => p.proposalId)];
        // Avoid duplicate conflict entries
        const key = [...affectedIds].sort().join('|');
        if (!conflicts.some(c => [...c.affectedProposals].sort().join('|') === key)) {
          conflicts.push({
            conflictId: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timeWindow: {
              start: proposals[i].startTime,
              end: proposals[i].endTime,
            },
            requiredCrew: totalCrewNeeded,
            availableCrew: availableCrewCount,
            deficit: totalCrewNeeded - availableCrewCount,
            affectedProposals: affectedIds,
          });
        }
      }
    }
  }

  return conflicts;
}

// ═══════════════════════════════════════════════════════════════════════
// Weather Shift Impact
// ═══════════════════════════════════════════════════════════════════════

export interface WeatherDelta {
  iriScoreBefore: number;
  iriScoreAfter: number;
  windGustBefore: number;
  windGustAfter: number;
}

/**
 * Evaluates how a weather change impacts existing schedule proposals.
 * Returns advisory posture changes — does not mutate schedules.
 */
export function evaluateWeatherShiftImpact(
  proposals: ScheduleProposal[],
  weatherDelta: WeatherDelta
): WeatherShiftImpact[] {
  const impacts: WeatherShiftImpact[] = [];

  // If IRI dropped below threshold or wind exceeded limits
  const iriDegraded = weatherDelta.iriScoreAfter < 60 && weatherDelta.iriScoreBefore >= 60;
  const windExceeded = weatherDelta.windGustAfter > 25 && weatherDelta.windGustBefore <= 25;

  if (!iriDegraded && !windExceeded) return impacts;

  for (const proposal of proposals) {
    if (proposal.posture === 'blocked') continue;

    let newPosture: SchedulePosture = proposal.posture;
    let reason = '';

    if (iriDegraded && windExceeded) {
      newPosture = 'blocked';
      reason = `IRI degraded to ${weatherDelta.iriScoreAfter} and wind gust exceeded ${weatherDelta.windGustAfter}mph`;
    } else if (iriDegraded) {
      newPosture = 'advisory_candidate';
      reason = `IRI degraded from ${weatherDelta.iriScoreBefore} to ${weatherDelta.iriScoreAfter}`;
    } else if (windExceeded) {
      newPosture = proposal.requiredResources.includes('drone_unit') ? 'blocked' : 'restricted';
      reason = `Wind gust increased to ${weatherDelta.windGustAfter}mph${proposal.requiredResources.includes('drone_unit') ? ' — drone operations blocked' : ''}`;
    }

    if (newPosture !== proposal.posture) {
      impacts.push({
        impactId: `wi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        affectedProposals: [proposal.proposalId],
        originalPosture: proposal.posture,
        newPosture,
        reason,
      });
    }
  }

  return impacts;
}

// ═══════════════════════════════════════════════════════════════════════
// Resolution Proposal Generation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a unified conflict resolution proposal from all conflict
 * evaluations. This is advisory only — no mutation occurs.
 */
export function generateConflictResolutionProposal(
  resourceConflicts: ResourceConflict[],
  crewConflicts: CrewConflict[],
  weatherImpacts: WeatherShiftImpact[]
): ConflictResolutionProposal {
  const totalIssues = resourceConflicts.length + crewConflicts.length + weatherImpacts.length;

  return {
    resolutionId: `crp-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isAdvisoryOnly: true,
    resourceConflicts,
    crewConflicts,
    weatherImpacts,
    proposedResequencing: [], // Populated by scheduler when method dependency context is available
    summary: totalIssues === 0
      ? 'No scheduling conflicts detected.'
      : `${totalIssues} conflict(s) detected: ${resourceConflicts.length} resource, ${crewConflicts.length} crew, ${weatherImpacts.length} weather. Advisory re-sequencing may be required.`,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Geospatial Routing
// ═══════════════════════════════════════════════════════════════════════

/**
 * Calculates routing pressure between two coordinates using Haversine distance.
 * Returns distance in miles and estimated travel minutes (rough heuristic).
 */
export function calculateRoutingPressure(
  fromLat: number, fromLon: number,
  toLat: number, toLon: number
): { distanceMiles: number; estimatedMinutes: number } {
  const R = 3959; // Earth radius in miles
  const dLat = (toLat - fromLat) * (Math.PI / 180);
  const dLon = (toLon - fromLon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromLat * (Math.PI / 180)) * Math.cos(toLat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMiles = R * c;

  // Rough heuristic: average 30mph in urban/suburban routing
  const estimatedMinutes = Math.round((distanceMiles / 30) * 60);

  return { distanceMiles: Math.round(distanceMiles * 10) / 10, estimatedMinutes };
}
