'use client';

/**
 * OVERSCITE Global — Safety Monitor Board (MON_SAFE)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * MON_SAFE lane: BioHUD events, environmental hazard thresholds,
 * field-safety escalations, operator safety posture.
 * Safety-critical trust class — admin visibility only.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — monitor_events_safety collection required.
 * SMS/urgent channel wiring: SCAFFOLD — critical safety escalation not yet live.
 */

import React from 'react';
import { Activity, AlertOctagon, Heart, RefreshCw, Shield, TrendingDown, Thermometer } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SCAFFOLD_STATS = [
  { label: 'Active Field Agents', value: 0, icon: Activity,     color: 'text-blue-400' },
  { label: 'Safety Alerts',       value: 0, icon: Shield,       color: 'text-red-400' },
  { label: 'BioHUD Events',       value: 0, icon: Heart,        color: 'text-rose-400' },
  { label: 'Env. Thresholds Hit', value: 0, icon: Thermometer,  color: 'text-orange-400' },
];

export default function SafetyMonitorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Safety Monitor"
        status="partial"
        description="The Safety Monitor Board surfaces MON_SAFE lane signals with safety-critical trust class: BioHUD physiological events, environmental hazard threshold breaches, field-safety escalations, and degraded operator posture alerts. Safety events are restricted to authorized admin roles and route to governance review when escalation thresholds are crossed. Emergency safety escalation via urgent channels (SMS/push) is architected but not yet operationally wired — this constitutes a partial implementation. Live data requires classifyEvent pipeline activation."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-orange-400/70 bg-orange-400/5 border border-orange-400/20 rounded px-2.5 py-1.5">
              <AlertOctagon className="h-3.5 w-3.5" />
              SMS escalation: scaffold
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SCAFFOLD_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-white/60">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <p className="text-[10px] text-white/25 mt-1">[SCAFFOLD]</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="bg-card/40 grid w-fit grid-cols-2">
          <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
          <TabsTrigger value="feed">Event Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">MON_SAFE Alert Packets</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] Safety alert packets require active pipeline.
                Collection: <code className="font-mono">monitor_events_safety</code>.
                Critical escalations will also route to governance review queue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Shield className="h-10 w-10 mb-3" />
                <p className="text-sm">No safety alerts — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Safety Event Feed</CardTitle>
              <CardDescription className="text-xs">[SCAFFOLD] — Live events require classifyEvent pipeline activation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <TrendingDown className="h-10 w-10 mb-3" />
                <p className="text-sm">No events — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
