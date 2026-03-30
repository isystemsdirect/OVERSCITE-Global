/**
 * BANE-Watcher — SecurityEvents Store
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { SecurityEvent } from '@/types/security-event';

const COLLECTION_NAME = 'security_events';

export const securityEventsStore = {
  /**
   * Persists a normalized SecurityEvent to the dedicated security collection.
   */
  async saveEvent(event: SecurityEvent): Promise<void> {
    const db = getDb();
    const eventRef = doc(db, COLLECTION_NAME, event.id);
    await setDoc(eventRef, event);
  },

  /**
   * Retrieves a single SecurityEvent by ID.
   */
  async getEvent(id: string): Promise<SecurityEvent | null> {
    const db = getDb();
    const eventSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    return eventSnap.exists() ? (eventSnap.data() as SecurityEvent) : null;
  },

  /**
   * Subscribes to a live stream of the most recent security events.
   */
  subscribeToLiveEvents(callback: (events: SecurityEvent[]) => void, maxCount = 50) {
    const db = getDb();
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(maxCount)
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => doc.data() as SecurityEvent);
      callback(events);
    });
  }
};
