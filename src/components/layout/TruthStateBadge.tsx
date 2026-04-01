import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusConfig } from '@/lib/utils/status-helpers';
import { Badge } from '@/components/ui/badge';
import { GuidanceHint } from '@/components/guidance/GuidanceHint';

import { TruthState } from '@/lib/types';

interface TruthStateBadgeProps {
  status?: TruthState;
  state?: TruthState; // Added support for 'state' prop used in inspections/page.tsx
  className?: string;
  showIcon?: boolean;
}

export function TruthStateBadge({ status, state, className, showIcon = true }: TruthStateBadgeProps) {
  const finalState = status || state || "mock";
  const config = getStatusConfig(finalState);
  
  return (
    <div className="flex items-center gap-1.5">
      <Badge 
        variant="outline" 
        className={cn(
          "font-black tracking-widest text-[10px] uppercase px-2 py-0 h-5 border shadow-sm",
          config.color,
          className
        )}
      >
        {config.label}
      </Badge>
      <GuidanceHint guidanceId="truth-states" />
    </div>
  );
}
