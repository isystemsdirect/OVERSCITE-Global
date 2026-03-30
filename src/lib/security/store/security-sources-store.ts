/**
 * BANE-Watcher — SecuritySources Store
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { SecuritySource } from '@/types/security-source';

const COLLECTION_NAME = 'security_sources';

export const securitySourcesStore = {
  /**
   * Registers or updates a security source / adapter.
   */
  async registerSource(source: SecuritySource): Promise<void> {
    const db = getDb();
    const sourceRef = doc(db, COLLECTION_NAME, source.sourceId);
    await setDoc(sourceRef, {
      ...source,
      lastSeenAt: source.lastSeenAt || new Date().toISOString()
    }, { merge: true });
  },

  /**
   * Retrieves a security source by ID.
   */
  async getSource(sourceId: string): Promise<SecuritySource | null> {
    const db = getDb();
    const snap = await getDoc(doc(db, COLLECTION_NAME, sourceId));
    return snap.exists() ? (snap.data() as SecuritySource) : null;
  },

  /**
   * Lists all enabled security sources.
   */
  async listEnabledSources(): Promise<SecuritySource[]> {
    const db = getDb();
    const q = query(collection(db, COLLECTION_NAME), where('isEnabled', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as SecuritySource);
  }
};
