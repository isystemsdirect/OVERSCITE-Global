'use client';

/**
 * SCINGULAR Global — Monitor Audit Surface
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Cross-lane audit event log. Exportable evidence packs.
 * Reads from monitor_audit_events collection.
 *
 * Implementation Status: PARTIAL
 * Live audit events: SCAFFOLD — requires classifyEvent pipeline to write audit records.
 */

import React from 'react';
import { Download, FileText, Lock, RefreshCw, Search, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MonitorAuditPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Monitor Audit"
        status="partial"
        description="The Monitor Audit Surface provides cross-lane audit event visibility and exportable evidence packs from the monitor_audit_events collection. Audit events are written by Cloud Functions via Admin SDK only — they are append-only and immutable. This surface supports authorized audit review, governance inspection, and evidence export without providing source event mutation capability. All entries include actor lineage, policy version, and engine version for complete provenance. Live data requires classifyEvent and related pipeline functions to be active."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" disabled>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Pack
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Search / Filter */}
      <Card className="bg-card/40 backdrop-blur-sm border-white/5">
        <CardContent className="pt-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                placeholder="Search by event_id, actor_id, source_ref..."
                className="pl-9 bg-white/5 border-white/10 text-sm h-9"
                disabled
              />
            </div>
            <Button variant="outline" size="sm" className="text-xs h-9" disabled>
              Filter by Lane
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-9" disabled>
              Filter by Action
            </Button>
          </div>
          <p className="text-[10px] text-white/25 mt-2">
            [SCAFFOLD] Search and filter require live monitor_audit_events data and Firestore compound indexes.
          </p>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card className="bg-card/40 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-sm">Audit Event Log</CardTitle>
          <CardDescription className="text-xs">
            Append-only audit record. Written by Cloud Functions only — not editable.
            Collection: <code className="font-mono">monitor_audit_events</code>.
            [SCAFFOLD] — Population requires classifyEvent, buildAlertPacket, and routeToReviewQueue pipeline activation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <Lock className="h-10 w-10 mb-3" />
            <p className="text-sm">No audit events — pipeline scaffold</p>
            <p className="text-xs mt-1 text-white/15">
              Audit events will populate once monitor cloud functions are active.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Pack Export */}
      <Card className="bg-card/40 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/40" />
            Evidence Pack Export
          </CardTitle>
          <CardDescription className="text-xs">
            Exportable evidence packs bundle selected audit events, alert packets, and delivery evidence
            for governance review, legal hold, or compliance submission.
            [SCAFFOLD] — Export functionality gated on live audit data availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mt-2">
            {[
              { label: 'Finance Evidence Pack', desc: 'MON_FIN + financial_events + notification delivery' },
              { label: 'Governance Evidence Pack', desc: 'MON_GOV + BANE gate records + review queue' },
              { label: 'Safety Evidence Pack', desc: 'MON_SAFE + escalation records + alert packets' },
            ].map((pack) => (
              <div
                key={pack.label}
                className="border border-white/5 rounded-lg p-4 space-y-2 opacity-40"
              >
                <p className="text-sm font-medium">{pack.label}</p>
                <p className="text-xs text-white/40">{pack.desc}</p>
                <Button variant="outline" size="sm" className="text-xs w-full mt-2" disabled>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export [Scaffold]
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
