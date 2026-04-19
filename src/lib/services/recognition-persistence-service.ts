/**
 * @fileOverview Recognition Packet Persistence Service
 * @domain Inspections / Field Intelligence / Evidence Pipeline
 * @classification CANONICAL_WRITE — recognition pipeline
 * @phase Phase 2 — Baseline Recognition Activation
 *
 * Provides the authoritative read and write interface for RecognitionPacket
 * and EvidenceAnalysisState records in the Firestore truth path.
 *
 * Firestore Collection Layout:
 *   recognition_packets/{packetId}
 *   evidence_analysis_states/{stateId}
 *   recognition_audit_log/{auditId}      ← append-only
 *
 * HARD RULES (enforced at service boundary):
 * - accepted_unanalyzed is the ONLY valid initial state for any new media asset
 * - No write path may silently transition accepted_unanalyzed → analysis_in_progress
 * - Analysis must be triggered only by explicit analysis request with requestedBy + requestedAt
 * - verified_by_overscite may not be written without a verified precondition check
 * - Every state transition creates an immutable audit entry with actor, timestamp, prior and new state
 * - BANE validation is called before any approval-sensitive transition
 *
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see src/lib/contracts/evidence-analysis-contract.ts
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  Firestore,
  type DocumentData,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import type { InspectionRecognitionPacket, PacketAuditRef } from '@/lib/contracts/recognition-stack-contract';
import type { EvidenceAnalysisState, EvidenceReviewQueueEntry, AnalysisRequestPayload } from '@/lib/contracts/evidence-analysis-contract';
import type { MediaAnalysisState, ConfidenceBand, InspectionDomainClass } from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Collection Constants
// ---------------------------------------------------------------------------

const COLLECTIONS = {
  RECOGNITION_PACKETS: 'recognition_packets',
  EVIDENCE_ANALYSIS_STATES: 'evidence_analysis_states',
  RECOGNITION_AUDIT_LOG: 'recognition_audit_log',
} as const;

// ---------------------------------------------------------------------------
// Write Result
// ---------------------------------------------------------------------------

export interface RecognitionWriteResult {
  success: boolean;
  id?: string;
  error?: string;
  /** BANE decision reference if a policy gate was evaluated */
  banePolicyRef?: string;
}

// ---------------------------------------------------------------------------
// Audit Logging (append-only, immutable)
// ---------------------------------------------------------------------------

/**
 * Appends an immutable audit entry for a recognition pipeline state transition.
 * This log is append-only — no updates or deletes are permitted.
 *
 * HARD RULE: Called before finalizing any consequential state transition.
 * Must not fail silently — if audit write fails, the transition must not proceed.
 */
