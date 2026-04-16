/**
 * @fileOverview Recognition Advisory Service
 * @domain Inspections / Field Intelligence / Operational Integration
 * @classification CANONICAL_SERVICE — advisory handoff
 * @phase Phase 6 — Operational Integration
 *
 * Manages the persistence and retrieval of passive advisory payloads for
 * downstream operational surfaces (Map, Scheduler, Safety).
 *
 * HARD RULES:
 * - Advisories are PASSIVE and non-mutating.
 * - Every advisory must carry truth-state provenance.
 * - Human authority remains final for all advisory conversions.
 */

import { db } from '@/lib/firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import type { 
  MapReadyHookPayload 
} from '@/lib/hooks/recognition-output-hooks';

export interface SchedulerAdvisoryPayload {
  payloadId: string;
  inspectionId: string;
  siteId?: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review_required' | 'unsafe_condition' | 'weather_exposure' | 'readiness_hint';
  summary: string;
  suggestedAction: string;
  confidence: number;
  sourcePacketId: string;
  generatedAt: string;
  advisory: true;
}

/**
 * Persists a map advisory payload to the operational intelligence layer.
 */
export async function persistMapAdvisory(payload: MapReadyHookPayload): Promise<string> {
  if (!db) throw new Error('Database not initialized');
  
  const colRef = collection(db, 'recognition_advisory_map');
  const docRef = await addDoc(colRef, {
    ...payload,
    persistedAt: new Date().toISOString()
  });
  
  return docRef.id;
}

/**
 * Persists a scheduler advisory payload.
 */
export async function persistSchedulerAdvisory(payload: SchedulerAdvisoryPayload): Promise<string> {
  if (!db) throw new Error('Database not initialized');
  
  const colRef = collection(db, 'recognition_advisory_scheduler');
  const docRef = await addDoc(colRef, {
    ...payload,
    persistedAt: new Date().toISOString()
  });
  
  return docRef.id;
}

/**
 * Retrieves recent map advisories for a specific site or inspection.
 */
export async function getRecentMapAdvisories(params: {
  inspectionId?: string;
  siteId?: string;
  limitCount?: number;
}): Promise<MapReadyHookPayload[]> {
  if (!db) return [];
  
  const colRef = collection(db, 'recognition_advisory_map');
  let q = query(colRef, orderBy('generatedAt', 'desc'), limit(params.limitCount || 20));
  
  if (params.inspectionId) {
    q = query(q, where('inspectionId', '==', params.inspectionId));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as MapReadyHookPayload);
}

/**
 * Retrieves recent scheduler advisories.
 */
export async function getRecentSchedulerAdvisories(limitCount = 10): Promise<SchedulerAdvisoryPayload[]> {
  if (!db) return [];
  
  const colRef = collection(db, 'recognition_advisory_scheduler');
  const q = query(colRef, orderBy('generatedAt', 'desc'), limit(limitCount));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as SchedulerAdvisoryPayload);
}
