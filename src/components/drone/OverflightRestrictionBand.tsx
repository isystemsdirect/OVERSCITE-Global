'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module RESTRICTION_BAND
 * @authority BANE / LARI-FC
 * @purpose Discloses restricted action postures or caution states below primary instruments.
 */
export function OverflightRestrictionBand() {
  const { faultSeverity, consequenceState, blockReason } = useLiveFlight();

  if (faultSeverity === 'advisory' && consequenceState === 'idle') return null;
  if (faultSeverity === 'failsafe') return null; // Handled by FailsafeBanner

  const isCaution = faultSeverity === 'caution';
  const isCritical = faultSeverity === 'critical';
  const isRestricted = consequenceState === 'restricted';

  return (
    <div className={cn(
      "absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-500 z-40",
      isCritical ? "bg-red-950/80 border-red-500/50 text-red-200" :
      isCaution ? "bg-yellow-950/80 border-yellow-500/50 text-yellow-200" :
      isRestricted ? "bg-blue-950/80 border-blue-500/50 text-blue-200" :
      "bg-black/60 border-white/10 text-white/60"
    )}>
      {(isCaution || isCritical) ? <AlertTriangle className="h-3 w-3 animate-pulse" /> : <Info className="h-3 w-3" />}
      
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black tracking-widest uppercase">
          {isCritical ? 'CRITICAL_FAULT' : isCaution ? 'SYSTEM_CAUTION' : isRestricted ? 'POSTURE_RESTRICTED' : 'SYSTEM_ADVISORY'}
        </span>
        <div className="h-3 w-[1px] bg-white/20" />
        <span className="text-[9px] font-mono font-bold tracking-tight">
          {blockReason || (isCritical ? 'THRESHOLD_EXCEEDED' : isCaution ? 'LINK_DEGRADED' : 'ACK_REQUIRED')}
        </span>
      </div>

      {isCritical && <div className="absolute inset-0 bg-red-500/5 animate-ping rounded-full pointer-events-none" />}
    </div>
  );
}
