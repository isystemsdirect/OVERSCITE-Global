'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useShellLayout } from '@/lib/layout/shell-layout-state';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { CriticalAlertBand } from './CriticalAlertBand';
import { PilotInstrumentationStrip } from './PilotInstrumentationStrip';

interface LiveFlightSovereignShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @classification SOVEREIGN_SHELL
 * @authority Pilot
 * @purpose
 * Provides a zero-scroll, viewport-fit operational environment for Live Flight.
 * Handles automatic sidebar collapsing when ARMED.
 */
export function LiveFlightSovereignShell({ children, className }: LiveFlightSovereignShellProps) {
  const { isOverFLIGHTActive, isArmed } = useLiveFlight();
  const { isOverHUDOpen } = useShellLayout();

  if (!isOverFLIGHTActive) return <>{children}</>;

  return (
    <div className={cn(
      "z-40 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
      isArmed ? "fixed inset-0 bg-black" : "flex-1 relative bg-[#020406]",
      isOverHUDOpen && isArmed ? "pr-[620px]" : "pr-0",
      className
    )}>
      {/* OverFLIGHT™ Mode Indicator */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 backdrop-blur-md px-3 py-1 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">OverFLIGHT™ ACTIVE</span>
        </div>
      </div>

      <CriticalAlertBand />
      <PilotInstrumentationStrip />
      {/* Prime Operational Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>

      {/* TelePort Overlay Foundation (Future Logical Displays) */}
      <div id="teleport-overlay" className="pointer-events-none absolute inset-0 z-50" />
    </div>
  );
}
