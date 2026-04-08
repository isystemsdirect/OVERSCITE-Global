import * as admin from 'firebase-admin';
import { SrtAuditEvent } from '../../../../src/lib/srt/contracts/srt-audit-event';

/**
 * emitSrtAuditEvent
 *
 * Writes an append-only audit event into the canonical Firestore ledger.
 */
export async function emitSrtAuditEvent(event: SrtAuditEvent): Promise<void> {
  const db = admin.firestore();
  
  try {
    await db.collection('srt_audit_events').doc(event.auditEventId).set({
      ...event,
      serverTime: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error(`[AUDIT_FAILURE] Failed to write event ${event.auditEventId}:`, error);
    // Since audit log writing is critical, its failure usually throws to block transition
    throw new Error('Audit Logging Failure: Cannot write integrity event.');
  }
}
