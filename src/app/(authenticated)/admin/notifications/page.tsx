'use client';

/**
 * OVERSCITE Global — Admin Notifications Console
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Multi-tab admin console:
 *  1. Financial Notification Console
 *  2. Template Manager
 *  3. Sender Profile Manager
 *  4. Delivery Evidence Explorer
 *  5. Review Queue Manager
 *
 * Admin-only visibility. Not accessible to customer-scope roles.
 *
 * Implementation Status: PARTIAL
 * Live data for all tabs: SCAFFOLD — depends on notification pipeline activation.
 * Template body editing: SCAFFOLD — requires authoring workflow.
 */

import React from 'react';
import {
  AlertTriangle, Bell, CheckCircle2, Download, FileText,
  ListFilter, Mail, Package, RefreshCw, Search, Send,
  Shield, Users, Wrench, XCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NOTIFICATION_CLASS_POLICY_TABLE } from '@/lib/notifications/notificationClassPolicy';
import { TEMPLATE_STUBS } from '@/lib/monitor/templateRegistry';
import { getActiveSenderProfiles } from '@/lib/monitor/senderProfileRegistry';

const ALL_POLICIES = Object.values(NOTIFICATION_CLASS_POLICY_TABLE);
const ALL_SENDERS  = getActiveSenderProfiles();

