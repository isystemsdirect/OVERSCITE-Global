/**
 * BANE-Watcher — Canonical SecuritySource Types
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { Timestamp, FieldValue } from 'firebase/firestore';
import { SourceClass, SecurityTrustMetadata } from './security-event';

export interface SecuritySource {
  /** Unique registered source identifier (e.g. 'defender-endpoint-01'). */
  sourceId: string;
  /** Human-readable source name. */
  sourceName: string;
  /** Primary source class (metadata mapping). */
  sourceClass: SourceClass;
  /** Registered name of the software adapter. */
  adapterName: string;
  /** Whether the source is currently active and trusted. */
  isEnabled: boolean;
  /** Default trust metadata for signals from this source. */
  trustDefault: SecurityTrustMetadata;
  /** Last seen operational timestamp. */
  lastSeenAt?: Timestamp | FieldValue | string;
  /** Optional engineering or governance notes. */
  notes?: string;
}
