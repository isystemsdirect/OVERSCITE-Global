'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Plane,
  Compass, 
  Wind, 
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification UNIFIED_POSTURE_IDENTITY_CARD
 * @authority Director
 * @purpose Combined FC truth-state and Platform Identity for high-density flight deck.
 */
export function UnifiedPostureIdentityCard() {
  const { flightMode, isArmed, safeStateVerified, telemetry } = useLiveFlight();

  // Mapping state to display values
  const telemetryDisplay = {
    mode: telemetry.altitude > 1 ? 'AIRBORNE' : 'STABILIZE',
    vibration: telemetry.vibration,
    imu_sync: telemetry.imuSync,
    failsafe: 'INACTIVE',
    hw_id: 'OVR-A1-88',
    firmware: 'v4.2.1-LARI'
  };

  return (
    <Card className="border-white/10 bg-black/60 backdrop-blur-md shrink-0 mb-3 overflow-hidden">
      <CardHeader className="py-2 px-3 border-b border-white/5 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest text-primary">
            <Cpu className="h-3.5 w-3.5" />
            Core Posture & ID
          </CardTitle>
          <div className="flex gap-1">
             <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
             <div className="h-1.5 w-1.5 rounded-full bg-primary opacity-50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-2.5">
        
        {/* Row 1: Identity & Mode */}
        <div className="flex items-center justify-between bg-white/5 p-1.5 rounded border border-white/5">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Platform</span>
            <span className="text-[10px] font-mono font-bold text-white leading-none">{telemetryDisplay.hw_id}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Posture</span>
            <span className="text-[10px] font-mono font-bold text-primary leading-none">{telemetryDisplay.mode}</span>
          </div>
        </div>

        {/* Row 2: Stability Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/5 border border-white/5">
            <ShieldCheck className={cn("h-3 w-3", telemetryDisplay.vibration === 'NOMINAL' ? "text-green-500" : "text-yellow-500")} />
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-muted-foreground uppercase">Vibration</span>
              <span className="text-[9px] font-mono text-white/80 leading-none">{telemetryDisplay.vibration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-white/5 border border-white/5">
            <ArrowRightLeft className="h-3 w-3 text-primary" />
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-muted-foreground uppercase">IMU Sync</span>
              <span className="text-[9px] font-mono text-white/80 leading-none">{telemetryDisplay.imu_sync}</span>
            </div>
          </div>
        </div>

        {/* Failsafe / Safety Strip */}
        <div className={cn(
          "p-1.5 rounded flex items-center justify-between border",
          safeStateVerified ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"
        )}>
          <span className={cn(
            "text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5",
            safeStateVerified ? "text-green-500/70" : "text-red-500/70"
          )}>
            <ShieldAlert className="h-3 w-3" />
            {safeStateVerified ? 'Safety Verified' : 'Failsafe Alert'}
          </span>
          <span className="text-[8px] font-mono text-muted-foreground">{telemetryDisplay.firmware}</span>
        </div>

      </CardContent>
    </Card>
  );
}
