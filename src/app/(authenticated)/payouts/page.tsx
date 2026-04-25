'use client';

/**
 * Payouts — Field Market labor disbursement surface
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Displays payout records for field agents and org dispatchers.
 * Payout release requires server-authoritative backend payment pipeline.
 * Dispute and hold state visible to authorized financial actors only.
 *
 * Implementation Status: PARTIAL — display layer live; payout release: backend pipeline SCAFFOLD.
 */

import React from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
  Lock,
  Shield,
  WifiOff,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import type { PayoutRecord, PayoutStatus } from '@/lib/types/marketplace';

// ---------------------------------------------------------------------------
// Seed payout data — scaffold until market_payouts collection populated
// ---------------------------------------------------------------------------

const SEED_PAYOUTS: Omit<PayoutRecord, 'created_at' | 'updated_at'>[] = [
  {
    payout_id: 'pay-001',
    job_id: 'job-004',
    offer_id: 'off-004',
    recipient_id: 'arc-agent-001',
    org_id: 'org-ovs-field',
    gross_amount: 1850,
    platform_fee: 185,
    net_amount: 1665,
    currency: 'USD',
    hold_state: false,
    release_state: 'ready_for_release',
    audit_event_id: 'evt-pay-001',
  },
  {
    payout_id: 'pay-002',
    job_id: 'job-001',
    offer_id: 'off-001',
    recipient_id: 'arc-agent-001',
    org_id: 'org-ovs-global',
    gross_amount: 1200,
    platform_fee: 120,
    net_amount: 1080,
    currency: 'USD',
    hold_state: true,
    hold_reason: 'Standard 3-day hold period — releases 2026-04-04',
    release_state: 'on_hold',
    audit_event_id: 'evt-pay-002',
  },
  {
    payout_id: 'pay-003',
    job_id: 'job-prev-01',
    offer_id: 'off-prev-01',
    recipient_id: 'arc-agent-001',
    org_id: 'org-ovs-global',
    gross_amount: 950,
    platform_fee: 95,
    net_amount: 855,
    currency: 'USD',
    hold_state: false,
    release_state: 'released',
    released_at: '2026-03-20T14:30:00Z',
    audit_event_id: 'evt-pay-003',
  },
];

const PAYOUT_STATUS_CONFIG: Record<PayoutStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-muted-foreground', icon: <CircleDot className="h-3 w-3" /> },
  on_hold: { label: 'On Hold', color: 'text-amber-400', icon: <Clock className="h-3 w-3" /> },
  dispute_hold: { label: 'Dispute Hold', color: 'text-red-400', icon: <AlertTriangle className="h-3 w-3" /> },
  ready_for_release: { label: 'Ready for Release', color: 'text-blue-400', icon: <Shield className="h-3 w-3" /> },
  released: { label: 'Released', color: 'text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  failed: { label: 'Failed', color: 'text-red-500', icon: <AlertTriangle className="h-3 w-3" /> },
  reversed: { label: 'Reversed', color: 'text-muted-foreground', icon: <CircleDot className="h-3 w-3" /> },
};

