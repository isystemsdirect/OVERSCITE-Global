/**
 * BANE-Watcher — SecurityAudit Store
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { SecurityAuditLog } from '@/types/security-audit-log';

const COLLECTION_NAME = 'security_audit_log';

export const securityAuditStore = {
  /**
   * Records a lineage entry for a security event action.
   */
  async recordAudit(audit: SecurityAuditLog): Promise<string> {
    const db = getDb();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), audit);
    return docRef.id;
  },

  /**
   * Subscribes to audit logs for a specific event ID.
   */
  subscribeToEventAudit(eventId: string, callback: (logs: SecurityAuditLog[]) => void) {
    const db = getDb();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('eventId', '==', eventId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data() as SecurityAuditLog);
      callback(logs);
    });
  }
};
