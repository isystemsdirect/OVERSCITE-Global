'use client';

/**
 * SCINGULAR Global — Finance Monitor Board (MON_FIN)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Surfaces MON_FIN lane signals: payment warnings, refunds, payout holds,
 * disputes, reconciliation anomalies. Finance admin visibility only.
 * Does NOT display customer account details to unauthorized roles.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — monitor_events_finance collection required.
 */

import React from 'react';
import {
  AlertTriangle, Clock, DollarSign, FileWarning,
  RefreshCw, Receipt, RotateCcw, ShieldAlert, TrendingDown,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ---------------------------------------------------------------------------
// SCAFFOLD MOCK — typed structural state. Replace with Firestore reads.
// ---------------------------------------------------------------------------

const SCAFFOLD_FINANCIAL_ALERTS = [
  { id: 'fa_001', type: 'payment_failed',               severity: 'elevated', org_id: 'org_xxx', amount: null,    created_at: '—', status: 'open' },
  { id: 'fa_002', type: 'manual_financial_review_required', severity: 'critical', org_id: 'org_yyy', amount: null, created_at: '—', status: 'open' },
  { id: 'fa_003', type: 'payout_on_hold',               severity: 'warning',  org_id: 'org_zzz', amount: null,    created_at: '—', status: 'open' },
];

const SCAFFOLD_STATS = [
  { label: 'Payment Warnings',      value: 0, icon: AlertTriangle, color: 'text-yellow-400' },
  { label: 'Refund Cases Open',     value: 0, icon: RotateCcw,     color: 'text-orange-400' },
  { label: 'Payout Holds',          value: 0, icon: Clock,         color: 'text-yellow-400' },
  { label: 'Dispute Cases',         value: 0, icon: ShieldAlert,   color: 'text-red-400' },
];

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/20',
    elevated: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    warning:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    info:     'bg-blue-500/15 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${map[severity] ?? 'bg-white/5 text-white/30 border-white/10'}`}>
      {severity}
    </span>
  );
}

export default function FinanceMonitorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance Monitor"
        status="partial"
        description="The Finance Monitor Board surfaces MON_FIN lane signals: payment failures, refund cases, payout holds, dispute escalations, and reconciliation anomalies requiring finance admin attention. This board is restricted to authorized finance administration roles and does not expose customer account details to general users. All events are derived from classified CanonicalMonitorEvent records — no raw payment processor data is surfaced directly. Live data requires the classifyEvent pipeline and monitor_events_finance collection to be active."
        actions={
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {/* KPI Strip */}
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
                <p className="text-[10px] text-white/25 mt-1">[SCAFFOLD] — pipeline inactive</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="bg-card/40 grid w-fit grid-cols-3">
          <TabsTrigger value="alerts">Alert Packets</TabsTrigger>
          <TabsTrigger value="events">Event Feed</TabsTrigger>
          <TabsTrigger value="review">Review Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-lg px-3 py-2">
            <FileWarning className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              <strong>[SCAFFOLD]</strong> Alert packets shown below are structural examples only.
              Live alert packets require classifyEvent pipeline and buildAlertPacket to be active.
            </span>
          </div>
          {SCAFFOLD_FINANCIAL_ALERTS.map((alert) => (
            <Card key={alert.id} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <DollarSign className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-mono">{alert.type}</p>
                    <p className="text-xs text-white/30 mt-0.5">Org: {alert.org_id} · {alert.created_at}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={alert.severity} />
                  <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-xs h-7">Review</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">MON_FIN Event Feed</CardTitle>
              <CardDescription className="text-xs">
                Classified events from the finance domain. Lane: <code className="font-mono">monitor_events_finance</code>.
                [SCAFFOLD] — collection not yet populated. Events will appear after classifyEvent pipeline activation.
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

        <TabsContent value="review" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Finance Review Queue</CardTitle>
              <CardDescription className="text-xs">
                Approval-required financial events routed from routeToReviewQueue.
                [SCAFFOLD] — review queue requires live alert packets and governance role assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Receipt className="h-10 w-10 mb-3" />
                <p className="text-sm">No review items — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
