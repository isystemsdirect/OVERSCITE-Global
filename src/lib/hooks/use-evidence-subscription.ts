/**
 * @fileOverview Real-Time Evidence State Subscription Hook
 * @domain Inspections / Field Intelligence / Evidence Pipeline
 * @classification LIVE_SUBSCRIPTION — evidence analysis state
 * @phase Phase 3 — Live Evidence Governance
 *
 * Provides a React hook for real-time Firestore subscription to
 * EvidenceAnalysisState documents for a given inspection.
 *
 * HARD RULES:
 * - Live UI may NOT claim a transition before persistence confirms it
 * - Subscription failure must degrade honestly, not silently
 * - No state flicker may temporarily imply verified status without confirmed write
 * - All state reads come from Firestore snapshot, never optimistic local state
 *
 * @see src/lib/services/recognition-persistence-service.ts
 * @see src/components/inspections/evidence-lane.tsx
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import type { EvidenceAnalysisState } from '@/lib/contracts/evidence-analysis-contract';
import type { MediaAnalysisState } from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Subscription State
// ---------------------------------------------------------------------------

export type SubscriptionStatus =
  | 'idle'           // Not yet connected
  | 'connecting'     // Initial connection attempt
  | 'live'           // Active live subscription
  | 'degraded'       // Subscription failed, using last known data
  | 'offline';       // Firestore not available

export interface EvidenceSubscriptionState {
  /** Current evidence analysis state records */
  evidenceStates: EvidenceAnalysisState[];
  /** Subscription connection status */
  status: SubscriptionStatus;
  /** ISO 8601 timestamp of last successful data receipt */
  lastUpdated: string | null;
  /** Error message if subscription is degraded */
  error: string | null;
  /** Count of live state transitions observed since subscription start */
  transitionCount: number;
}

// ---------------------------------------------------------------------------
// Hook: useEvidenceSubscription
// ---------------------------------------------------------------------------

/**
 * React hook providing real-time Firestore subscription for EvidenceAnalysisState.
 *
 * @param inspectionId - The inspection to subscribe to
 * @param enabled - Whether the subscription is active (use for conditional mounting)
 * @returns EvidenceSubscriptionState with live data and connection status
 *
 * HARD RULES:
 * - Returns `status: 'degraded'` on failure — never silently returns empty
 * - `evidenceStates` only updates from confirmed Firestore snapshots
 * - Transition count is monotonic — never decremented
 */
export function useEvidenceSubscription(
  inspectionId: string | null,
  enabled: boolean = true
): EvidenceSubscriptionState {
  const [state, setState] = useState<EvidenceSubscriptionState>({
    evidenceStates: [],
    status: 'idle',
    lastUpdated: null,
    error: null,
    transitionCount: 0,
  });

  const transitionCountRef = useRef(0);
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Cleanup previous subscription
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!enabled || !inspectionId || !db) {
      setState((prev) => ({
        ...prev,
        status: !db ? 'offline' : 'idle',
        error: !db ? 'Firestore not available' : null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: 'connecting', error: null }));

    try {
      const q = query(
        collection(db, 'evidence_analysis_states'),
        where('inspectionId', '==', inspectionId),
        orderBy('createdAt', 'desc')
      );

      const unsub = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const states = snapshot.docs.map((doc) => ({
            ...doc.data(),
            stateId: doc.id,
          })) as EvidenceAnalysisState[];

          // Count transitions (snapshot changes minus initial load)
          let newTransitionCount = transitionCountRef.current;
          if (state.status === 'live') {
            const modifications = snapshot.docChanges().filter((change) => change.type === 'modified').length;
            if (modifications > 0) {
              newTransitionCount += modifications;
              transitionCountRef.current = newTransitionCount;
            }
          }

          // Phase 5 Optimization: Only update state if length changed or transitions occurred.
          // In a high-throughput queue, this prevents duplicate layout thrashing.
          setState((prevState) => {
            if (
              prevState.status === 'live' &&
              prevState.evidenceStates.length === states.length &&
              prevState.transitionCount === newTransitionCount
            ) {
              return prevState;
            }
            return {
              evidenceStates: states,
              status: 'live',
              lastUpdated: new Date().toISOString(),
              error: null,
              transitionCount: newTransitionCount,
            };
          });
        },
        (error) => {
          console.error('[EVIDENCE_SUBSCRIPTION] Subscription error:', error);
          setState((prev) => ({
            ...prev,
            status: 'degraded',
            error: `Subscription error: ${error.message}. Using last known data.`,
          }));
        }
      );

      unsubRef.current = unsub;
    } catch (error: any) {
      console.error('[EVIDENCE_SUBSCRIPTION] Setup error:', error);
      setState((prev) => ({
        ...prev,
        status: 'degraded',
        error: `Setup error: ${error.message}`,
      }));
    }

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [inspectionId, enabled]);

  return state;
}

// ---------------------------------------------------------------------------
// Hook: useAuditLogSubscription
// ---------------------------------------------------------------------------

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorType: 'human' | 'engine';
  action: string;
  fromState?: MediaAnalysisState;
  toState?: MediaAnalysisState;
  timestamp: string;
  packetId?: string;
  stateId?: string;
  inspectionId: string;
  banePolicyRef?: string;
}

export interface AuditSubscriptionState {
  entries: AuditLogEntry[];
  status: SubscriptionStatus;
  lastUpdated: string | null;
  error: string | null;
}

/**
 * React hook for real-time Firestore subscription to recognition_audit_log.
 *
 * @param inspectionId - The inspection to subscribe to
 * @param enabled - Whether the subscription is active
 * @returns AuditSubscriptionState with live entries and connection status
 *
 * HARD RULES:
 * - Audit rendering must not edit audit history
 * - Entries are append-oriented and attributable
 */
export function useAuditLogSubscription(
  inspectionId: string | null,
  enabled: boolean = true
): AuditSubscriptionState {
  const [state, setState] = useState<AuditSubscriptionState>({
    entries: [],
    status: 'idle',
    lastUpdated: null,
    error: null,
  });

  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!enabled || !inspectionId || !db) {
      setState((prev) => ({
        ...prev,
        status: !db ? 'offline' : 'idle',
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: 'connecting', error: null }));

    try {
      const q = query(
        collection(db, 'recognition_audit_log'),
        where('inspectionId', '==', inspectionId),
        orderBy('timestamp', 'desc')
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const entries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AuditLogEntry[];

          setState({
            entries,
            status: 'live',
            lastUpdated: new Date().toISOString(),
            error: null,
          });
        },
        (error) => {
          console.error('[AUDIT_SUBSCRIPTION] Subscription error:', error);
          setState((prev) => ({
            ...prev,
            status: 'degraded',
            error: `Subscription error: ${error.message}`,
          }));
        }
      );

      unsubRef.current = unsub;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        status: 'degraded',
        error: `Setup error: ${error.message}`,
      }));
    }

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [inspectionId, enabled]);

  return state;
}
