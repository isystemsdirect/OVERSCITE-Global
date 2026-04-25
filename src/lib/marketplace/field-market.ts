/**
 * Field Market Service — client-side data access layer.
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Reads from Field Market Firestore collections.
 * ALL writes must go through Cloud Functions (Admin SDK). No client-side writes.
 *
 * Implementation Status: PARTIAL — read layer live; write/dispatch via Cloud Functions scaffold.
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
import type {
  JobListing,
  FieldAgentProfile,
  DispatchOffer,
  ReputationPacket,
  PayoutRecord,
  FieldMarketStatus,
  FieldJobType,
} from '../types/marketplace';

const JOBS_COL = 'market_jobs';
const OFFERS_COL = 'market_job_offers';
const AGENTS_COL = 'market_agent_profiles';
const REPUTATION_COL = 'market_reputation_packets';
const PAYOUTS_COL = 'market_payouts';

export interface JobListingFilters {
  status?: FieldMarketStatus;
  job_type?: FieldJobType;
  org_id?: string;
  max_results?: number;
}

/**
 * Retrieve active job listings with optional filters.
 * Returns only 'live' status jobs by default for public feed.
 */
export async function getJobListings(filters: JobListingFilters = {}): Promise<JobListing[]> {
  const db = getDb();
  const col = collection(db as Firestore, JOBS_COL);
  const constraints: Parameters<typeof query>[1][] = [];

  const status = filters.status ?? 'live';
  constraints.push(where('status', '==', status));

  if (filters.job_type) {
    constraints.push(where('job_type', '==', filters.job_type));
  }
  if (filters.org_id) {
    constraints.push(where('org_id', '==', filters.org_id));
  }

  constraints.push(orderBy('created_at', 'desc'));
  constraints.push(limit(filters.max_results ?? 50));

  const q = query(col, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ job_id: d.id, ...d.data() }) as JobListing);
}

/**
 * Retrieve a single job listing by ID.
 */
export async function getJobListingById(jobId: string): Promise<JobListing | null> {
  const db = getDb();
  const ref = doc(db as Firestore, JOBS_COL, jobId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { job_id: snap.id, ...snap.data() } as JobListing;
}

/**
 * Retrieve dispatch offers for a given job.
 */
export async function getDispatchOffersForJob(jobId: string): Promise<DispatchOffer[]> {
  const db = getDb();
  const col = collection(db as Firestore, OFFERS_COL);
  const q = query(col, where('job_id', '==', jobId), orderBy('offered_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ offer_id: d.id, ...d.data() }) as DispatchOffer);
}

/**
 * Retrieve dispatch offers for a given agent (incoming offers).
 */
export async function getOffersForAgent(agentId: string): Promise<DispatchOffer[]> {
  const db = getDb();
  const col = collection(db as Firestore, OFFERS_COL);
  const q = query(
    col,
    where('recipient_agent_id', '==', agentId),
    orderBy('offered_at', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ offer_id: d.id, ...d.data() }) as DispatchOffer);
}

/**
 * Retrieve a field agent profile by agent_id.
 */
export async function getAgentProfile(agentId: string): Promise<FieldAgentProfile | null> {
  const db = getDb();
  const ref = doc(db as Firestore, AGENTS_COL, agentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { agent_id: snap.id, ...snap.data() } as FieldAgentProfile;
}

/**
 * Retrieve reputation packets for a given subject (agent or publisher).
 */
export async function getReputationPackets(subjectId: string): Promise<ReputationPacket[]> {
  const db = getDb();
  const col = collection(db as Firestore, REPUTATION_COL);
  const q = query(
    col,
    where('subject_id', '==', subjectId),
    where('moderation_status', '==', 'approved'),
    orderBy('created_at', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ packet_id: d.id, ...d.data() }) as ReputationPacket);
}

/**
 * Retrieve payout records for a given recipient.
 * [PARTIAL] — payout_release requires backend payment pipeline integration.
 */
export async function getPayoutsForRecipient(recipientId: string): Promise<PayoutRecord[]> {
  const db = getDb();
  const col = collection(db as Firestore, PAYOUTS_COL);
  const q = query(
    col,
    where('recipient_id', '==', recipientId),
    orderBy('created_at', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ payout_id: d.id, ...d.data() }) as PayoutRecord);
}
