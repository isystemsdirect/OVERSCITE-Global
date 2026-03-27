/**
 * Capability Marketplace Service — client-side data access layer.
 * UTCB-S V1.0 — OVERSCITE Global Marketplace Stack
 *
 * Reads from Marketplace Firestore collections.
 * ALL writes must go through Cloud Functions (Admin SDK). No client-side writes.
 *
 * Implementation Status: PARTIAL — read layer live; entitlement activation via Cloud Function scaffold.
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { getDb } from '../firebase';
import type {
  CapabilityProduct,
  LariKey,
  MarketplaceStatus,
  CapabilityProductType,
} from '../types/marketplace';

const PRODUCTS_COL = 'market_products';
const KEYS_COL = 'market_lari_keys';

export interface ProductFilters {
  status?: MarketplaceStatus;
  product_type?: CapabilityProductType;
  publisher_org_id?: string;
  max_results?: number;
}

/**
 * Retrieve live capability products for the catalog.
 * Default: returns only 'live' status products.
 */
export async function getCapabilityProducts(filters: ProductFilters = {}): Promise<CapabilityProduct[]> {
  const db = getDb();
  const col = collection(db, PRODUCTS_COL);
  const constraints: Parameters<typeof query>[1][] = [];

  const status = filters.status ?? 'live';
  constraints.push(where('status', '==', status));

  if (filters.product_type) {
    constraints.push(where('product_type', '==', filters.product_type));
  }
  if (filters.publisher_org_id) {
    constraints.push(where('publisher_org_id', '==', filters.publisher_org_id));
  }

  constraints.push(orderBy('updated_at', 'desc'));
  constraints.push(limit(filters.max_results ?? 50));

  const q = query(col, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ product_id: d.id, ...d.data() }) as CapabilityProduct);
}

/**
 * Retrieve a single capability product by ID.
 */
export async function getCapabilityProductById(productId: string): Promise<CapabilityProduct | null> {
  const db = getDb();
  const ref = doc(db, PRODUCTS_COL, productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { product_id: snap.id, ...snap.data() } as CapabilityProduct;
}

/**
 * Retrieve LARI Keys assigned to a given org.
 */
export async function getLariKeysByOrg(orgId: string): Promise<LariKey[]> {
  const db = getDb();
  const col = collection(db, KEYS_COL);
  const q = query(
    col,
    where('org_id', '==', orgId),
    orderBy('created_at', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ key_id: d.id, ...d.data() }) as LariKey);
}

/**
 * Retrieve LARI Keys assigned to a specific ARC user.
 */
export async function getLariKeysByArcUser(arcId: string): Promise<LariKey[]> {
  const db = getDb();
  const col = collection(db, KEYS_COL);
  const q = query(
    col,
    where('assigned_arc_id', '==', arcId),
    orderBy('created_at', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ key_id: d.id, ...d.data() }) as LariKey);
}
