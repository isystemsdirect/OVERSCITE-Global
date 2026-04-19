/**
 * Orders Service — client-side read layer.
 * UTCB-S V1.0 — OVERSCITE Global Marketplace Stack
 *
 * Reads order records spanning both marketplace planes.
 * Order CREATION and payment capture via Cloud Functions only (Admin SDK).
 *
 * 'payment_authorized' is NOT 'payment_captured'.
 * 'order_fulfilled' does NOT guarantee entitlement activation until backend validates.
 *
 * Implementation Status: PARTIAL — display layer live; payment processing: backend pipeline required.
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
  Firestore,
} from 'firebase/firestore';
import { getDb } from '../firebase';
import type { OrderRecord, OrderStatus } from '../types/marketplace';

const ORDERS_COL = 'market_orders';

/**
 * Retrieve orders for a buyer.
 */
export async function getOrdersByBuyer(
  buyerArcId: string,
  statusFilter?: OrderStatus,
  maxResults = 50
): Promise<OrderRecord[]> {
  const db = getDb();
  const col = collection(db as Firestore, ORDERS_COL);
  const constraints: Parameters<typeof query>[1][] = [
    where('buyer_arc_id', '==', buyerArcId),
  ];

  if (statusFilter) {
    constraints.push(where('status', '==', statusFilter));
  }

  constraints.push(orderBy('created_at', 'desc'), limit(maxResults));
  const q = query(col, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ order_id: d.id, ...d.data() }) as OrderRecord);
}

/**
 * Retrieve orders for a buyer org.
 */
export async function getOrdersByBuyerOrg(
  orgId: string,
  maxResults = 50
): Promise<OrderRecord[]> {
  const db = getDb();
  const col = collection(db as Firestore, ORDERS_COL);
  const q = query(
    col,
    where('buyer_org_id', '==', orgId),
    orderBy('created_at', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ order_id: d.id, ...d.data() }) as OrderRecord);
}

/**
 * Retrieve a single order by ID.
 */
export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const db = getDb();
  const ref = doc(db as Firestore, ORDERS_COL, orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { order_id: snap.id, ...snap.data() } as OrderRecord;
}
