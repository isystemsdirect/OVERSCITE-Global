'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Wind, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { METHOD_REGISTRY } from '@/lib/inspections/methods/registry';
import { proposeOptimalWindow, ScheduleProposal } from '@/lib/services/smart-scheduler';
import { useToast } from '@/hooks/use-toast';
import { StandardGeospatialViewport } from '@/components/maps/StandardGeospatialViewport';

interface ClientPIPWorkspaceProps {
  clientId: string;
  properties: any[]; // In real implementation, these are PIPs
}

export function ClientPIPWorkspace({ 
  clientId, 
  properties 
}: ClientPIPWorkspaceProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ScheduleProposal[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const { toast } = useToast();

  const handleEvaluate = async () => {
    if (!selectedPropertyId || !selectedMethodId) {
      toast({ title: "Validation Error", description: "Method selection required for SmartSCHEDULER™ evaluation.", variant: "destructive" });
      return;
    }
    
    setEvaluating(true);
    try {
      // Mock coordinates for evaluation
      const res = await proposeOptimalWindow(selectedMethodId, 34.0522, -118.2437);
      setProposals(res);
      toast({ title: "Evaluation Complete", description: "SmartSCHEDULER™ has generated posture-classed proposals." });
    } catch (error) {
      console.error(error);
    } finally {
      setEvaluating(false);
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        
        {/* Main Property Region */}
        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/5 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Property Portfolio (PIP)</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Governed Asset Baseline: v1.1.0
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{properties.length} Active PIPs</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {properties.map(prop => (
                  <div 
                    key={prop.id} 
                    className={cn(
                      "p-4 flex items-center justify-between hover:bg-primary/5 transition-all cursor-pointer group",
                      selectedPropertyId === prop.id && "bg-primary/10 border-l-2 border-primary"
                    )}
                    onClick={() => setSelectedPropertyId(prop.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background/40 rounded-lg border border-border/30 group-hover:border-primary/30 transition-colors">
                        <Building2 className="h-5 w-5 opacity-60" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{prop.address || prop.propertyAddress}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 opacity-40" />
                          <span className="text-[10px] opacity-60">{prop.city || 'Los Angeles, CA'}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Grounding (Integrated Map) */}
          {selectedProperty && (
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden h-[300px]">
               <StandardGeospatialViewport 
                  address={selectedProperty.address || selectedProperty.propertyAddress}
               />
            </Card>
          )}
        </div>

        {/* Operational Scheduling Pane */}
        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/20">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                SmartSCHEDULER™
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-60">1. Select Payload Method</Label>
                  <Select onValueChange={setSelectedMethodId}>
                    <SelectTrigger className="bg-background/20 h-10 rounded-lg border-border/40">
                      <SelectValue placeholder="Select Methodology..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(METHOD_REGISTRY).map(m => (
                        <SelectItem key={m.methodId} value={m.methodId}>{m.methodName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] h-10 rounded-lg"
                  disabled={!selectedMethodId || evaluating}
                  onClick={handleEvaluate}
                >
                  {evaluating ? "Evaluating Reality..." : "Propose Optimal Windows"}
                </Button>
              </div>

              {proposals.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Separator className="opacity-20" />
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-2 block">2. Posture-Classed Proposals</span>
                  
                  <div className="space-y-3">
                    {proposals.map((p, idx) => (
                      <div key={idx} className={cn(
                        "p-3 rounded-xl border flex flex-col gap-2 transition-all hover:translate-x-1 cursor-pointer",
                        p.posture === 'approved_candidate' ? "bg-green-500/5 border-green-500/20" :
                        p.posture === 'restricted' ? "bg-orange-500/5 border-orange-500/20" :
                        "bg-destructive/5 border-destructive/20"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             {p.posture === 'approved_candidate' ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />}
                             <span className="text-xs font-bold">{new Date(p.start_at).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] h-4 uppercase tracking-tighter">
                            {p.posture.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] opacity-70">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(p.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-3 w-3" />
                            {p.iriScore} IRI
                          </div>
                        </div>
                        {p.reasonCodes.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {p.reasonCodes.map(r => <Badge key={r} variant="secondary" className="text-[8px] h-3 bg-background/50">{r}</Badge>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
