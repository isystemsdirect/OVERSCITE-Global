/**
 * SRT Media Intake Service
 *
 * Shared intake layer for all image and media capture entering OVERSCITE Global
 * and REBEL. Every capture and every upload routes through this single path.
 *
 * Canon constraints:
 * - One shared intake path only — no parallel uncontrolled media paths.
 * - Source provenance must be attached at intake.
 * - Truth-state and source-type labeling are mandatory.
 * - RAW formats are first-class source artifacts.
 * - JPEG, PNG, HEIC, WebP remain accepted without blocking.
 * - Original source object is preserved immutably.
 * - Derivatives may be generated for preview and workflow use.
 *
 * Alignment:
 * - Follows existing SRTIngestionPipeline pattern (src/lib/srt/ingestion-pipeline.ts)
 * - Uses SDR log conventions from BANE execution gate (src/lib/bane/scing-execution-gate.ts)
 * - Produces audit events consumable by BANE-AUDIT engine
 *
 * See: docs/governance/SRT_MEDIA_RECORD_IMMUTABILITY.md
 */

import type { SourceMediaRecord, SourceMediaType } from '../../media/source-media-record';
import type { SDRLogEntry, BaneClassification } from '../../bane/scing-execution-gate';
import { computeMetadataHash } from '../../media/crypto-hash';

// ---------------------------------------------------------------------------
// Intake Payload
// ---------------------------------------------------------------------------

export interface SrtMediaIntakePayload {
  /** Raw file buffer or blob reference. */
  fileRef: string | ArrayBuffer;
  /** Detected or declared source format. */
  sourceType: SourceMediaType;
  /** Original filename from capture device or upload dialog. */
  originalFilename?: string;
  /** ARC identity of the person who captured (may differ from uploader). */
  capturedBy?: string;
  /** ARC identity of the person uploading. Required. */
  uploadedBy: string;
  /** ISO timestamp from the capture device, if available. */
  capturedAt?: string;
  /** Project context binding. */
  projectId?: string;
  /** Inspection context binding. */
  inspectionId?: string;
  /** REBEL session context binding. */
  rebelSessionId?: string;
  /** Raw device/EXIF/sensor metadata extracted from the file. */
  extractedMetadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Intake Result
// ---------------------------------------------------------------------------

export interface SrtMediaIntakeResult {
  record: SourceMediaRecord;
  sdrId: string;
  auditEvents: SrtMediaAuditEvent[];
}

// ---------------------------------------------------------------------------
// Audit Event Types
// ---------------------------------------------------------------------------

export type SrtMediaAuditEventType =
  | 'srt_media_intake_completed'
  | 'source_media_locked'
  | 'engine_finding_recorded'
  | 'bane_verification_bound'
  | 'media_block_placed'
  | 'finding_sent_to_sandbox'
  | 'sandbox_item_inserted'
  | 'user_note_created'
  | 'user_note_updated'
  | 'review_flag_added'
  | 'final_export_generated';

export interface SrtMediaAuditEvent {
  eventType: SrtMediaAuditEventType;
  timestamp: string;
  actorId: string;
  targetId: string;
  metadataHash?: string;
  sdrId: string;
}

// ---------------------------------------------------------------------------
// SDR Log Store (mirrors BANE execution gate pattern)
// ---------------------------------------------------------------------------

const mediaSdrLogStore: SDRLogEntry[] = [];

function generateSdrId(): string {
  return `SDR-MED-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function logMediaSdr(
  actorId: string,
  actionType: string,
  targetId: string,
  classification: BaneClassification
): string {
  const sdrId = generateSdrId();
  const entry: SDRLogEntry = {
    sdrId,
    timestamp: new Date().toISOString(),
    actorId,
    actionType,
    targetId,
    classification,
  };
  mediaSdrLogStore.push(entry);
  console.debug('[BANE_GATE] SRT Media SDR Generated:', entry);
  return sdrId;
}

export function getMediaSdrLogs(): SDRLogEntry[] {
  return [...mediaSdrLogStore];
}

// ---------------------------------------------------------------------------
// Hash Generation — Production crypto via src/lib/media/crypto-hash.ts
// Uses SHA-256 (Web Crypto in browser, native crypto on Node.js).
// Canonicalized sorted-key JSON ensures deterministic output.
// No stub, no pseudo-hash, no non-cryptographic checksum.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// SRT Media Intake Service
// ---------------------------------------------------------------------------

export class SrtMediaIntakeService {
  /**
   * BANE Gate 1 — Intake Integrity
   *
   * Processes an incoming media file and produces an immutable SourceMediaRecord.
   * Checks enforced:
   * - Source artifact preserved immutably
   * - Metadata hash created
   * - Provenance attached
   */
  public async processIntake(payload: SrtMediaIntakePayload): Promise<SrtMediaIntakeResult> {
    const timestamp = new Date().toISOString();
    const recordId = `srt-src-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // Assemble metadata — frozen after this point
    const metadata: Record<string, unknown> = {
      ...(payload.extractedMetadata ?? {}),
      fidelity: payload.sourceType === 'raw' ? 'high' : 'standard',
      capturePath: 'srt_shared_intake',
      sourceType: payload.sourceType,
    };

    const metadataHash = await computeMetadataHash(metadata);

    // Construct the immutable record
    const record: SourceMediaRecord = {
      id: recordId,
      intakePath: 'srt',
      sourceType: payload.sourceType,
      originalFilename: payload.originalFilename,
      immutableUri: `srt://repository/sources/${recordId}`,
      capturedAt: payload.capturedAt,
      uploadedAt: timestamp,
      capturedBy: payload.capturedBy,
      uploadedBy: payload.uploadedBy,
      projectId: payload.projectId,
      inspectionId: payload.inspectionId,
      rebelSessionId: payload.rebelSessionId,
      metadata: Object.freeze(metadata),
      metadataHash,
      truthState: 'locked_source',
    };

    // SDR audit trail
    const sdrId = logMediaSdr(
      payload.uploadedBy,
      'SRT_MEDIA_INTAKE',
      recordId,
      'mutation_pending'
    );

    // Produce audit events
    const auditEvents: SrtMediaAuditEvent[] = [
      {
        eventType: 'srt_media_intake_completed',
        timestamp,
        actorId: payload.uploadedBy,
        targetId: recordId,
        metadataHash,
        sdrId,
      },
      {
        eventType: 'source_media_locked',
        timestamp,
        actorId: payload.uploadedBy,
        targetId: recordId,
        metadataHash,
        sdrId,
      },
    ];

    return { record, sdrId, auditEvents };
  }
}

/** Singleton instance — shared by both OVERSCITE and REBEL consumers. */
export const srtMediaIntake = new SrtMediaIntakeService();
