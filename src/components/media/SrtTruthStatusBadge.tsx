import React from 'react';
import { AcceptedPipelineState } from '../../lib/srt/state-machine/srt-pipeline-state-machine';
import { ShieldCheck, ShieldAlert, Shield, Loader2, Database } from 'lucide-react';

export interface SrtTruthStatusBadgeProps {
  state: AcceptedPipelineState | 'unknown';
}

/**
 * Maps the internal edge pipeline state machine to the explicitly governed
 * subset of truth-status disclosure tags per CB-005.
 */
function getBadgeConfig(state: AcceptedPipelineState | 'unknown') {
  switch (state) {
    case 'accepted_unanalyzed':
    case 'derivative_generation_complete':
    case 'derivative_generation_pending':
    case 'stored_source':
    case 'intake_in_progress':
    case 'accepted_pending_queue':
      return {
        label: 'Accepted Only',
        icon: <Database size={10} />,
        textColor: 'text-gray-400',
        borderColor: 'border-gray-800',
        bgColor: 'bg-gray-950',
      };
    case 'accepted_analysis_requested':
    case 'analysis_pending':
    case 'analysis_in_progress':
      return {
        label: 'Analysis Requested',
        icon: <Loader2 size={10} className="animate-spin" />,
        textColor: 'text-sky-400',
        borderColor: 'border-sky-900',
        bgColor: 'bg-sky-950',
      };
    case 'analysis_complete':
    case 'findings_recorded':
      return {
        label: 'Analyzed by OVERSCITE',
        icon: <Shield size={10} />,
        textColor: 'text-amber-500',
        borderColor: 'border-amber-900',
        bgColor: 'bg-[#1a1000]',
      };
    case 'verification_pending':
      return {
        label: 'Verification Pending',
        icon: <Loader2 size={10} className="animate-spin" />,
        textColor: 'text-amber-500',
        borderColor: 'border-amber-900',
        bgColor: 'bg-[#1a1000]',
      };
    case 'verification_bound':
    case 'export_ready':
    case 'export_generated':
      return {
        label: 'Analyzed & Verified by OVERSCITE',
        icon: <ShieldCheck size={10} />,
        textColor: 'text-emerald-500',
        borderColor: 'border-emerald-900',
        bgColor: 'bg-emerald-950',
      };
    case 'quarantined_failure':
    case 'terminal_failure':
    case 'retry_scheduled':
      return {
        label: 'Review Required',
        icon: <ShieldAlert size={10} />,
        textColor: 'text-red-500',
        borderColor: 'border-red-900',
        bgColor: 'bg-red-950',
      };
    default:
      return {
        label: 'Unknown State',
        icon: <Database size={10} />,
        textColor: 'text-gray-600',
        borderColor: 'border-gray-800',
        bgColor: 'bg-transparent',
      };
  }
}

export const SrtTruthStatusBadge: React.FC<SrtTruthStatusBadgeProps> = ({ state }) => {
  const config = getBadgeConfig(state);

  return (
    <div
      className={`inline-flex flex-row items-center gap-1.5 px-2 py-0.5 rounded border ${config.borderColor} ${config.bgColor} ${config.textColor}`}
      title={`Internal State: ${state}`}
    >
      {config.icon}
      <span className="text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
};
