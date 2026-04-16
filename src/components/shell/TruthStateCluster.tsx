/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * TruthStateCluster
 * Dedicated component for rendering the shell truth-state with absolute semantic precision.
 * Maps ShellTruthState to HUD-compliant styles.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ShellTruthState,
  getShellTruthStateStyles,
  mapToShellTruthState
} from '@/lib/contracts/truth-state-contract';
import { TruthState as InternalTruthState } from '@/lib/constants/truth-states';

interface TruthStateClusterProps {
  state?: ShellTruthState | InternalTruthState | string;
  className?: string;
  showReviewIndicator?: boolean;
}

export function TruthStateCluster({
  state,
  className,
  showReviewIndicator = false
}: TruthStateClusterProps) {
  // Use bridge to ensure canonical labeling
  const shellState = typeof state === 'string' && state.toUpperCase() === state
    ? state as ShellTruthState
    : mapToShellTruthState(state as InternalTruthState);

  const styles = getShellTruthStateStyles(shellState);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "px-2 py-0.5 rounded border text-[10px] font-bold tracking-widest uppercase",
        styles
      )}>
        {shellState}
      </div>

      {showReviewIndicator && shellState === 'PARTIAL' && (
        <span className="text-[10px] text-orange-500/60 font-mono animate-pulse">
          REVIEW REQUIRED
        </span>
      )}
    </div>
  );
}
