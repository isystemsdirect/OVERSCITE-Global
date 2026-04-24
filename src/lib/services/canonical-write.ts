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
  getDoc,
  Firestore,
} from 'firebase/firestore';
import { 
  Inspection, 
  ForensicAuditEntry, 
  MutationClass 
} from '@/lib/types';
import { createPayloadHash } from '@/lib/ipn/crypto';

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

/**
 * Governed Forensic Update Path.
 * Binds intelligence mutations to the forensic audit chain.
 */
export async function forensicUpdate(params: {
  entityId: string;
  entityType: 'client' | 'property' | 'inspection' | 'workflow';
  mutationClass: MutationClass;
  payload: any;
  actorId: string;
  actorRole: string;
  actorType: 'human' | 'system' | 'agent';
  environmentalContext?: any;
}): Promise<WriteResult> {
  if (!db) return { success: false, error: 'Database not initialized' };

  try {
    const collectionName = params.entityType === 'inspection' ? 'inspections' : params.entityType + 's';
    const docRef = doc(db as Firestore, collectionName, params.entityId);
    
    // 1. Fetch current state for versioning and hash chaining
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      return { success: false, error: 'Entity not found' };
    }
    
    const currentData = currentDoc.data();
    const currentVersion = currentData.__v || '1.0.0';
    const priorHash = currentData.__last_hash || '0x00000000';
    
    // 2. Logic for Version Increment (Doctrine: Only accepted baseline mutations)
    let nextVersion = currentVersion;
    if (params.mutationClass === 'accepted_major_revision') {
      const parts = currentVersion.split('.');
      const vMajor = parseInt(parts[0]) || 1;
      nextVersion = `${vMajor + 1}.0.0`;
    } else if (params.mutationClass === 'accepted_minor_refinement') {
      const parts = currentVersion.split('.');
      const vMajor = parseInt(parts[0]) || 1;
      const vMinor = parseInt(parts[1]) || 0;
      nextVersion = `${vMajor}.${vMinor + 1}.0`;
    }

    // 3. Generate Forensic Payload and Hash
    const eventTime = Date.now();
    const eventHash = await createPayloadHash({
      payload: params.payload,
      priorHash,
      timestamp: eventTime,
      actorId: params.actorId
    });

    const auditEntry: ForensicAuditEntry = {
      event_id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      prior_event_hash: priorHash,
      event_hash: eventHash,
      checksum: eventHash,
      timestamp: serverTimestamp(),
      actor_type: params.actorType,
      actor_id: params.actorId,
      role: params.actorRole,
      policy_version: 'OVERSCITE-1.1',
      engine_version: 'BANE-2.0',
      success_state: true,
      mutation_class: params.mutationClass,
      linkedEntityType: params.entityType,
      linkedEntityId: params.entityId,
      truthStateBefore: currentData.status || 'unknown',
      truthStateAfter: params.payload.status || currentData.status,
      provenance: {
        source: params.actorType === 'human' ? 'user_interface' : 'system_logic',
        origin_id: params.actorId
      },
      environmental_context: params.environmentalContext
    };

    // 4. Atomic Update
    await updateDoc(docRef, {
      ...params.payload,
      __v: nextVersion,
      __last_hash: eventHash,
      updatedAt: serverTimestamp()
    });

    // Write to audit ledger
    const auditColl = collection(db as Firestore, 'forensic_ledger');
    await addDoc(auditColl, auditEntry);

    console.log(`[FORENSIC_WRITE] Mutation ${params.mutationClass} committed. v${nextVersion}. Hash: ${eventHash}`);
    
    return { success: true, id: auditEntry.event_id };
  } catch (error: any) {
    console.error('[FORENSIC_WRITE] Error executing governed mutation:', error);
    return { success: false, error: error.message };
  }
}
