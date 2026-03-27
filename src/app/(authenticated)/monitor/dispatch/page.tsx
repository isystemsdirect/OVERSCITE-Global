'use client';

/**
 * OVERSCITE Global — Dispatch Monitor Board (MON_DISPATCH)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * MON_DISPATCH lane: job publication, offers, acceptance, assignment,
 * schedule movement, field-routing anomalies.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — monitor_events_dispatch collection required.
 */

import React from 'react';
import { AlertTriangle, Clock, MapPin, RefreshCw, Truck, TrendingDown, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SCAFFOLD_STATS = [
  { label: 'Active Jobs',       value: 0, icon: Truck,         color: 'text-blue-400' },
  { label: 'Pending Offers',    value: 0, icon: Users,         color: 'text-yellow-400' },
  { label: 'Schedule Alerts',   value: 0, icon: Clock,         color: 'text-orange-400' },
  { label: 'Route Anomalies',   value: 0, icon: MapPin,        color: 'text-red-400' },
];

export default function DispatchMonitorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dispatch Monitor"
        status="partial"
        description="The Dispatch Monitor Board surfaces MON_DISPATCH lane signals across the Field Market labor exchange: active job postings, offer and acceptance states, assignment confirmations, schedule deviations, and field-routing anomalies. Dispatch events are derived from classified CanonicalMonitorEvent records from the dispatch domain. Operators can identify routing issues and assignment anomalies without direct database access. Live data requires classifyEvent pipeline activation and the monitor_events_dispatch collection to be populated."
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
              <CardTitle className="text-sm">MON_DISPATCH Alert Packets</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] Alert packets require active dispatch event pipeline.
                Collection: <code className="font-mono">monitor_events_dispatch</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Truck className="h-10 w-10 mb-3" />
                <p className="text-sm">No dispatch alerts — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Dispatch Event Feed</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] — Live events require classifyEvent pipeline activation.
              </CardDescription>
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
