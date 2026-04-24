'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  History,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CIP_Metadata, EECIP_Metadata } from '@/lib/types/client-intelligence';
import { Separator } from '@/components/ui/separator';

interface ClientCIPWorkspaceProps {
  cip: CIP_Metadata;
  eecip?: EECIP_Metadata;
  onAcceptEnhancement?: () => void;
}

export function ClientCIPWorkspace({ 
  cip, 
  eecip, 
  onAcceptEnhancement 
}: ClientCIPWorkspaceProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Accepted Baseline Layer */}
        <Card className="bg-card/40 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden group">
          <CardHeader className="bg-primary/5 pb-6 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Accepted Baseline</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">Truth Class: CIP</CardDescription>
                </div>
              </div>
              <Badge variant="pro" className="uppercase tracking-tighter">v{cip.cip_version}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Metadata Sync</span>
                <p className="font-mono text-xs italic">Synchronized with ArcHive™</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Last Verified</span>
                <p className="font-mono text-xs">{cip.last_verified_at || 'Never'}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-background/20 border border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "Accepted truth states define the authoritative operational boundary for this client. 
                Any mutation to this layer requires BANE signature verification."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Candidate Layer */}
        <Card className={cn(
          "bg-card/40 backdrop-blur-md border border-border/50 shadow-xl overflow-hidden transition-all duration-500",
          eecip ? "border-pro/30" : "opacity-50"
        )}>
          <CardHeader className={cn(
            "pb-6 border-b border-border/20",
            eecip ? "bg-pro/5" : "bg-muted/5"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", eecip ? "bg-pro/10" : "bg-muted/10")}>
                  <Sparkles className={cn("h-5 w-5", eecip ? "text-pro" : "text-muted-foreground")} />
                </div>
                <div>
                  <CardTitle className="text-lg">Intelligence Enhancement</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">Truth Class: EECIP</CardDescription>
                </div>
              </div>
              {eecip && <Badge variant="outline" className="bg-pro/5 text-pro border-pro/20">v{eecip.eecip_version}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {eecip ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Candidate Sources</span>
                    <div className="flex flex-wrap gap-1">
                      {eecip.sources.map(s => <Badge key={s} variant="secondary" className="text-[9px] h-4">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Retrieved At</span>
                    <p className="font-mono text-xs">{eecip.retrieved_at}</p>
                  </div>
                </div>

                <Separator className="opacity-20" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-pro animate-pulse" />
                    <span className="text-xs font-bold">New Attribution Conflict Detected</span>
                  </div>
                  <div className="p-4 rounded-xl bg-pro/10 border border-pro/20">
                    <p className="text-xs leading-relaxed">
                      LARI has detected conflicting legal address metadata from SEC and Regional Registry sources. 
                      Review required before baseline promotion.
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-pro hover:bg-pro/90 text-white font-black uppercase tracking-widest text-[11px] h-10 rounded-lg group"
                    onClick={onAcceptEnhancement}
                  >
                    Accept Enhanced Intelligence
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                <History className="h-10 w-10 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No Active Enhancement Candidates</p>
                <p className="text-[10px] mt-1">LARI is monitoring background sources...</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
