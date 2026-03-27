'use client';

/**
 * OVERSCITE Global — LARI-Monitor Command Board
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Cross-lane status summary. Priority operational rollups.
 * Surfaces alert packet counts, severity distribution, review queue depth.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — depends on classifyEvent pipeline being active.
 * Board data shown is structural scaffold with typed mock state.
 */

import React, { useState } from 'react';
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ChevronRight,
  Clock, DollarSign, Eye, MapPin, Package, RefreshCw,
  Shield, Truck, Zap, Database, Users, FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MonitorLaneId } from '@/lib/types/monitor';

// ---------------------------------------------------------------------------
// SCAFFOLD DATA — structural mock state. Replace with Firestore reads when
// classifyEvent pipeline is active and monitor collections are populated.
// ---------------------------------------------------------------------------

interface LaneSummary {
  lane_id: MonitorLaneId;
  label: string;
  icon: React.ElementType;
  event_count: number;
  alert_count: number;
  critical_count: number;
  open_review_count: number;
  status: 'nominal' | 'elevated' | 'critical' | 'offline';
}

const SCAFFOLD_LANE_SUMMARIES: LaneSummary[] = [
  { lane_id: 'MON_FIN',      label: 'Finance',           icon: DollarSign,   event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_MARKET',   label: 'Marketplace',       icon: Package,      event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_DISPATCH', label: 'Dispatch',          icon: Truck,        event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_INSPECT',  label: 'Inspections',       icon: FileText,     event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_GEO',      label: 'Geo',               icon: MapPin,       event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_SRT',      label: 'SRT',               icon: Eye,          event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_SAFE',     label: 'Safety',            icon: Shield,       event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_IDENT',    label: 'Identity',          icon: Users,        event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_NOTIFY',   label: 'Notifications',     icon: Bell,         event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_COMP',     label: 'Compliance',        icon: CheckCircle2, event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_GOV',      label: 'Governance',        icon: Zap,          event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
  { lane_id: 'MON_ADMIN',    label: 'Admin Ops',         icon: Database,     event_count: 0, alert_count: 0, critical_count: 0, open_review_count: 0, status: 'offline' },
];

const LANE_ROUTES: Partial<Record<MonitorLaneId, string>> = {
  MON_FIN:      '/monitor/finance',
  MON_DISPATCH: '/monitor/dispatch',
  MON_INSPECT:  '/monitor/inspections',
  MON_SAFE:     '/monitor/safety',
  MON_NOTIFY:   '/monitor/notifications',
  MON_GOV:      '/monitor/governance',
};

// ---------------------------------------------------------------------------
// STATUS BADGE
// ---------------------------------------------------------------------------

function LaneStatusBadge({ status }: { status: LaneSummary['status'] }) {
  const map: Record<LaneSummary['status'], { label: string; className: string }> = {
    nominal:  { label: 'Nominal',  className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    elevated: { label: 'Elevated', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    critical: { label: 'Critical', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
    offline:  { label: 'No Data',  className: 'bg-white/5 text-white/30 border-white/10' },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${className}`}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default function MonitorCommandBoardPage() {
  const [lastRefreshed] = useState(() => new Date().toLocaleTimeString());

  const totalAlerts = SCAFFOLD_LANE_SUMMARIES.reduce((s, l) => s + l.alert_count, 0);
  const totalCritical = SCAFFOLD_LANE_SUMMARIES.reduce((s, l) => s + l.critical_count, 0);
  const totalReview = SCAFFOLD_LANE_SUMMARIES.reduce((s, l) => s + l.open_review_count, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Monitor"
        status="partial"
        description="LARI-Monitor Command Board provides cross-lane operational visibility across all classified OVERSCITE platform events. Each lane represents a governed domain of activity, surfacing alert packets, severity signals, and review-queue depth without exposing raw event noise. Live event ingestion depends on the classifyEvent pipeline being active — current data is structural scaffold. Monitor surfaces observe and report; they do not authorize binding platform actions."
        actions={
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Active Alerts" value={totalAlerts} icon={AlertTriangle} variant="warning" note="24h window" />
        <KpiCard label="Critical Signals" value={totalCritical} icon={Zap} variant="critical" note="Requires attention" />
        <KpiCard label="Open Reviews" value={totalReview} icon={Clock} variant="neutral" note="Pending human review" />
        <KpiCard label="Lanes Online" value={0} icon={Activity} variant="neutral" note="of 12 lanes active" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-card/40 grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Lane Overview</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SCAFFOLD_LANE_SUMMARIES.map((lane) => {
              const Icon = lane.icon;
              const route = LANE_ROUTES[lane.lane_id];
              return (
                <Card
                  key={lane.lane_id}
                  className="bg-card/40 backdrop-blur-sm border-white/5 hover:border-white/10 transition-colors"
                >
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-white/5">
                        <Icon className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{lane.label}</CardTitle>
                        <span className="text-[10px] font-mono text-white/30">{lane.lane_id}</span>
                      </div>
                    </div>
                    <LaneStatusBadge status={lane.status} />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <MetricCell label="Events" value={lane.event_count} />
                      <MetricCell label="Alerts" value={lane.alert_count} highlight={lane.alert_count > 0} />
                      <MetricCell label="Critical" value={lane.critical_count} highlight={lane.critical_count > 0} red />
                    </div>
                    {route && (
                      <a
                        href={route}
                        className="flex items-center justify-between w-full text-xs text-white/40 hover:text-white/70 transition-colors pt-1 border-t border-white/5"
                      >
                        View Board
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
                    {!route && (
                      <div className="text-xs text-white/20 pt-1 border-t border-white/5">
                        Sub-board not yet routed
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Recent Alert Packets</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] No alert packets yet — classifyEvent pipeline not yet active.
                Alert packets will appear here once LARI-Monitor lanes receive live events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Activity className="h-10 w-10 mb-3" />
                <p className="text-sm">No alert packets — pipeline scaffold</p>
                <p className="text-xs mt-1">Last checked: {lastRefreshed}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function KpiCard({
  label, value, icon: Icon, variant, note,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant: 'critical' | 'warning' | 'neutral';
  note: string;
}) {
  const colors = {
    critical: 'text-red-400',
    warning:  'text-yellow-400',
    neutral:  'text-white/60',
  };
  return (
    <Card className="bg-card/40 backdrop-blur-sm border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/70">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${colors[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-black ${colors[variant]}`}>{value}</div>
        <p className="text-xs text-white/30 mt-1">{note}</p>
      </CardContent>
    </Card>
  );
}

function MetricCell({
  label, value, highlight, red,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  red?: boolean;
}) {
  const color = red && value > 0
    ? 'text-red-400'
    : highlight && value > 0
    ? 'text-yellow-400'
    : 'text-white/60';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-xl font-bold ${color}`}>{value}</span>
      <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
    </div>
  );
}
