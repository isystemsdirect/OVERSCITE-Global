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
  placeholder: {
    label: 'PLACEHOLDER',
    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
  candidate: {
    label: 'CANDIDATE',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  accepted: {
    label: 'ACCEPTED',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  review_required: {
    label: 'REVIEW REQ',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  deprecated: {
    label: 'DEPRECATED',
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
  archived: {
    label: 'ARCHIVED',
    color: 'bg-slate-700/10 text-slate-400 border-slate-700/20',
  },
  blocked: {
    label: 'BLOCKED',
    color: 'bg-red-500/20 text-red-500 border-red-500/30',
  },
  experimental: {
    label: 'EXP',
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  },
  pending: {
    label: 'PENDING',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  active: {
    label: 'ACTIVE',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  completed: {
    label: 'COMPLETE',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  draft: {
    label: 'DRAFT',
    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
  Final: {
    label: 'FINAL',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  'In Progress': {
    label: 'IN PROG',
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  },
};

export function getStatusConfig(status: string | undefined): StatusConfig {
  if (!status) return TRUTH_STATE_CONFIG.placeholder;
  return TRUTH_STATE_CONFIG[status as TruthState] || {
    label: status.toUpperCase(),
    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };
}
