'use client';

/**
 * @fileOverview Contractor Advisory Region
 * @domain Contractor Division / Field Intelligence
 * @classification UI_COMPONENT — operational advisory
 * @phase Phase 7 — Productization
 *
 * Provides a governed UI component for contractors to see recognition-derived 
 * readiness signals and hazard advisories.
 * 
 * HARD RULES:
 * - Deterministic vs Probabilistic distinctions must be clear.
 * - Human final authority must be explicitly linked.
 * - Non-mutating: provide assistance, not autonomous commands.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldAlert, Zap, Pin, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContractorAdvisoryRegion() {
  return (
    <div className="space-y-4">
      <Card className="border-border/40 bg-white/[0.02] backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              Operational Readiness Advisories
            </CardTitle>
            <Badge variant="outline" className="text-[9px] font-mono tracking-tighter bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              LARI_RECOG ACTIVE
            </Badge>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Recognition-Derived Field Intelligence
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Readiness Hint */}
          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-indigo-400" />
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
                Site Readiness Hint
              </span>
            </div>
            <p className="text-xs text-indigo-100/70 leading-relaxed">
              Scan analysis suggests **Site Occupied** state across 80% of target segments. 
              Mobilization readiness high, but obstruction review recommended for Segment C.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[9px] text-indigo-400/60 italic">Identification (Probabilistic): 92% Conf.</span>
            </div>
          </div>

          {/* Hazard Advisory */}
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                Hazard Advisory
              </span>
            </div>
            <p className="text-xs text-amber-100/70 leading-relaxed">
              **Structural Obstruction** detected in primary field of operation. 
              Coordinates: 34.0522, -118.2437. 
            </p>
            <div className="flex items-center gap-2 pt-1 text-[9px]">
               <span className="text-amber-500/60 italic font-mono uppercase tracking-tight">Observation (Deterministic): Verified State</span>
            </div>
          </div>

          {/* Visibility Warning */}
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-white/40" />
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wide">
                Visibility Limitation
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed italic">
              Partial occlusion on North-East quadrant. Scope verification required prior to final sign-off.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] text-white/20 italic leading-tight text-center">
              Advisories serve to assists in workflow prioritization. Final human assessment is the authority for all site actions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
