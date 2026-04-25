'use client';

/**
 * @fileOverview Recognition Risk Feed
 * @domain Inspections / Field Intelligence / Operational Integration
 * @classification UI_COMPONENT — risk feed
 * @phase Phase 6 — Operational Integration
 *
 * Provides a live feed of recognition-derived hazards and risks for the
 * Environment & Safety command center.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RecognitionAdvisoryWidget } from '@/components/inspections/recognition-advisory-widget';
import { Activity, ShieldAlert, Zap } from 'lucide-react';

export function RecognitionRiskFeed() {
  return (
    <Card className="h-full border-border/50 bg-background/40 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3 border-b border-border/20">
        <div className="flex items-center justify-between">
           <CardTitle className="text-sm font-bold flex items-center gap-2">
             <ShieldAlert className="h-4 w-4 text-primary" />
             Recognition Risk Feed
           </CardTitle>
           <Zap className="h-3 w-3 text-amber-500 animate-pulse" />
        </div>
        <CardDescription className="text-[10px] uppercase tracking-wider">Passive Operational Intelligence</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Mock Data for Demonstration */}
        <RecognitionAdvisoryWidget 
          payload={{
            payloadId: 'weather-risk-1',
            mediaAssetId: 'm-901',
            inspectionId: 'i-440',
            type: 'hazard',
            summary: 'Roof surface degradation: Severe ponding and material blistering detected on northeast corner.',
            severity: 'critical',
            confidenceBand: 'verified_by_SCINGULAR',
            domainClass: 'safety',
            advisory: true,
            generatedAt: new Date().toISOString(),
            generatedBy: 'LARI_VISION:pass_6_occlusion'
          }}
          showLink={false}
        />

        <RecognitionAdvisoryWidget 
          payload={{
            payloadId: 'weather-risk-2',
            mediaAssetId: 'm-905',
            inspectionId: 'i-445',
            type: 'weather_exposed_site',
            summary: 'Site readiness advisory: Unsecured substrate detected in high-wind vector zone.',
            severity: 'warning',
            confidenceBand: 'high',
            domainClass: 'site',
            advisory: true,
            generatedAt: new Date().toISOString(),
            generatedBy: 'LARI_SITEOPS'
          }}
          showLink={false}
        />

        <div className="pt-2">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-3">
            This feed integrates LARI recognition findings with environmental safety thresholds. 
            All findings are advisory and serve to enrich the Inspection Risk Index (IRI).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
