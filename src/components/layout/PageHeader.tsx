import React from 'react';
import { TruthStateBadge } from './TruthStateBadge';
import { GuidanceHint } from '@/components/guidance/GuidanceHint';
import { cn } from '@/lib/utils';
import { TruthState } from '@/lib/types';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  status?: TruthState;
  guidanceId?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  description,
  status, 
  guidanceId,
  actions, 
  children,
  className 
}: PageHeaderProps) {
  const finalActions = actions || children;

  return (
    <div className={cn("flex flex-col gap-4 pb-8 mb-8 border-b border-white/5", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <TruthStateBadge state={status} />
              <span className="text-[10px] font-mono opacity-30 uppercase tracking-tighter">OS-G_VER_S1</span>
            </div>
            {guidanceId && <GuidanceHint guidanceId={guidanceId} />}
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase">
            {title}
          </h1>
        </div>
        {finalActions && (
          <div className="flex items-center gap-2 pb-1">
            {finalActions}
          </div>
        )}
      </div>
      
      {(description || subtitle) && (
        <div className="max-w-4xl">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light tracking-wide">
            {description || subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
