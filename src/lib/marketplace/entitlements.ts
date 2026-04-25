/**
 * Entitlements Service — client-side read layer.
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Reads entitlement records.
 * Activation, suspension, and revocation: Cloud Functions only (Admin SDK).
 *
 * CRITICAL: 'pending' is NOT 'active'. Never display pending entitlements as active.
 * Entitlement must not be activated from client-side optimistic state.
 *
 * Implementation Status: PARTIAL — display layer live; activation via Cloud Function scaffold.
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { getDb } from '../firebase';
import type { EntitlementRecord, EntitlementStatus } from '../types/marketplace';

const ENTITLEMENTS_COL = 'market_entitlements';

/**
 * Retrieve entitlement records for a user or org owner.
 */
export async function getEntitlements(
  ownerType: 'user' | 'org',
  ownerId: string,
  statusFilter?: EntitlementStatus
): Promise<EntitlementRecord[]> {
  const db = getDb();
  const col = collection(db as Firestore, ENTITLEMENTS_COL);
  const constraints: Parameters<typeof query>[1][] = [
    where('owner_type', '==', ownerType),
    where('owner_id', '==', ownerId),
  ];

  if (statusFilter) {
    constraints.push(where('status', '==', statusFilter));
  }

  constraints.push(orderBy('created_at', 'desc'), limit(100));
  const q = query(col, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ entitlement_id: d.id, ...d.data() }) as EntitlementRecord);
}

/**
 * Check if a specific feature flag is active for an owner.
 * Returns false if no active entitlement carries the flag.
 * Server-side verification is required before granting actual feature access.
 */
export async function checkEntitlementFlag(
  featureFlag: string,
  ownerType: 'user' | 'org',
  ownerId: string
): Promise<boolean> {
  const entitlements = await getEntitlements(ownerType, ownerId, 'active');
  return entitlements.some(e => e.feature_flags.includes(featureFlag));
}

/**
 * Retrieve active entitlements only.
 */
export async function getActiveEntitlements(
  ownerType: 'user' | 'org',
  ownerId: string
): Promise<EntitlementRecord[]> {
  return getEntitlements(ownerType, ownerId, 'active');
}
