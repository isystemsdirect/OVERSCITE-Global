import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusConfig } from '@/lib/utils/status-helpers';
import { Badge } from '@/components/ui/badge';

interface TruthStateBadgeProps {
  status: string | undefined;
  className?: string;
  showIcon?: boolean;
}

export function TruthStateBadge({ status, className, showIcon = true }: TruthStateBadgeProps) {
  const config = getStatusConfig(status);
  
  return (
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
  );
}
