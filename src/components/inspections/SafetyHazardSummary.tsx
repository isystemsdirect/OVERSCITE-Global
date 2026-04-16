'use client';

/**
 * @fileOverview Safety Hazard Summary
 * @domain Inspections / Safety / Field Intelligence
 * @classification UI_COMPONENT — summary surface
 * @phase Phase 7 — Productization
 *
 * Provides a specialized summary of deterministic hazards and unsafe conditions
 * for safety-division exports and operational oversight.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, AlertCircle, MapPin, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SafetyHazardSummary({ inspectionId = 'IPN-992-G' }: { inspectionId?: string }) {
  return (
    <Card className="border-border/60 bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/20">
        <div className="flex items-center justify-between">
           <CardTitle className="text-md font-bold flex items-center gap-2">
             <ShieldAlert className="h-5 w-5 text-red-500" />
             Safety Operational Summary
           </CardTitle>
           <Badge variant="outline" className="text-[10px] font-mono tracking-widest bg-red-500/5 text-red-500 border-red-500/20">
             CRITICAL_HAZARD_PRIORITY
           </Badge>
        </div>
        <CardDescription className="text-xs">
          Safety Intelligence Output for Identification Sequence: <span className="text-foreground font-semibold uppercase">{inspectionId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Active Hazards Section */}
        <div className="space-y-4">
           {/* Hazard Item 1 */}
           <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
              <div className="p-2 bg-red-500/10 rounded text-red-500">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Structural Obstruction</span>
                    <span className="text-[9px] text-muted-foreground font-mono">CODE: SF-01-D</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">Obstruction in secondary path of egress detected.</p>
                 <div className="flex items-center gap-4 pt-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      Sector 4, NW Quadrant
                    </span>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter italic">Observation: Deterministic</span>
                 </div>
              </div>
           </div>

           {/* Unsafe Condition Item */}
           <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="p-2 bg-amber-500/10 rounded text-amber-500">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Visibility Limitation</span>
                    <span className="text-[9px] text-muted-foreground font-mono">CODE: SF-08-P</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">Partial occlusion on roof segment A — scope assessment pending.</p>
                 <div className="flex items-center gap-4 pt-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      Sector 1, Segment A
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter italic">Identification: Probabilistic</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Suggestion */}
        <div className="mt-6 pt-4 border-t border-border/40">
           <div className="p-3 rounded bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="h-3 w-3 text-primary animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Safety Intelligence Hint</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                Summary generated for Safety-Unit consumption. Evidence indicates deterministic patterns 
                requiring immediate clearance (SF-01-D) and probabilistic patterns suggesting further 
                onsite verification (SF-08-P).
              </p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
