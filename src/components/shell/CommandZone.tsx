/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * CommandZone (Layer 3)
 * Stable command hierarchy for page-level actions.
 * Groups actions into Scope, Search/Filter, Primary, and Secondary slots.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CommandZoneProps {
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  filterControls?: React.ReactNode;
  searchControls?: React.ReactNode;
  scopeControls?: React.ReactNode;
  dangerActions?: React.ReactNode;
  className?: string;
}

export function CommandZone({
  primaryActions,
  secondaryActions,
  filterControls,
  searchControls,
  scopeControls,
  dangerActions,
  className
}: CommandZoneProps) {
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-4 py-4 px-4 lg:px-6 bg-white/[0.02] border-b border-white/5",
      className
    )}>
      {/* ─── Left Group: Scope & Search ─── */}
      <div className="flex flex-wrap items-center gap-3">
        {scopeControls && (
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            {scopeControls}
          </div>
        )}
        {searchControls}
        {filterControls}
      </div>

      {/* ─── Right Group: Actions ─── */}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {secondaryActions}
        {primaryActions}
        {dangerActions && (
          <div className="pl-3 border-l border-rose-500/20">
            {dangerActions}
          </div>
        )}
      </div>
    </div>
  );
}
