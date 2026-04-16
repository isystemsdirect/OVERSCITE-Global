'use client';

/**
 * @fileOverview Recognition Governance Dashboard
 * @domain Inspections / Field Intelligence / ArcHive Governance
 * @classification ARCHIVE_CONTROL_UI — dashboards
 * @phase Phase 5 — ArcHive Control Plane Activation
 *
 * The primary ArcHive™ control surface for managing recognition stack governance.
 * Displays active vs staged configurations for taxonomies, routing, and thresholds.
 *
 * HARD RULES:
 * - Read-first perspective. No direct write-to-production logic.
 * - All changes must formulate as proposals.
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDiff, GitBranch, LayoutList, Network, ArrowRightCircle } from 'lucide-react';
import { DriftReviewQueue } from './drift-review-queue';
import { useToast } from '@/components/ui/use-toast';

export function RecognitionGovernanceDashboard() {
  const { toast } = useToast();

  const handleProposeChange = (target: string) => {
    toast({
      title: 'Action Denied',
      description: `Direct editing disabled. Proposing changes to [${target}] requires BANE approval workflow.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Recognition Governance</h1>
        <p className="text-muted-foreground max-w-3xl">
          ArcHive™ Control Plane for the OVERSCITE recognition stack. Monitor taxonomy drift, propose routing overrides, and manage confidence thresholds. All changes are governed by BANE enforcement policy.
        </p>
      </div>

      <Tabs defaultValue="taxonomy" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-border/50">
          <TabsTrigger value="taxonomy" className="data-[state=active]:bg-primary/20">
            <LayoutList className="h-4 w-4 mr-2" />
            Taxonomy & Packs
          </TabsTrigger>
          <TabsTrigger value="routing" className="data-[state=active]:bg-primary/20">
            <Network className="h-4 w-4 mr-2" />
            Engine Routing
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="data-[state=active]:bg-primary/20">
            <GitBranch className="h-4 w-4 mr-2" />
            Thresholds & Gates
          </TabsTrigger>
          <TabsTrigger value="drift" className="data-[state=active]:bg-primary/20">
            <FileDiff className="h-4 w-4 mr-2" />
            Drift Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taxonomy" className="mt-6">
          <Card className="bg-card/40 border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Taxonomy Profile</CardTitle>
                  <CardDescription>Current deployed finding classes and domain packs.</CardDescription>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">v1.4.2 Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Supported Classes</span>
                  <span className="font-mono">824</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Drawing Symbol Pack</span>
                  <span className="font-mono text-emerald-400">MEP_ARCH_v2</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Pending Proposals</span>
                  <span className="font-mono text-amber-500">2 Awaiting Review</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleProposeChange('Taxonomy')} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Stage Taxonomy Proposal <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="mt-6">
          <Card className="bg-card/40 border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Model Routing Policy</CardTitle>
                  <CardDescription>Engine delegation map for inspection payload domains.</CardDescription>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">v1.1.0 Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Base Engine</span>
                  <span className="font-mono shadow-sm">LARI_EVIDENCE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Drafting Override</span>
                  <span className="font-mono shadow-sm">LARI_DRAFTING</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Industrial Override</span>
                  <span className="font-mono shadow-sm">LARI_SITEOPS</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleProposeChange('Routing Policy')} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Stage Routing Override <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="mt-6">
          <Card className="bg-card/40 border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Verification Gates & Thresholds</CardTitle>
                  <CardDescription>Confidence banding and BANE validation parameters.</CardDescription>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Global Baseline Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Auto-Verify Permitted</span>
                  <span className="font-mono text-rose-500 font-bold">FALSE (BANE L3)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Review_Required Floor</span>
                  <span className="font-mono">Confidence {"<"} 0.70</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Domain Overrides Active</span>
                  <span className="font-mono text-emerald-400">Insurance (Risk+0.05)</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleProposeChange('Thresholds')} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Stage Threshold Adjustment <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="drift" className="mt-6">
          <DriftReviewQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
}
