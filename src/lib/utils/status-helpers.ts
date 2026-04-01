import { TruthState } from '../types';

export interface StatusConfig {
  label: string;
  color: string;
  icon?: string;
}

export const TRUTH_STATE_CONFIG: Record<TruthState, StatusConfig> = {
  live: {
    label: 'LIVE',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  partial: {
    label: 'PARTIAL',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  mock: {
    label: 'MOCK',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  candidate: {
    label: 'CANDIDATE',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  accepted: {
    label: 'ACCEPTED',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  archived: {
    label: 'ARCHIVED',
    color: 'bg-slate-700/10 text-slate-400 border-slate-700/20',
  },
  blocked: {
    label: 'BLOCKED',
    color: 'bg-red-500/20 text-red-500 border-red-500/30',
  }
};

export function getStatusConfig(status: TruthState): StatusConfig {
  return TRUTH_STATE_CONFIG[status] || {
    label: 'MOCK',
    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };
}
