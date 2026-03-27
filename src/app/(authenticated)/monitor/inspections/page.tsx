'use client';

/**
 * OVERSCITE Global — Inspections Monitor Board (MON_INSPECT)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * MON_INSPECT lane: inspection lifecycle, report sealing, export events,
 * evidence state changes.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — monitor_events_inspection collection required.
 */

import React from 'react';
import { ClipboardCheck, Download, FileText, Lock, RefreshCw, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SCAFFOLD_STATS = [
  { label: 'Active Inspections',  value: 0, icon: ClipboardCheck, color: 'text-blue-400' },
  { label: 'Reports Pending Seal',value: 0, icon: Lock,           color: 'text-yellow-400' },
  { label: 'Exports Pending',     value: 0, icon: Download,        color: 'text-orange-400' },
  { label: 'Evidence Alerts',     value: 0, icon: FileText,        color: 'text-red-400' },
];

export default function InspectionsMonitorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inspections Monitor"
        status="partial"
        description="The Inspections Monitor Board surfaces MON_INSPECT lane signals: inspection lifecycle state changes, report sealing events, evidence export completions, and evidence integrity alerts. Inspection events carry evidentiary trust class and are visible to authorized admin and compliance roles only. This board supports oversight of the inspection pipeline without providing direct report editing capability. Live data requires classifyEvent pipeline activation and the monitor_events_inspection collection to be populated."
        actions={
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>
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
          <TabsTrigger value="alerts">Alert Packets</TabsTrigger>
          <TabsTrigger value="feed">Event Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">MON_INSPECT Alert Packets</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] Alert packets require active inspection event pipeline.
                Collection: <code className="font-mono">monitor_events_inspection</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <ClipboardCheck className="h-10 w-10 mb-3" />
                <p className="text-sm">No inspection alerts — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Inspection Event Feed</CardTitle>
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
