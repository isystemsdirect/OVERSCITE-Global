/**
 * OCERSCITE Global — Canonical Data Provider
 * 
 * This service provides the authoritative interface for retrieving operational
 * records (Inspections, Clients, Inspectors) from the governed Firestore
 * truth path.
 * 
 * Classification: CANONICAL_LIVE
 * Authority: Director
 */

import { db } from '@/lib/firebase/config';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  Firestore,
} from 'firebase/firestore';
import { Inspection, Inspector, Client } from '@/lib/types';

/**
 * Fetches all Inspections from the canonical governed collection.
 */
export async function getInspections(): Promise<Inspection[]> {
  if (!db) return [];
  try {
    const q = query(collection(db as Firestore, 'inspections'), orderBy('date', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inspection));
  } catch (error) {
    console.error('[CANONICAL] Error fetching inspections:', error);
    return [];
  }
}

/**
 * Fetches inspections filtered by Client ID.
 */
export async function getInspectionsByClientId(clientId: string): Promise<Inspection[]> {
  if (!db) return [];
  try {
    const q = query(collection(db as Firestore, 'inspections'), where('clientId', '==', clientId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inspection));
  } catch (error) {
    console.error('[CANONICAL] Error fetching inspections for client:', error);
    return [];
  }
}

/**
 * Fetches active Inspectors/Agents.
 */
export async function getInspectors(): Promise<Inspector[]> {
  if (!db) return [];
  try {
    const q = query(collection(db as Firestore, 'users'), where('role', 'in', ['Inspector', 'Admin', 'Lead Inspector']));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inspector));
  } catch (error) {
    console.error('[CANONICAL] Error fetching inspectors:', error);
    return [];
  }
}

/**
 * Fetches Client records.
 */
export async function getClients(): Promise<Client[]> {
  if (!db) return [];
  try {
    const q = collection(db as Firestore, 'clients');
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Client));
  } catch (error) {
    console.error('[CANONICAL] Error fetching clients:', error);
    return [];
  }
}

/**
 * Fetches a single Client record by ID.
 */
export async function getClientById(id: string): Promise<Client | null> {
  if (!db) return null;
  try {
    const docRef = doc(db as Firestore, 'clients', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Client;
    }
    return null;
  } catch (error) {
    console.error('[CANONICAL] Error fetching client by ID:', error);
    return null;
  }
}

/**
 * Audit Check: Confirms if a record originated from the canonical source.
 */
export function isCanonical(data: any): boolean {
  return data && data.__canonical === true;
}
