/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 * 
 * PageIdentityBand (Layer 2)
 * Secondary shell surface identifying the division and mission.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TrustClass } from '@/lib/contracts/truth-state-contract';

interface PageIdentityBandProps {
  title: string;
  missionSubtitle: string;
  trustClass?: TrustClass;
  className?: string;
  children?: React.ReactNode; // For contextual tags/badges
}

export function PageIdentityBand({
  title,
  missionSubtitle,
  trustClass,
  className,
  children
}: PageIdentityBandProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 py-6 border-b border-white/5 bg-background/40 px-4 lg:px-6",
      className
    )}>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
          {title}
        </h1>
        {trustClass && (
          <span className="px-1.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-[9px] font-bold text-primary tracking-widest uppercase">
            {trustClass}
          </span>
        )}
        {children}
      </div>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        {missionSubtitle}
      </p>
    </div>
  );
}