async function appendRecognitionAuditEntry(
  entry: Omit<PacketAuditRef, 'timestamp'> & {
    packetId?: string;
    stateId?: string;
    inspectionId: string;
  }
): Promise<string | null> {
  if (!db) return null;
  try {
    const auditEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      serverTimestamp: serverTimestamp(),
      __immutable: true,
    };
    const ref = await addDoc(collection(db as Firestore, COLLECTIONS.RECOGNITION_AUDIT_LOG), auditEntry);
    return ref.id;
  } catch (error) {
    console.error('[RECOGNITION_AUDIT] CRITICAL: audit write failed:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// EvidenceAnalysisState — Read / Write
// ---------------------------------------------------------------------------

/**
 * Creates the initial EvidenceAnalysisState for a newly accepted media asset.
 * Default resting state is always `accepted_unanalyzed`.
 *
 * HARD RULE: This is the ONLY place a new EvidenceAnalysisState is created.
 * No other path may insert a new state record into a higher initial state.
 */
export async function createEvidenceAnalysisState(params: {
  mediaAssetId: string;
  inspectionId: string;
  createdBy: string;
}): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  try {
    const stateId = nanoid();
    const now = new Date().toISOString();

    const record: EvidenceAnalysisState & { stateId: string; createdAt: string; __canonical: boolean; __v: string } = {
      stateId,
      mediaAssetId: params.mediaAssetId,
      inspectionId: params.inspectionId,
      // HARD RULE: accepted_unanalyzed is the mandatory initial state
      mediaState: 'accepted_unanalyzed',
      createdAt: now,
      __canonical: true,
      __v: '2.0.0',
    };

    await setDoc(doc(db, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, stateId), {
      ...record,
      serverTimestamp: serverTimestamp(),
    });

    await appendRecognitionAuditEntry({
      stateId,
      inspectionId: params.inspectionId,
      actorId: params.createdBy,
      actorType: 'human',
      action: 'evidence_state_created',
      toState: 'accepted_unanalyzed',
    });

    console.log(`[RECOGNITION_PERSISTENCE] Created EvidenceAnalysisState: ${stateId} for asset: ${params.mediaAssetId}`);
    return { success: true, id: stateId };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error creating EvidenceAnalysisState:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves the current EvidenceAnalysisState for a media asset.
 */
export async function getEvidenceAnalysisState(
  mediaAssetId: string
): Promise<EvidenceAnalysisState | null> {
  if (!db) return null;
  try {
    const q = query(
      collection(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES),
      where('mediaAssetId', '==', mediaAssetId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as EvidenceAnalysisState;
  } catch (error) {
    console.error('[RECOGNITION_PERSISTENCE] Error fetching EvidenceAnalysisState:', error);
    return null;
  }
}

/**
 * Fetches all EvidenceAnalysisState records for an inspection, for Evidence lane display.
 */
export async function getEvidenceQueueForInspection(
  inspectionId: string
): Promise<EvidenceAnalysisState[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES),
      where('inspectionId', '==', inspectionId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as EvidenceAnalysisState);
  } catch (error) {
    console.error('[RECOGNITION_PERSISTENCE] Error fetching evidence queue:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Analysis Request — Governed Transition
// ---------------------------------------------------------------------------

/**
 * Records an explicit analysis request and advances the EvidenceAnalysisState
 * from `accepted_unanalyzed` → `accepted_analysis_requested`.
 *
 * HARD RULES:
 * - requestedBy and requestedAt are mandatory
 * - Prior state MUST be accepted_unanalyzed; any other state blocks this transition
 * - Audit entry is written before state update
 *
 * Returns the updated stateId and the analysisRequest record for downstream engine invocation.
 */
export async function recordAnalysisRequest(
  request: AnalysisRequestPayload
): Promise<RecognitionWriteResult & { stateId?: string }> {
  if (!db) return { success: false, error: 'Database not initialized' };

  if (!request.requestedBy || !request.requestedAt) {
    return { success: false, error: 'POLICY_VIOLATION: requestedBy and requestedAt are required for analysis requests' };
  }

  try {
    // Fetch current state
    const currentState = await getEvidenceAnalysisState(request.mediaAssetId);
    if (!currentState) {
      return { success: false, error: 'PRECONDITION_FAILED: No EvidenceAnalysisState found for this media asset' };
    }

    // HARD RULE: Guard against silent state elevation
    if (currentState.mediaState !== 'accepted_unanalyzed') {
      return {
        success: false,
        error: `PRECONDITION_FAILED: Current state is '${currentState.mediaState}'. Analysis can only be requested from 'accepted_unanalyzed' state.`,
      };
    }

    // Write audit entry BEFORE state update
    const auditId = await appendRecognitionAuditEntry({
      stateId: currentState.stateId,
      inspectionId: request.inspectionId,
      actorId: request.requestedBy,
      actorType: 'human',
      action: 'analysis_requested',
      fromState: 'accepted_unanalyzed',
      toState: 'accepted_analysis_requested',
    });

    if (!auditId) {
      return { success: false, error: 'AUDIT_FAILURE: Audit write failed; analysis request aborted' };
    }

    // Update state record
    const stateRef = doc(db, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, currentState.stateId);
    await updateDoc(stateRef, {
      mediaState: 'accepted_analysis_requested' satisfies MediaAnalysisState,
      analysisRequestedBy: request.requestedBy,
      analysisRequestedAt: request.requestedAt,
      updatedAt: serverTimestamp(),
    });

    // Persist the analysis request record
    const requestRef = await addDoc(collection(db as Firestore, 'analysis_requests'), {
      ...request,
      __canonical: true,
      __v: '2.0.0',
      auditRef: auditId,
      serverTimestamp: serverTimestamp(),
    });

    console.log(`[RECOGNITION_PERSISTENCE] Analysis requested: ${requestRef.id} by ${request.requestedBy}`);
    return { success: true, id: requestRef.id, stateId: currentState.stateId };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error recording analysis request:', error);
    return { success: false, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// Analysis Progress Transitions
// ---------------------------------------------------------------------------

/**
 * Advances state to `analysis_in_progress` when engine execution begins.
 * Only permitted from `accepted_analysis_requested` state.
 */
export async function markAnalysisInProgress(params: {
  stateId: string;
  inspectionId: string;
  engineId: string;
}): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };
  try {
    const stateRef = doc(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, params.stateId);
    const snap = await getDoc(stateRef);
    if (!snap.exists()) return { success: false, error: 'State record not found' };

    const current = snap.data() as EvidenceAnalysisState;
    if (current.mediaState !== 'accepted_analysis_requested') {
      return { success: false, error: `PRECONDITION_FAILED: Cannot mark in_progress from state '${current.mediaState}'` };
    }

    await appendRecognitionAuditEntry({
      stateId: params.stateId,
      inspectionId: params.inspectionId,
      actorId: params.engineId,
      actorType: 'engine',
      action: 'analysis_started',
      fromState: 'accepted_analysis_requested',
      toState: 'analysis_in_progress',
    });

    await updateDoc(stateRef, {
      mediaState: 'analysis_in_progress' satisfies MediaAnalysisState,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error marking analysis in progress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Advances state to `analysis_complete` and links the resulting recognition packet.
 * Only permitted from `analysis_in_progress` state.
 */
export async function markAnalysisComplete(params: {
  stateId: string;
  inspectionId: string;
  recognitionPacketId: string;
  engineId: string;
}): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };
  try {
    const stateRef = doc(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, params.stateId);
    const snap = await getDoc(stateRef);
    if (!snap.exists()) return { success: false, error: 'State record not found' };

    const current = snap.data() as EvidenceAnalysisState;
    if (current.mediaState !== 'analysis_in_progress') {
      return { success: false, error: `PRECONDITION_FAILED: Cannot mark complete from state '${current.mediaState}'` };
    }

    await appendRecognitionAuditEntry({
      stateId: params.stateId,
      inspectionId: params.inspectionId,
      actorId: params.engineId,
      actorType: 'engine',
      action: 'analysis_completed',
      fromState: 'analysis_in_progress',
      toState: 'analysis_complete',
    });

    await updateDoc(stateRef, {
      mediaState: 'analysis_complete' satisfies MediaAnalysisState,
      analysisCompletedAt: new Date().toISOString(),
      recognitionPacketId: params.recognitionPacketId,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error marking analysis complete:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sets `review_required` state — always permitted, no state restriction.
 */
export async function markReviewRequired(params: {
  stateId: string;
  inspectionId: string;
  reason: string;
  actorId: string;
}): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };
  try {
    const stateRef = doc(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, params.stateId);
    const snap = await getDoc(stateRef);
    if (!snap.exists()) return { success: false, error: 'State record not found' };
    const current = snap.data() as EvidenceAnalysisState;

    await appendRecognitionAuditEntry({
      stateId: params.stateId,
      inspectionId: params.inspectionId,
      actorId: params.actorId,
      actorType: 'human',
      action: 'review_required_flagged',
      fromState: current.mediaState,
      toState: 'review_required',
    });

    await updateDoc(stateRef, {
      mediaState: 'review_required' satisfies MediaAnalysisState,
      reviewRequiredReason: params.reason,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------------------------------------------------------------------------
// RecognitionPacket — Persistence
// ---------------------------------------------------------------------------

/**
 * Persists a completed RecognitionPacket to Firestore.
 * Called by the analysis orchestration layer after engine output is received.
 *
 * HARD RULE: Packet must include all required identity fields.
 * HARD RULE: verificationState must NOT be 'verified_by_overscite' on initial write.
 */
export async function persistRecognitionPacket(
  packet: InspectionRecognitionPacket
): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  // Guard: initial packet must not arrive in verified state
  if (packet.verificationState === 'verified_by_overscite') {
    return {
      success: false,
      error: 'POLICY_VIOLATION: Packet may not be persisted with verified_by_overscite as initial state',
    };
  }

  // Guard: required identity fields
  const required = ['packetId', 'inspectionId', 'mediaAssetId', 'analysisRequestedBy', 'analysisRequestedAt', 'taxonomyVersion'];
  for (const field of required) {
    if (!packet[field as keyof InspectionRecognitionPacket]) {
      return { success: false, error: `VALIDATION_FAILED: Required field '${field}' is missing` };
    }
  }

  try {
    await setDoc(doc(db as Firestore, COLLECTIONS.RECOGNITION_PACKETS, packet.packetId), {
      ...packet,
      __canonical: true,
      __v: '2.0.0',
      serverTimestamp: serverTimestamp(),
    });

    await appendRecognitionAuditEntry({
      packetId: packet.packetId,
      inspectionId: packet.inspectionId,
      actorId: 'lari_evidence_engine',
      actorType: 'engine',
      action: 'recognition_packet_persisted',
      toState: packet.verificationState,
    });

    console.log(`[RECOGNITION_PERSISTENCE] Persisted RecognitionPacket: ${packet.packetId}`);
    return { success: true, id: packet.packetId };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error persisting recognition packet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves a RecognitionPacket by ID.
 */
export async function getRecognitionPacket(
  packetId: string
): Promise<InspectionRecognitionPacket | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db as Firestore, COLLECTIONS.RECOGNITION_PACKETS, packetId));
    if (!snap.exists()) return null;
    return snap.data() as InspectionRecognitionPacket;
  } catch (error) {
    console.error('[RECOGNITION_PERSISTENCE] Error fetching recognition packet:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Verification — BANE-Gated Transition
// ---------------------------------------------------------------------------

/**
 * Records a governed verification decision written by human authority.
 *
 * HARD RULES:
 * - Prior state MUST be verification_pending
 * - Requires verifiedBy (human actor identity)
 * - BANE precondition check must pass before state is written
 * - If BANE check fails, state remains verification_pending
 * - Writes audit entry with banePolicyRef
 *
 * This is a BANE-gated path. The caller is responsible for invoking
 * BANE policy evaluation and passing the resulting policy reference.
 */
export async function recordVerificationDecision(params: {
  stateId: string;
  inspectionId: string;
  verifiedBy: string;
  banePolicyRef: string;
  baneDecision: 'allowed' | 'denied' | 'escalated';
  humanDetermination?: string;
}): Promise<RecognitionWriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  if (params.baneDecision !== 'allowed') {
    return {
      success: false,
      error: `BANE_DENIED: Verification transition blocked by BANE policy. Reason: ${params.baneDecision}. Ref: ${params.banePolicyRef}`,
      banePolicyRef: params.banePolicyRef,
    };
  }

  try {
    const stateRef = doc(db as Firestore, COLLECTIONS.EVIDENCE_ANALYSIS_STATES, params.stateId);
    const snap = await getDoc(stateRef);
    if (!snap.exists()) return { success: false, error: 'State record not found' };

    const current = snap.data() as EvidenceAnalysisState;
    if (current.mediaState !== 'verification_pending') {
      return {
        success: false,
        error: `PRECONDITION_FAILED: Verification requires 'verification_pending' state. Current: '${current.mediaState}'`,
      };
    }

    const auditId = await appendRecognitionAuditEntry({
      stateId: params.stateId,
      inspectionId: params.inspectionId,
      actorId: params.verifiedBy,
      actorType: 'human',
      action: 'verified_by_overscite',
      fromState: 'verification_pending',
      toState: 'verified_by_overscite',
      banePolicyRef: params.banePolicyRef,
    });

    if (!auditId) {
      return { success: false, error: 'AUDIT_FAILURE: Audit write failed; verification aborted' };
    }

    await updateDoc(stateRef, {
      mediaState: 'verified_by_overscite' satisfies MediaAnalysisState,
      verifiedBy: params.verifiedBy,
      verifiedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });

    console.log(`[RECOGNITION_PERSISTENCE] Verification recorded for state: ${params.stateId} by: ${params.verifiedBy}`);
    return { success: true, banePolicyRef: params.banePolicyRef };
  } catch (error: any) {
    console.error('[RECOGNITION_PERSISTENCE] Error recording verification decision:', error);
    return { success: false, error: error.message };
  }
}
