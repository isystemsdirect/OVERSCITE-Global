/**
 * @fileOverview Governed Database Initializer
 * @domain Inspections / Environment 
 * @canonical true
 * @phase Phase 5 — Governed Data Provisioning
 * 
 * Provides a governed path to seed or initialize required collections 
 * (sites, hazards, incidents, reports) if they are missing locally.
 * HARD RULE: Do not allow silent collection emergence through incidental writes.
 */

import { getDb } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, Timestamp, Firestore } from 'firebase/firestore';

export async function initializeMissingCollections() {
  const db = getDb();
  if (!db) return { success: false, reason: 'Firebase not initialized' };

  try {
    const requiredCollections = ['sites', 'hazards', 'incidents', 'reports', 'inspection_types'];
    const results: Record<string, string> = {};

    for (const col of requiredCollections) {
      const snap = await getDocs(collection(db as Firestore, col));
      if (snap.empty) {
        // Seed a dummy initialization artifact so the collection exists
        const initDoc = doc(collection(db as Firestore, col), 'SEED_ARTIFACT');
        await setDoc(initDoc, {
          _isSeed: true,
          initializedAt: Timestamp.now(),
          governanceOrigin: 'UTCB-S__20260418-031500Z__SCING__014',
          docType: 'system_initializer'
        });
        results[col] = 'Seeded';
      } else {
        results[col] = 'Exists';
      }
    }

    return { success: true, results };
  } catch (error: any) {
    console.error('Governed Initializer Error:', error);
    return { success: false, reason: error.message };
  }
}
