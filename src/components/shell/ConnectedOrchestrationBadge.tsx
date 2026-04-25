/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * ConnectedOrchestrationBadge
 * Communicates the upstream Prime intelligence connection.
 * Whitelists approved phrase families per the Shell Contract.
 * SCINGULAR remains visibly downstream of SCINGULAR Prime — not the root.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ConnectedOrchestrationMode } from '@/lib/contracts/truth-state-contract';

interface ConnectedOrchestrationBadgeProps {
  mode: ConnectedOrchestrationMode;
  className?: string;
}

const PHRASES: Record<ConnectedOrchestrationMode, string> = {
  POWERED_BY: "Powered by SCINGULAR Prime Orchestration",
  CONNECTED_TO: "Connected to SCINGULAR Prime Intelligence",
  CONNECTED_TO_EXTERNAL: "Bound to external Prime Intelligence domains"
};

export function ConnectedOrchestrationBadge({ mode, className }: ConnectedOrchestrationBadgeProps) {
  const phrase = PHRASES[mode] ?? PHRASES.CONNECTED_TO;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-white/5",
      "text-[10px] font-mono tracking-wider text-muted-foreground/60 uppercase whitespace-nowrap",
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
      {phrase}
    </div>
  );
}
