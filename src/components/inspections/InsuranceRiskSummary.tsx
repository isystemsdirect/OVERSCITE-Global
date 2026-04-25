'use client';

/**
 * @fileOverview Insurance Risk Summary
 * @domain Inspections / Insurance / Risk Assessment
 * @classification UI_COMPONENT — summary surface
 * @phase Phase 7 — Productization
 *
 * Provides a specialized view for insurance consumers focusing on 
 * condition documentation and loss-risk indicators derived from recognition.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Landmark, Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InsuranceRiskSummary({ inspectionId = 'IPN-992-G' }: { inspectionId?: string }) {
  return (
    <Card className="border-border/60 bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/20">
        <div className="flex items-center justify-between">
           <CardTitle className="text-md font-bold flex items-center gap-2">
             <Landmark className="h-5 w-5 text-primary" />
             Insurance-Oriented Risk Summary
           </CardTitle>
           <Badge variant="outline" className="text-[10px] font-mono tracking-widest bg-primary/5 text-primary">
             VERSIONED_AUDIT: LARI_RECOG
           </Badge>
        </div>
        <CardDescription className="text-xs">
          Structured Condition Documentation for Inspection: <span className="text-foreground font-semibold">{inspectionId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Risk Indicators Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
            <Search className="h-3 w-3" />
            Condition / Loss-Risk Indicators (Probabilistic)
          </h4>
          
          <div className="grid gap-3">
            {[
              { label: 'Surface Degradation', level: 'Moderate', confidence: 0.89, category: 'Roofing' },
              { label: 'Moisture Intrusion Risk', level: 'Low', confidence: 0.72, category: 'Exterior' },
              { label: 'Material Weathering', level: 'High', confidence: 0.94, category: 'Site' }
            ].map((risk, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border/40">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{risk.category}</span>
                  <p className="text-sm font-semibold">{risk.label}</p>
                </div>
                <div className="text-right">
                   <Badge className={cn(
                     "text-[10px] font-bold",
                     risk.level === 'High' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" :
                     risk.level === 'Moderate' ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" :
                     "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                   )}>
                     {risk.level}
                   </Badge>
                   <p className="text-[9px] text-muted-foreground mt-1">Conf: {Math.round(risk.confidence * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Lineage Section */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
           <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-2">
             <FileText className="h-3.5 w-3.5" />
             Evidentiary Lineage Disclosure
           </h4>
           <p className="text-xs text-muted-foreground leading-relaxed">
             The findings above are derived from LARI-RECOG probabilistic pattern matching and 
             remain advisory. Every indicator is bound to a verified evidence packet within the 
             SCINGULAR audit chain.
           </p>
           <div className="pt-2">
             <button className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline">
               VIEW SOURCE EVIDENCE CHAIN <ExternalLink className="h-3 w-3" />
             </button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
