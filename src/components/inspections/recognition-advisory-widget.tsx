'use client';

/**
 * @fileOverview Recognition Advisory Widget
 * @domain Inspections / Field Intelligence / Operational Integration
 * @classification UI_COMPONENT — advisory display
 * @phase Phase 6 — Operational Integration
 *
 * Provides a governed UI component for displaying passive recognition 
 * advisories. This widget is used in Map (Locations SCINGULAR), Safety, 
 * and Scheduler surfaces.
 * 
 * HARD RULES:
 * - Displays provenance and truth-state clearly.
 * - Non-mutating: provides links to evidence, NOT autonomous commands.
 * - Visual priority follows advisory severity.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, ShieldAlert, Clock, MapPin, ExternalLink, Activity, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MapReadyHookPayload } from '@/lib/hooks/recognition-output-hooks';

interface RecognitionAdvisoryWidgetProps {
  payload: MapReadyHookPayload;
  className?: string;
  showLink?: boolean;
}

export function RecognitionAdvisoryWidget({ payload, className, showLink = true }: RecognitionAdvisoryWidgetProps) {
  const isCritical = payload.severity === 'critical';
  const isWarning = payload.severity === 'warning';

  const IconMap = {
    hazard: ShieldAlert,
    review_required: Clock,
    visibility_limited: Info,
    unsafe_condition: ShieldAlert,
    site_state: Activity,
    industrial_corrosion: AlertTriangle,
    safety_ppe: ShieldAlert,
    drawing_discrepancy_readiness: Info,
    weather_exposed_site: Cloud,
  };

  const Icon = IconMap[payload.type as keyof typeof IconMap] || AlertTriangle;

  return (
    <Card className={cn(
      "overflow-hidden border-l-4 transition-all duration-300",
      isCritical ? "border-l-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : 
      isWarning ? "border-l-amber-500 bg-amber-500/5" : "border-l-blue-500 bg-blue-500/5",
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-1.5 rounded-md",
            isCritical ? "bg-red-500/10 text-red-500" : 
            isWarning ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono tracking-wider bg-background/50 h-4 px-1.5 uppercase">
                {payload.type.replace(/_/g, ' ')}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(payload.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <p className="text-xs font-medium text-foreground leading-snug mt-1">
              {payload.summary}
            </p>
            
            <div className="flex items-center gap-3 pt-1">
               <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
                  <span>Confidence:</span>
                  <span className={cn(
                    "font-semibold",
                    payload.confidenceBand === 'verified_by_SCINGULAR' ? "text-emerald-500" :
                    payload.confidenceBand === 'high' ? "text-primary" :
                    payload.confidenceBand === 'moderate' ? "text-amber-500" : "text-destructive"
                  )}>
                    {payload.confidenceBand.replace(/_/g, ' ')}
                  </span>
               </div>
               
               {showLink && (
                  <button className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline ml-auto">
                    Evidentiary Link <ExternalLink className="h-2.5 w-2.5" />
                  </button>
               )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
