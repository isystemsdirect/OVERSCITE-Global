/**
 * @fileOverview ArcHive™ Control Plane Governance Contracts
 * @domain Inspections / Field Intelligence / ArcHive Governance
 * @classification CANONICAL_CONTRACT — control-plane schemas
 * @phase Phase 5 — ArcHive Control Plane Activation
 *
 * Defines the versioned governance models for the recognition stack. These
 * contracts ensure all consequential changes (taxonomy, thresholds, routing)
 * are proposal-bound, diffable, and auditable.
 *
 * HARD RULES:
 * - Production-active and proposal-staged values are distinct.
 * - Every version must track lineage (prior version ID).
 * - No silent mutation; all changes traverse ControlPlaneProposalPacket.
 *
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import type { InspectionDomainClass } from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// 1. Core Versioning Base
// ---------------------------------------------------------------------------

export type GovernanceArtifactState = 'draft' | 'staged' | 'active' | 'superseded' | 'rollback_target';

export interface GovernanceArtifactBase {
  id: string;
  version: string; // Semantic or monotonic e.g., "1.2.0"
  status: GovernanceArtifactState;
  createdAt: string;
  createdBy: string;
  activatedAt?: string;
  activatedBy?: string;
  priorVersionId?: string;
  rationale: string;
}

// ---------------------------------------------------------------------------
// 2. Taxonomy & Pack Governance
// ---------------------------------------------------------------------------

export interface DomainPackVersion extends GovernanceArtifactBase {
  domainClass: InspectionDomainClass;
  packName: string; // e.g., 'Core Safety Pack', 'MEP Symbol Set'
  classesAdded: string[];
  classesRetired: string[];
  // e.g., mapping of new object references to confidence weights
  taxonomicMapping: Record<string, any>;
}

export interface RecognitionTaxonomyVersion extends GovernanceArtifactBase {
  globalTaxonomyHash: string;
  activeDomainPacks: string[]; // Pack IDs
  supportedFindingClasses: string[];
}

// ---------------------------------------------------------------------------
// 3. Threshold & Policy Controls
// ---------------------------------------------------------------------------

export interface ConfidenceThresholdMap {
  critical: number;
  high: number;
  moderate: number;
  low: number;
  review_required_floor: number;
}

export interface RecognitionThresholdProfile extends GovernanceArtifactBase {
  baseThresholds: ConfidenceThresholdMap;
  domainOverrides: Partial<Record<InspectionDomainClass, ConfidenceThresholdMap>>;
}

export interface RecognitionRoutingPolicy extends GovernanceArtifactBase {
  domainToEngineMap: Record<InspectionDomainClass, string>;
  fallbackEngine: string;
  passActivationMatrix: Record<string, boolean>;
}

export interface VerificationPolicyProfile extends GovernanceArtifactBase {
  verificationRequiredClasses: string[]; // Defect tags always needing human
  verificationRequiredDomains: InspectionDomainClass[];
  autoVerifyAllowed: boolean; // Must always be false in OVERSCITE, enforcing BANE, but configurable per enterprise config if applicable
}

// ---------------------------------------------------------------------------
// 4. ArcHive™ Proposal Packets
// ---------------------------------------------------------------------------

export type ProposalTargetType =
  | 'taxonomy'
  | 'domain_pack'
  | 'threshold_profile'
  | 'routing_policy'
  | 'verification_policy';

export type ProposalStatus = 'pending_review' | 'approved' | 'rejected' | 'implemented' | 'withdrawn';

/**
 * A diffable proposal representing a requested change to the control plane.
 */
export interface ControlPlaneProposalPacket {
  proposalId: string;
  targetType: ProposalTargetType;
  status: ProposalStatus;
  
  proposedBy: string;
  proposedAt: string;
  rationale: string;

  // The base artifact ID being modified (null if new)
  baseArtifactId: string | null;
  // The newly staged artifact ID containing the changes
  stagedArtifactId: string;

  // BANE tracking for approval execution
  approvedBy?: string;
  approvedAt?: string;
  banePolicyRef?: string;
  rejectionReason?: string;
}
