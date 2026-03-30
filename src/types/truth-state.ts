/**
 * BANE-Watcher — Canonical TruthState Types
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 *
 * Governance: BANE-governed, human-sovereign.
 * Disclosure of status is mandatory for all security-monitored signals.
 */

export type TruthState =
  /** Live, real-time stream from source adapter. */
  | 'live'
  /** Cached from local or remote session storage. */
  | 'cached'
  /** Incomplete signal set (missing critical fields). */
  | 'partial'
  /** Successfully normalized into canonical SecurityEvent. */
  | 'normalized'
  /** Awaiting human adjudication or higher-level correlation. */
  | 'review_required';
