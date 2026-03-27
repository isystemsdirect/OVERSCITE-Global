'use client';

/**
 * OVERSCITE Global — Governance Monitor Board (MON_GOV)
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * MON_GOV lane: BANE-facing review packets, override attempts,
 * policy blocks, audit-sensitive events.
 * Governance-sensitive trust class — governance admin visibility only.
 *
 * Implementation Status: PARTIAL
 * Live event data: SCAFFOLD — monitor_events_governance collection required.
 * BANE Gate 4 mutation-bearing handoff: SCAFFOLD — requires full BANE pipeline wiring.
 */

import React from 'react';
import { AlertOctagon, ChevronRight, Clock, FileWarning, Lock, RefreshCw, Shield, TrendingDown, Zap } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SCAFFOLD_STATS = [
  { label: 'Policy Blocks',       value: 0, icon: Lock,         color: 'text-red-400' },
  { label: 'Override Requests',   value: 0, icon: Zap,          color: 'text-orange-400' },
  { label: 'Pending Reviews',     value: 0, icon: Clock,        color: 'text-yellow-400' },
  { label: 'Audit Exceptions',    value: 0, icon: AlertOctagon, color: 'text-red-400' },
];

// BANE gate status — scaffold state, live wiring required
const BANE_GATE_STATUS = [
  { gate: 'Gate 1', label: 'Event Eligibility',         status: 'partial', description: 'Schema validation + trust class assignment' },
  { gate: 'Gate 2', label: 'Notification Eligibility',  status: 'partial', description: 'Class/template/sender/channel policy checks' },
  { gate: 'Gate 3', label: 'High-Risk Escalation',      status: 'scaffold', description: 'Finance/governance/safety threshold escalation' },
  { gate: 'Gate 4', label: 'Mutation-Bearing Outcomes', status: 'scaffold', description: 'Payout/entitlement/override/compliance mutations — requires BANE pipeline' },
];

export default function GovernanceMonitorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Governance Monitor"
        status="partial"
        description="The Governance Monitor Board surfaces MON_GOV lane signals with governance-sensitive trust class: BANE-facing review packets, override attempts, policy blocks, and audit-sensitive event exceptions. This board is restricted to governance administration roles. LARI-Monitor observes and routes — BANE decides and records all high-risk gate outcomes. BANE Gate 3 and Gate 4 handoff logic is architected but requires full BANE pipeline wiring before mutation-bearing outcomes can be processed. Live data requires classifyEvent pipeline activation."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-orange-400/70 bg-orange-400/5 border border-orange-400/20 rounded px-2.5 py-1.5">
              <FileWarning className="h-3.5 w-3.5" />
              Gate 3/4: scaffold
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

      <Tabs defaultValue="gates">
        <TabsList className="bg-card/40 grid w-fit grid-cols-3">
          <TabsTrigger value="gates">BANE Gates</TabsTrigger>
          <TabsTrigger value="alerts">Alert Packets</TabsTrigger>
          <TabsTrigger value="review">Review Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="gates" className="mt-4 space-y-3">
          {BANE_GATE_STATUS.map((g) => (
            <Card key={g.gate} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Shield className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{g.gate} — {g.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{g.description}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  g.status === 'partial'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-white/5 text-white/30 border-white/10'
                }`}>
                  {g.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">MON_GOV Alert Packets</CardTitle>
              <CardDescription className="text-xs">
                [SCAFFOLD] Governance alerts require active classifyEvent pipeline.
                Collection: <code className="font-mono">monitor_events_governance</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Lock className="h-10 w-10 mb-3" />
                <p className="text-sm">No governance alerts — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Governance Review Queue</CardTitle>
              <CardDescription className="text-xs">
                BANE-gated review packets for override requests, policy blocks, and audit exceptions.
                [SCAFFOLD] — Requires live routeToReviewQueue pipeline and BANE Gate 3/4 wiring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <TrendingDown className="h-10 w-10 mb-3" />
                <p className="text-sm">No review items — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
