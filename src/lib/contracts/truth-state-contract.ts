/**
 * @classification UI_CONTRACT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Truth State Contract Bridge
 * Maps legacy/internal truth states to the Ultra-Grade Shell Contract labels.
 * Archive-before-mutate strategy applied: Internal truth-states.ts is not modified.
 */

import { TruthState as InternalTruthState } from '../constants/truth-states';

export const SHELL_TRUTH_STATES = [
  "LIVE",
  "PARTIAL",
  "MOCK",
  "CANDIDATE",
  "REVIEW REQUIRED",
  "BLOCKED"
] as const;

export type ShellTruthState = typeof SHELL_TRUTH_STATES[number];

export type TrustClass = 'ULTRA-GRADE' | 'PRECISION-GRADE' | 'ASSISTIVE-GRADE';

export type ConnectedOrchestrationMode = 'POWERED_BY' | 'CONNECTED_TO' | 'CONNECTED_TO_EXTERNAL';

/**
 * Maps internal TruthState to ShellTruthState labels
 */
export function mapToShellTruthState(internalState?: InternalTruthState | string): ShellTruthState {
  if (!internalState) return 'CANDIDATE';

  const state = internalState.toLowerCase();

  switch (state) {
    case 'live':
    case 'accepted':
    case 'approved':
      return 'LIVE';
    case 'partial':
      return 'PARTIAL';
    case 'mock':
      return 'MOCK';
    case 'blocked':
      return 'BLOCKED';
    case 'review_required':
      return 'REVIEW REQUIRED';
    case 'candidate':
      return 'CANDIDATE';
    case 'archived':
      return 'CANDIDATE'; // Map archived to candidate for shell display
    default:
      return 'CANDIDATE';
  }
}

/**
 * Returns canonical CSS class for ShellTruthState
 */
export function getShellTruthStateStyles(state: ShellTruthState): string {
  switch (state) {
    case 'LIVE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'PARTIAL': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'MOCK': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'CANDIDATE': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    case 'REVIEW REQUIRED': return 'bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse';
    case 'BLOCKED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default: return '';
  }
}
