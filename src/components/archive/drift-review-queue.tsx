'use client';

/**
 * @fileOverview Drift Review Queue — ArcHive Control Surface
 * @domain Inspections / Field Intelligence / ArcHive Governance
 * @classification ARCHIVE_CONTROL_UI — drift queues
 * @phase Phase 5 — ArcHive Control Plane Activation
 *
 * Provides a governed view into unknown objects, occlusion misses, and
 * out-of-domain detections, allowing human reviewers to generate proposals
 * for taxonomy expansion or threshold adjustment.
 *
 * HARD RULES:
 * - Read-only view of drift items.
 * - Actions generate proposals, NOT direct taxonomy mutation.
 */

import { useState, useEffect } from 'react';
import { getDriftReviewQueue, type DriftReviewItem } from '@/lib/services/recognition-monitoring';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, ExternalLink, PlusCircle, CheckCircle2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProposalFromDrift } from '@/lib/services/recognition-monitoring';

export function DriftReviewQueue() {
  const { toast } = useToast();
  const [items, setItems] = useState<DriftReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposing, setProposing] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');
  const [proposedSet, setProposedSet] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getDriftReviewQueue()
      .then((data) => {
        if (mounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[DRIFT_QUEUE] Failed to load:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleProposeTaxonomy = async (term: string, domains: string[]) => {
    if (!rationale) return;
    
    setIsSubmitting(true);
    try {
      await createProposalFromDrift({
        clusterName: term,
        domainClasses: domains,
        rationale: rationale,
        proposedBy: 'Director Anderson (via ArcHive™ Control Plane)',
      });

      setProposedSet(prev => new Set(prev).add(term));
      setProposing(null);
      setRationale('');
      
      toast({
        title: 'Proposal Activated',
        description: `Taxonomy expansion proposal for "${term}" has been staged in the ArcHive™ control plane.`,
      });
    } catch (err) {
      console.error('[DRIFT_PROPOSAL] Failed:', err);
      toast({
        variant: 'destructive',
        title: 'Proposal Failed',
        description: 'BANE policy or network error prevented proposal creation.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading drift queue...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-card border border-border/50">
        <Activity className="h-8 w-8 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-lg text-foreground/80">No Drift Detected</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2">
          The recognition stack taxonomy is fully resolving all recent field observations.
        </p>
      </div>
    );
  }

  // Cluster identical unknowns
  const clusters: Record<string, DriftReviewItem[]> = {};
  items.forEach((item) => {
    item.identifiedUnknowns.forEach((unk) => {
      const key = unk.toLowerCase().trim();
      if (!clusters[key]) clusters[key] = [];
      clusters[key].push(item);
    });
  });

  const sortedClusters = Object.entries(clusters).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Unknown Object Drift Clusters</h2>
          <p className="text-sm text-muted-foreground">
            Recurring unclassified observations that may warrant taxonomy expansion.
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          Proposal Bound
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedClusters.map(([term, occurrences]) => (
          <Card key={term} className="bg-card/40 border-border/60 backdrop-blur-sm">
            <CardHeader className="pb-3 md:pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>{term}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Occurred {occurrences.length} times in recent scans.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 text-sm">
              <div className="space-y-2">
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Active in domains:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(new Set(occurrences.map((o) => o.domainClass))).map((domain) => (
                    <Badge key={domain} variant="secondary" className="text-xs py-0 h-5 bg-secondary/50">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between border-t border-border/30">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3 mr-2" />
                View Packets
              </Button>
              
              {proposedSet.has(term) ? (
                <Badge variant="outline" className="h-8 px-3 border-emerald-500/50 text-emerald-500 bg-emerald-500/5">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                  Proposal Staged
                </Badge>
              ) : (
                <Dialog open={proposing === term} onOpenChange={(open) => {
                  if (open) setProposing(term);
                  else if (!isSubmitting) setProposing(null);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
                      <PlusCircle className="h-3 w-3 mr-2" />
                      Propose Addition
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background/95 backdrop-blur-md border-border/40 sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-emerald-500" />
                        Taxonomy Proposal
                      </DialogTitle>
                      <DialogDescription>
                        Create a governed expansion proposal for the unknown cluster: <span className="text-foreground font-semibold">"{term}"</span>.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="rationale" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Proposal Rationale
                        </Label>
                        <Textarea
                          id="rationale"
                          placeholder="e.g., Recurring industrial pump component variant requiring specific safety pass..."
                          className="min-h-[100px] bg-background/50 border-border/60"
                          value={rationale}
                          onChange={(e) => setRationale(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                          This proposal will be bound to ArcHive™ audit lineage and REQUIRES BANE-gated approval for activation.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="ghost" 
                        onClick={() => setProposing(null)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleProposeTaxonomy(term, Array.from(new Set(occurrences.map(o => o.domainClass))))}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        disabled={!rationale || isSubmitting}
                      >
                        {isSubmitting ? 'Staging...' : 'Submit Proposal'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
