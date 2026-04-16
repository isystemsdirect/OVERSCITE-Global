/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * PrimaryMissionRegion (Layer 4)
 * Dominant work surface for the operator.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface PrimaryMissionRegionProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PrimaryMissionRegion({
  children,
  className,
  fullWidth = false
}: PrimaryMissionRegionProps) {
  return (
    <div className={cn(
      "flex-1 min-h-0 min-w-0 transition-all duration-300",
      !fullWidth && "mx-auto max-w-7xl w-full px-4 lg:px-6",
      className
    )}>
      {children}
    </div>
  );
}
