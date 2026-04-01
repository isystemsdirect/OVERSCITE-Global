// DO NOT MODIFY — CANONICAL TRUTH STATES
export const TRUTH_STATES = [
  "live",
  "partial",
  "mock",
  "candidate",
  "accepted",
  "blocked",
  "archived"
] as const;

export type TruthState = typeof TRUTH_STATES[number];
