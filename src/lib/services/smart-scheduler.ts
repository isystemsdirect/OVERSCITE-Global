/**
 * OVERSCITE™ SmartSCHEDULER™ — Methodology-Aware Operational Guidance
 *
 * Provides governed scheduling proposals by binding inspection methodology
 * constraints to environmental conditions, team availability, method
 * dependencies, and multi-job conflict resolution.
 *
 * Classification: GOVERNED_SCHEDULER
 *
 * Phase 2 Enhancements:
 *   - Method dependency-aware slot sequencing
 *   - Multi-job conflict resolution integration
 *   - Resource and crew conflict handling
 *   - Geospatial routing pressure
 *   - Weather/environmental envelope binding
 *   - All five postures with deterministic reason codes
 *   - No automatic schedule mutation — BANE gate required
 */

import {
  SchedulePosture,
  CalendarBooking
} from '@/lib/types';
import type { MethodGraph, WorkflowInstance } from '@/lib/inspections/methods/contracts';
import { getMethodPack } from '@/lib/inspections/methods/registry';
import { generateMockWeatherData, calculateIRI } from '@/lib/weather/service';
import { getCalendarBookings } from './calendar-service';
import {
  evaluateResourceConflicts,
  evaluateCrewConflicts,
  evaluateWeatherShiftImpact,
  generateConflictResolutionProposal,
  calculateRoutingPressure,
  type ScheduleProposal as ConflictProposal,
  type ConflictResolutionProposal,
  type PriorityTier,
  type WeatherDelta,
} from './scheduler-conflict-engine';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export interface ScheduleProposal {
  proposalId: string;
  start_at: string;
  end_at: string;
  posture: SchedulePosture;
  reasonCodes: string[];
  iriScore: number;
  environmentalNotes: string;
  methodId?: string;
  nodeId?: string;
  priorityTier?: PriorityTier;
  routingPressure?: {
    distanceMiles: number;
    estimatedMinutes: number;
  };
}

export interface MultiJobScheduleResult {
  proposals: ScheduleProposal[];
  conflictResolution: ConflictResolutionProposal;
  isAdvisoryOnly: true;
}

// ═══════════════════════════════════════════════════════════════════════
// Single-Method Proposal (Phase 1 compatible)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates an operational window for a specific method at a property location.
 */
export async function proposeOptimalWindow(
  methodId: string,
  lat: number,
  lon: number
): Promise<ScheduleProposal[]> {
  const method = getMethodPack(methodId);
  const constraints = method.schedulingConstraints;

  // 1. Fetch Environmental Intelligence
  const weather = generateMockWeatherData(lat, lon);
  const iri = calculateIRI(weather);

  // 2. Fetch Existing Bookings
  const existingBookings = await getCalendarBookings();

  // 3. Evaluate Next 3 Operational Slots
  const proposals: ScheduleProposal[] = [];
  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const slotStart = new Date(now);
    slotStart.setHours(now.getHours() + (i * 4), 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + constraints.estimatedDurationMinutes);

    const reasonCodes: string[] = [];
    let posture: SchedulePosture = 'approved_candidate';

    // Constraint: IRI Threshold
    if (iri.score > constraints.requiredIRIThreshold) {
      posture = 'restricted';
      reasonCodes.push('environmental_restriction');
    }

    // Constraint: Daylight Requirement
    const hour = slotStart.getHours();
    const isNight = hour < 6 || hour > 19;
    if (constraints.daylightRequirement === 'mandatory' && isNight) {
      posture = 'blocked';
      reasonCodes.push('daylight');
    }

    // Constraint: Conflict Check
    const hasConflict = existingBookings.some(b => {
      const bStart = new Date(b.start_at as string);
      const bEnd = new Date(b.end_at as string);
      return (slotStart < bEnd && slotEnd > bStart);
    });

    if (hasConflict) {
      posture = 'manual_review_required';
      reasonCodes.push('crew_conflict');
    }

    proposals.push({
      proposalId: `sp-${Date.now()}-${i}`,
      start_at: slotStart.toISOString(),
      end_at: slotEnd.toISOString(),
      posture,
      reasonCodes,
      iriScore: iri.score,
      environmentalNotes: `${weather.current.temp}F, ${weather.current.wind_speed}mph wind, ${iri.band} Risk.`,
      methodId,
    });
  }

  return proposals;
}

