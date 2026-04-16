/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * GlobalSystemHeader (Layer 1)
 * Fixed top bar identifying the application and its trust posture.
 *
 * @integration_note
 * This component is NOT a replacement for TopCommandBar. It is an enriched shell-contract
 * header that wraps the existing ScingPanel and adds TrustClass band, TruthStateCluster,
 * and ConnectedOrchestrationBadge. Integration into AppShell is additive — TopCommandBar
 * is adapted to consume this component rather than being removed.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ShellTruthState,
  TrustClass,
  ConnectedOrchestrationMode
} from '@/lib/contracts/truth-state-contract';
import { TruthStateCluster } from './TruthStateCluster';
import { ConnectedOrchestrationBadge } from './ConnectedOrchestrationBadge';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScingPanel } from '@/components/scing/ScingPanel';

interface GlobalSystemHeaderProps {
  appName: string;
  trustClass: TrustClass;
  truthState: ShellTruthState;
  connectedOrchestrationMode: ConnectedOrchestrationMode;
  className?: string;
  children?: React.ReactNode; // For quick actions or bridge elements
}

export function GlobalSystemHeader({
  appName,
  trustClass,
  truthState,
  connectedOrchestrationMode,
  className,
  children
}: GlobalSystemHeaderProps) {
  return (
    <header className={cn(
      "shell-surface sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/30 px-4 lg:px-6 w-full shadow-sm",
      className
    )}>
      {/* ─── Left Group: App Identity ─── */}
      <div className="flex items-center gap-4 shrink-0">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tighter text-white uppercase italic">
            {appName}
          </span>
          <span className="text-[9px] font-mono text-primary tracking-[0.2em] font-bold">
            {trustClass}
          </span>
        </div>
      </div>

      {/* ─── Center Group: Scing Command & Orchestration ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-1">
        <ScingPanel />
        <ConnectedOrchestrationBadge mode={connectedOrchestrationMode} />
      </div>

      {/* ─── Right Group: Truth-State & Quick Actions ─── */}
      <div className="flex items-center gap-4 shrink-0">
        <TruthStateCluster state={truthState} />
        {children}
      </div>
    </header>
  );
}
