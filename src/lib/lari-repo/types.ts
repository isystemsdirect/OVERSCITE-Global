// src/lib/lari-repo/types.ts
import { UserRole } from '../bane/context';

export type ReviewStatus = 'pending' | 'accepted' | 'rejected' | 'corrected';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type GeometryType = 'bbox' | 'polygon' | 'point';

export interface Geometry {
  type: GeometryType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
}

export interface FindingTag {
  label: string;
  displayNumber: number;
  colorToken: string;
  anchorX: number;
  anchorY: number;
}

export interface FindingReview {
  status: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  correctionText?: string;
  reportEligibility: 'eligible' | 'ineligible' | 'exception_provisional';
  lineageId?: string; // Link to CorrectionRecord
}

export interface CorrectionRecord {
    id: string;
    findingId: string;
    derivedFromProposalId: string;
    before: {
        title: string;
        description: string;
        severity: Severity;
        geometry: Geometry;
    };
    after: {
        title?: string;
        description?: string;
        severity?: Severity;
        geometry?: Geometry;
    };
    reason: string;
    reviewerId: string;
    timestamp: string;
}

export interface FinalTruthRecord {
    truthId: string;
    findingId: string;
    sourceType: 'accepted' | 'corrected';
    activeReportEligibility: boolean;
    approvedBy: string;
    approvedAt: string;
}

export interface FindingNote {
  id: string;
  findingId: string;
  text: string;
  type: 'clarification' | 'correction' | 'false_positive' | 'context' | 'standards_note' | 'training_feedback';
  authorId: string;
  timestamp: string;
  learningPortalStatus: 'pending' | 'dispatched' | 'excluded' | 'held' | 'reviewed' | 'approved_for_possible_ingestion';
}

export interface FindingOverlay {
  id: string;
  findingNumber: number;
  sourceFileId: string;
  reportId: string;
  title: string;
  category: string;
  severity: Severity;
  /** @deprecated Use observedCondition, systemIdentification, and recommendation layers */
  description: string;
  observedCondition: string; // Layer 1: Deterministic Capture
  systemIdentification: string; // Layer 2: Probabilistic Identification
  recommendation: string; // Layer 3: Human Authority
  geometry: Geometry;
  tag: FindingTag;
  review: FindingReview;
  notes: FindingNote[];
  audit: {
    createdAt: string;
    createdByEngine: string;
    modelVersion?: string;
    confidence?: number;
    proposalId: string; // The original engine proposal ID
  };
}

export interface ArtifactVersion {
    artifactId: string;
    versionNumber: number;
    priorVersionId?: string;
    createdAt: string;
    createdBy: string;
    changeReason: string;
    hash?: string;
}

export interface ReportVersion {
    reportId: string;
    versionNumber: number;
    priorVersionId?: string;
    generatedAt: string;
    generatedBy: string;
    includedFindingIds: string[];
    truthMode: 'standard' | 'exception_flagged';
    sealId?: string;
}

export interface ReportTruthSeal {
    sealId: string;
    reportId: string;
    reportVersionNumber: number;
    sealedAt: string;
    sealedBy: string;
    sealedByRole: UserRole;
    includedFindingIds: string[];
    excludedFindingIds?: string[];
    truthMode: 'standard' | 'exception';
    reportHash?: string;
    sourceVersionId: string;
    auditEventId: string;
    sealStatus: 'active' | 'invalidated' | 'superseded';
    invalidatedAt?: string;
    invalidationReason?: string;
}

export interface CorrectionEscalation {
    escalationId: string;
    findingId: string;
    correctionId: string;
    triggerReason: string;
    escalatedAt: string;
    escalatedBy: string;
    escalationStatus: 'pending_review' | 'approved' | 'denied';
    resolvedBy?: string;
    resolvedAt?: string;
    resolutionReason?: string;
}

export type ArtifactType = 'image' | 'pdf' | 'html_report' | 'structured_json';

export interface RepoFile {
  id: string;
  name: string;
  type: ArtifactType;
  jobId: string;
  clientId: string;
  createdAt: string;
  createdBy: string;
  reviewStatus: ReviewStatus;
  ingestionEligibility: 'eligible' | 'not_eligible' | 'excluded';
  version: string;
  currentVersionNumber: number;
  metadata: Record<string, any>;
}

export type AuditEventClass = 
    | 'truth_gate_denied' 
    | 'truth_sealed' 
    | 'correction_applied' 
    | 'correction_escalated' 
    | 'correction_escalation_resolved' 
    | 'learning_packet_submitted' 
    | 'learning_packet_reviewed' 
    | 'learning_packet_held' 
    | 'learning_packet_approved' 
    | 'learning_packet_excluded' 
    | 'exception_truth_approved'
    | 'truth_seal_verified'
    | 'truth_seal_verification_failed'
    | 'truth_seal_invalidated'
    | 'truth_seal_break_attempted'
    | 'sealed_report_mutation_blocked'
    | 'new_version_created_from_sealed_truth'
    | 'truth_reseal_requested'
    | 'truth_resealed';

export interface AuditEvent {
  eventId: string;
  type: string; // Keep for backward compat
  eventClass?: AuditEventClass;
  actorId: string;
  actorRole: string;
  artifactId?: string;
  reportId?: string;
  findingId?: string;
  queueItemId?: string;
  timestamp: string;
  priorState?: any;
  newState?: any;
  reason?: string;
  correlationId?: string;
}

export interface LearningPacket {
  id: string;
  findingId: string;
  type: 'accepted_finding' | 'corrected_finding' | 'note_bundle' | 'correction_comparison' | 'correction_delta';
  status: 'queued' | 'held' | 'reviewed' | 'approved_for_possible_ingestion' | 'excluded';
  payload: any;
  heldReason?: string;
  timestamp: string;
  enteredBy: string;
  priorState?: { status: string };
}

export interface OverHUDContext {
  currentJobId?: string;
  currentArtifactId?: string;
  currentArtifactType?: ArtifactType;
  currentFindingId?: string;
  currentReviewStatus?: ReviewStatus;
  currentReviewerId?: string;
  currentReviewerRole?: UserRole;
  currentOverlayVisible: boolean;
  currentReportId?: string;
}