export default function AdminNotificationsConsolePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications Console"
        status="partial"
        description="The Admin Notifications Console provides finance-administration and governance-authorized operators with visibility into the full OVERSCITE Notifications Fabric: financial notice routing, template lifecycle management, sender profile registry, delivery evidence exploration, and approval review queues. All consoles display live system state where pipeline data is available. Customer-facing notice content is never displayed on admin surfaces — only class, state, recipient type, and delivery evidence are shown. Live data requires full notification pipeline activation."
        actions={
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      <Tabs defaultValue="financial">
        <TabsList className="bg-card/40 flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="financial" className="text-xs">
            <Mail className="mr-1.5 h-3.5 w-3.5" /> Financial Console
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">
            <FileText className="mr-1.5 h-3.5 w-3.5" /> Templates
          </TabsTrigger>
          <TabsTrigger value="senders" className="text-xs">
            <Send className="mr-1.5 h-3.5 w-3.5" /> Sender Profiles
          </TabsTrigger>
          <TabsTrigger value="delivery" className="text-xs">
            <Package className="mr-1.5 h-3.5 w-3.5" /> Delivery Evidence
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs">
            <Shield className="mr-1.5 h-3.5 w-3.5" /> Review Queue
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: FINANCIAL NOTIFICATION CONSOLE                               */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="financial" className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input placeholder="Search by org_id, notification_id, class..." className="pl-9 bg-white/5 border-white/10 text-sm h-9" disabled />
            </div>
            <Button variant="outline" size="sm" className="h-9 text-xs" disabled>
              <ListFilter className="mr-1.5 h-3.5 w-3.5" />
              Filter by Class
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" disabled>
              <ListFilter className="mr-1.5 h-3.5 w-3.5" />
              Delivery State
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" disabled>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          {/* Financial classes quick reference */}
          <div className="grid md:grid-cols-2 gap-3">
            {ALL_POLICIES
              .filter((p) =>
                ['transactional_receipt', 'payment_warning', 'finance_admin_alert',
                 'refund_return_case', 'payout_notice', 'dispute_case_notice'].includes(p.notification_class)
              )
              .map((policy) => (
                <Card key={policy.notification_class} className="bg-card/40 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{policy.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{policy.description}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {policy.authorized_sender_profile_ids.map((spId) => (
                          <span key={spId} className="text-[10px] font-mono text-white/25 bg-white/5 px-1.5 py-0.5 rounded">
                            {spId.replace('sp_', '')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={policy.is_customer_facing ? 'secondary' : 'outline'} className="text-[10px]">
                        {policy.is_customer_facing ? 'Customer' : 'Admin Only'}
                      </Badge>
                      <span className="text-[10px] text-white/20">[SCAFFOLD] 0 records</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: TEMPLATE MANAGER                                             */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="templates" className="mt-4 space-y-3">
          <div className="flex items-start gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-lg px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>
              All {TEMPLATE_STUBS.length} templates are in <strong>draft</strong> status.
              Template bodies require authoring, approval, and rendering validation before activation.
              Active/inactive lifecycle is managed server-side via Admin SDK only.
            </span>
          </div>
          {TEMPLATE_STUBS.map((tpl) => (
            <Card key={tpl.template_id} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{tpl.name}</p>
                    <Badge variant="outline" className="text-[10px]">{tpl.channel}</Badge>
                    <Badge variant="outline" className="text-[10px]">v{tpl.version}</Badge>
                  </div>
                  <p className="text-xs font-mono text-white/30 mt-0.5">{tpl.subject_preview}</p>
                  <p className="text-[10px] text-white/20 font-mono mt-0.5">{tpl.template_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-white/5 text-white/30 border-white/10">
                    {tpl.status}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs h-7" disabled>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" disabled>Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: SENDER PROFILE MANAGER                                       */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="senders" className="mt-4 space-y-3">
          <div className="flex items-start gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/10 rounded-lg px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>
              All {ALL_SENDERS.length} sender profiles are <strong>UNVERIFIED</strong>. DNS records and provider
              onboarding must be completed before any live email dispatch can occur.
            </span>
          </div>
          {ALL_SENDERS.map((sp) => (
            <Card key={sp.sender_profile_id} className="bg-card/40 backdrop-blur-sm border-white/5">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{sp.display_name}</p>
                    <p className="text-xs font-mono text-white/50 mt-0.5">From: {sp.from_address}</p>
                    <p className="text-xs font-mono text-white/30 mt-0.5">Reply-to: {sp.reply_to_address}</p>
                    <p className="text-[10px] text-white/20 mt-1">
                      Retention: {sp.retention_policy} · Classes: {sp.notification_classes.length}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sp.notification_classes.map((cls) => (
                        <span key={cls} className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 rounded text-white/30">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      {sp.verification_status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-7" disabled>
                      Verify Domain
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: DELIVERY EVIDENCE EXPLORER                                   */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="delivery" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Delivery Evidence Explorer</CardTitle>
              <CardDescription className="text-xs">
                Provider identifiers, attempt history, bounce analysis, retry state, exportable evidence.
                Evidence records are written by recordDeliveryAttempt only — append-only, not editable.
                [SCAFFOLD] — Live records require notification dispatch pipeline activation.
                Collection: <code className="font-mono">notification_delivery_attempts</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Attempts', value: 0, icon: Bell },
                  { label: 'Delivered', value: 0, icon: CheckCircle2 },
                  { label: 'Bounced', value: 0, icon: XCircle },
                  { label: 'Failed', value: 0, icon: AlertTriangle },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="p-3 bg-white/3 rounded-lg border border-white/5 text-center">
                      <Icon className="h-4 w-4 mx-auto mb-1 text-white/30" />
                      <p className="text-xl font-bold text-white/40">{s.value}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{s.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-white/20">
                <package className="h-10 w-10 mb-3" />
                <p className="text-sm">No delivery evidence — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: REVIEW QUEUE MANAGER                                         */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="review" className="mt-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Approval Review Queue</CardTitle>
              <CardDescription className="text-xs">
                Approval-required notification packets, finance review, governance review,
                support escalation, and manual override records.
                [SCAFFOLD] — Review queue population requires routeToReviewQueue pipeline activation.
                Collection: <code className="font-mono">monitor_review_queues</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Finance Review', type: 'finance_review' },
                  { label: 'Governance Review', type: 'governance_review' },
                  { label: 'Support Escalation', type: 'support_escalation' },
                  { label: 'Override Records', type: 'manual_override_record' },
                ].map((q) => (
                  <div key={q.type} className="p-3 bg-white/3 rounded-lg border border-white/5 text-center">
                    <p className="text-xl font-bold text-white/40">0</p>
                    <p className="text-[10px] text-white/20 mt-0.5">{q.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-white/20">
                <Shield className="h-10 w-10 mb-3" />
                <p className="text-sm">No review items — pipeline scaffold</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
