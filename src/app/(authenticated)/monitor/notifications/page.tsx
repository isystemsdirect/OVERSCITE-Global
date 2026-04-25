'use client';

/**
 * SCINGULAR Global — Notifications Reliability Board (MON_NOTIFY)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * MON_NOTIFY lane: notification queue health, delivery failures,
 * retry backlog, template and sender misconfigurations.
 *
 * Implementation Status: PARTIAL
 * Live queue data: SCAFFOLD — notification_events and delivery_attempts collections required.
 */

import React from 'react';
import { AlertTriangle, Bell, CheckCircle2, RefreshCw, RotateCcw, TrendingDown, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEMPLATE_STUBS } from '@/lib/monitor/templateRegistry';
import { getActiveSenderProfiles } from '@/lib/monitor/senderProfileRegistry';

const activeSenders = getActiveSenderProfiles();
const draftTemplates = TEMPLATE_STUBS.filter((t) => t.status === 'draft');

const SCAFFOLD_STATS = [
  { label: 'Queue Depth',      value: 0, icon: Bell,          color: 'text-blue-400' },
  { label: 'Delivery Failures',value: 0, icon: XCircle,       color: 'text-red-400' },
  { label: 'Retry Backlog',    value: 0, icon: RotateCcw,     color: 'text-orange-400' },
  { label: 'Delivered (24h)',  value: 0, icon: CheckCircle2,  color: 'text-emerald-400' },
];

export default function NotificationsReliabilityBoardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications Monitor"
        status="partial"
        description="The Notifications Reliability Board surfaces MON_NOTIFY lane signals: notification queue depth, delivery failure rates, retry backlog state, and template or sender profile misconfigurations. This board enables operations teams to identify infrastructure-level notification issues without exposing the content of individual notices. Live data requires the notification_events and notification_delivery_attempts collections to be active. Sender profiles are currently unverified — domain verification is required before live email dispatch."
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

      <Tabs defaultValue="senders">
        <TabsList className="bg-card/40 grid w-fit grid-cols-3">
          <TabsTrigger value="senders">Sender Profiles</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="senders" className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-lg px-3 py-2 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {activeSenders.length} sender profiles registered · All status: UNVERIFIED — domain DNS verification required before live send.
          </div>
          {activeSenders.map((sp) => (
            <Card key={sp.sender_profile_id} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{sp.display_name}</p>
                  <p className="text-xs font-mono text-white/40 mt-0.5">{sp.from_address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    {sp.verification_status}
                  </span>
                  <span className="text-[10px] font-mono text-white/25">
                    {sp.notification_classes.length} classes
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-lg px-3 py-2 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {draftTemplates.length} templates in draft status · Require authoring and approval before activation.
          </div>
          {TEMPLATE_STUBS.map((tpl) => (
            <Card key={tpl.template_id} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{tpl.name}</p>
                  <p className="text-xs text-white/40 mt-0.5 font-mono">{tpl.subject_preview}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/30">{tpl.channel}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-white/5 text-white/30 border-white/10">
                    {tpl.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="queue" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Notification Queue</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] Live queue data requires notification_events collection and dispatchNotification pipeline activation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <TrendingDown className="h-10 w-10 mb-3" />
                <p className="text-sm">No queue data — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
