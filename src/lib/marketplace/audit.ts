/**
 * Market Audit Service — client-side audit event creation helper.
 * UTCB-S V1.0 — OVERSCITE Global Marketplace Stack
 *
 * Critical mutations write audit events via Cloud Functions (Admin SDK, append-only).
 * This module provides typed helpers for read-side display of audit records.
 *
 * Implementation Status: SCAFFOLD — writes deferred to recordMarketAuditEvent Cloud Function.
 */

import { collection, query, where, orderBy, limit, getDocs, Firestore } from 'firebase/firestore';
import { getDb } from '../firebase';
import type { MarketAuditEvent, MarketEntityType } from '../types/marketplace';

const AUDIT_COLLECTION = 'market_audit_events';

/**
 * Retrieve recent audit events for a given entity.
 * Read-only. Admin/finance_admin access only enforced by Firestore rules.
 */
export async function getAuditEventsForEntity(
  entityType: MarketEntityType,
  entityId: string,
  maxResults = 50
): Promise<MarketAuditEvent[]> {
  const db = getDb();
  const col = collection(db as Firestore, AUDIT_COLLECTION);
  const q = query(
    col,
    where('entity_type', '==', entityType),
    where('entity_id', '==', entityId),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ event_id: d.id, ...d.data() }) as MarketAuditEvent);
}

/**
 * Retrieve recent audit events for a given actor.
 * Read-only. Admin access only enforced by Firestore rules.
 */
export async function getAuditEventsForActor(
  actorId: string,
  maxResults = 100
): Promise<MarketAuditEvent[]> {
  const db = getDb();
  const col = collection(db as Firestore, AUDIT_COLLECTION);
  const q = query(
    col,
    where('actor_id', '==', actorId),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ event_id: d.id, ...d.data() }) as MarketAuditEvent);
}