// ═══════════════════════════════════════════════════════════════════════
// Method Dependency-Aware Scheduling (Phase 2)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates scheduling proposals with method graph dependency awareness.
 * Ensures dependent steps are not scheduled simultaneously and that
 * upstream completions are required before downstream scheduling.
 */
export function evaluateMethodDependencyConstraints(
  proposals: ScheduleProposal[],
  graph: MethodGraph,
  instance: WorkflowInstance
): ScheduleProposal[] {
  return proposals.map(proposal => {
    if (!proposal.nodeId) return proposal;

    // Check if the node's dependencies are complete
    const inboundEdges = graph.edges.filter(e => e.toNodeId === proposal.nodeId);
    const hardDeps = inboundEdges.filter(e => e.edgeType === 'hard_dependency');

    const hasIncompleteHardDep = hardDeps.some(edge => {
      const depState = instance.nodeStates[edge.fromNodeId];
      return depState?.state !== 'completed';
    });

    if (hasIncompleteHardDep) {
      return {
        ...proposal,
        posture: 'blocked' as SchedulePosture,
        reasonCodes: [...proposal.reasonCodes, 'method_dependency_incomplete'],
      };
    }

    return proposal;
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Multi-Job Conflict Resolution (Phase 2)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates multi-job scheduling conflicts across a set of proposals.
 * Returns advisory resolution — no automatic mutation.
 */
export function evaluateMultiJobConflicts(
  proposals: ScheduleProposal[],
  availableCrewCount: number = 3
): MultiJobScheduleResult {
  // Convert to conflict engine format
  const conflictProposals: ConflictProposal[] = proposals.map(p => ({
    proposalId: p.proposalId,
    jobId: p.proposalId,
    methodId: p.methodId || 'unknown',
    startTime: p.start_at,
    endTime: p.end_at,
    priorityTier: p.priorityTier || 'STANDARD',
    requiredResources: [],
    requiredCrew: 1,
    posture: p.posture,
  }));

  const resourceConflicts = evaluateResourceConflicts(conflictProposals);
  const crewConflicts = evaluateCrewConflicts(conflictProposals, availableCrewCount);
  const conflictResolution = generateConflictResolutionProposal(
    resourceConflicts,
    crewConflicts,
    []
  );

  return {
    proposals,
    conflictResolution,
    isAdvisoryOnly: true,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Geospatial Routing Integration
// ═══════════════════════════════════════════════════════════════════════

/**
 * Enriches proposals with routing pressure data from a base location.
 */
export function enrichWithRoutingPressure(
  proposals: ScheduleProposal[],
  baseLat: number,
  baseLon: number,
  destinations: { proposalId: string; lat: number; lon: number }[]
): ScheduleProposal[] {
  return proposals.map(p => {
    const dest = destinations.find(d => d.proposalId === p.proposalId);
    if (!dest) return p;

    return {
      ...p,
      routingPressure: calculateRoutingPressure(baseLat, baseLon, dest.lat, dest.lon),
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Weather Envelope Integration
// ═══════════════════════════════════════════════════════════════════════

/**
 * Applies a weather delta to existing proposals and returns updated postures.
 * Advisory only — does not mutate source proposals.
 */
export function applyWeatherEnvelopeShift(
  proposals: ScheduleProposal[],
  weatherDelta: WeatherDelta
): { updatedProposals: ScheduleProposal[]; impacts: ReturnType<typeof evaluateWeatherShiftImpact> } {
  const conflictProposals: ConflictProposal[] = proposals.map(p => ({
    proposalId: p.proposalId,
    jobId: p.proposalId,
    methodId: p.methodId || 'unknown',
    startTime: p.start_at,
    endTime: p.end_at,
    priorityTier: p.priorityTier || 'STANDARD',
    requiredResources: [],
    requiredCrew: 1,
    posture: p.posture,
  }));

  const impacts = evaluateWeatherShiftImpact(conflictProposals, weatherDelta);

  const updatedProposals = proposals.map(p => {
    const impact = impacts.find(i => i.affectedProposals.includes(p.proposalId));
    if (!impact) return p;

    return {
      ...p,
      posture: impact.newPosture,
      reasonCodes: [...p.reasonCodes, 'weather_shift'],
      environmentalNotes: `${p.environmentalNotes} [UPDATED: ${impact.reason}]`,
    };
  });

  return { updatedProposals, impacts };
}