function PayoutCard({ payout }: { payout: Omit<PayoutRecord, 'created_at' | 'updated_at'> }) {
  const statusCfg = PAYOUT_STATUS_CONFIG[payout.release_state];
  const platformFeePercent = ((payout.platform_fee / payout.gross_amount) * 100).toFixed(0);

  return (
    <Card className="bg-card/50 border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono text-muted-foreground">{payout.payout_id}</div>
          <div className={cn('flex items-center gap-1 text-[10px] font-mono', statusCfg.color)}>
            {statusCfg.icon} {statusCfg.label}
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground">
          Job: <span className="font-mono">{payout.job_id}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted/20 rounded-md p-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Amount</span>
            <span className="font-mono">${payout.gross_amount.toLocaleString()} {payout.currency}</span>
          </div>
          <div className="flex justify-between text-muted-foreground/70">
            <span>Platform Fee ({platformFeePercent}%)</span>
            <span className="font-mono text-red-400/70">−${payout.platform_fee.toLocaleString()}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between font-semibold">
            <span>Net Payout</span>
            <span className="font-mono text-green-400">${payout.net_amount.toLocaleString()} {payout.currency}</span>
          </div>
        </div>

        {payout.hold_state && payout.hold_reason && (
          <div className="flex items-start gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5">
            <Clock className="h-3 w-3 shrink-0 mt-0.5" />
            <span>{payout.hold_reason}</span>
          </div>
        )}

        {payout.release_state === 'released' && payout.released_at && (
          <div className="flex items-center gap-1.5 text-[10px] text-green-400/80">
            <CheckCircle2 className="h-3 w-3" />
            Released: {new Date(payout.released_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}

        {payout.release_state === 'ready_for_release' && (
          <div className="flex items-center gap-1.5 text-[10px] text-blue-400/80 font-medium">
            <Shield className="h-3 w-3" />
            Release authorized — awaiting finance_admin confirmation [SCAFFOLD]
          </div>
        )}

        <div className="text-[9px] font-mono text-muted-foreground/40">
          AUDIT: {payout.audit_event_id}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PayoutsPage() {
  const totalPending = SEED_PAYOUTS.filter((p) => p.release_state !== 'released').reduce((sum, p) => sum + p.net_amount, 0);
  const totalReleased = SEED_PAYOUTS.filter((p) => p.release_state === 'released').reduce((sum, p) => sum + p.net_amount, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Payouts"
          status="partial"
          description="The Payouts surface displays Field Market labor disbursement records for field agents and organizational dispatchers. Each payout record shows gross amount, platform fee, net payout, and release state with full audit lineage. Payout release is server-authoritative — completed work does not guarantee released funds until platform conditions are met and finance authorization is confirmed."
          actions={
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 border border-amber-500/20 bg-amber-500/5 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" /> Payout release: backend pipeline SCAFFOLD
            </div>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pending Net', value: `$${totalPending.toLocaleString()}`, color: 'text-amber-400', note: 'Hold conditions may apply' },
            { label: 'Released', value: `$${totalReleased.toLocaleString()}`, color: 'text-green-400', note: 'Disbursed' },
            { label: 'Hold Count', value: SEED_PAYOUTS.filter((p) => p.hold_state).length.toString(), color: 'text-amber-400', note: 'Active holds' },
            { label: 'Dispute Hold', value: SEED_PAYOUTS.filter((p) => p.release_state === 'dispute_hold').length.toString(), color: 'text-red-400', note: 'Under dispute' },
          ].map((s) => (
            <Card key={s.label} className="bg-card/40 border-border/50">
              <CardContent className="p-3 space-y-1">
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
                <div className={cn('text-xl font-mono font-bold', s.color)}>{s.value}</div>
                <div className="text-[9px] text-muted-foreground/60">{s.note}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
          <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
          <span>
            <span className="font-semibold text-amber-400/80">Scaffold payout feed.</span>
            {' '}Live data requires <code className="text-[10px] bg-muted/50 px-1 rounded">market_payouts</code> collection.
            Release requires <code className="text-[10px] bg-muted/50 px-1 rounded">closeJobAndPreparePayout</code> Cloud Function + payment provider.
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEED_PAYOUTS.map((p) => <PayoutCard key={p.payout_id} payout={p} />)}
        </div>

        <Card className="bg-card/30 border-border/40">
          <CardContent className="p-4 text-[11px] text-muted-foreground">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground/80">Financial Truthfulness — Payout Doctrine</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Completed work ≠ payout released. Platform release conditions must be satisfied.</li>
                  <li>Dispute hold blocks release until Gate 4 (High Risk Review) resolves the dispute.</li>
                  <li>Manual release override requires finance_admin authority, reason capture, and immutable audit event.</li>
                  <li>Reversed payouts carry revocation reason and actor lineage — cannot be silently undone.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/50 border-t border-border/30 pt-3">
          <span>PLANE: FIELD_MARKET | FINANCIAL_AUTHORITY: SERVER_ONLY</span>
          <span>BANE_GATE: ACTIVE | completed_work ≠ released</span>
        </div>
      </div>
    </div>
  );
}
