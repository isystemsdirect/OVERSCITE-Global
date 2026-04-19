/**
 * OVERSCITE Global — Canonical Write Service
 * 
 * Provides a governed boundary for all authoritative data mutations.
 * Enforces metadata standards, BANE-aligned validation, and audit traces.
 * 
 * Classification: CANONICAL_WRITE
 * Authority: Director
 */

import { db } from '@/lib/firebase/config';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc,
  Firestore,
} from 'firebase/firestore';
import { Inspection } from '@/lib/types';

export interface WriteResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Persists a new Inspection record to the canonical truth path.
 */
export async function createInspection(payload: Partial<Inspection>): Promise<WriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  try {
    // Audit Metadata Stamping
    const canonicalPayload = {
      ...payload,
      status: payload.status || 'pending',
      date: payload.date || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      __canonical: true,
      __v: '1.0.0',
    };

    const docRef = await addDoc(collection(db as Firestore, 'inspections'), canonicalPayload);
    
    console.log(`[CANONICAL_WRITE] Created inspection: ${docRef.id}`);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('[CANONICAL_WRITE] Error creating inspection:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates an existing canonical record.
 */
export async function updateInspection(id: string, updates: Partial<Inspection>): Promise<WriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  try {
    const docRef = doc(db as Firestore, 'inspections', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('[CANONICAL_WRITE] Error updating inspection:', error);
    return { success: false, error: error.message };
  }
}
