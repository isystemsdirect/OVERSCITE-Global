'use client';

/**
 * Orders — Shared commerce order record surface
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Spans both planes: 'field_market' orders (labor transactions) and 'marketplace' orders (capability purchases).
 * The order_plane field distinguishes origin — status vocabulary must not be conflated.
 *
 * Implementation Status: PARTIAL — display layer live; payment processing: backend pipeline required.
 */

import React, { useState } from 'react';
import {
  ShoppingCart,
  Briefcase,
  Package,
  Clock,
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  DollarSign,
  WifiOff,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import type { OrderRecord, OrderStatus } from '@/lib/types/marketplace';

// ---------------------------------------------------------------------------
// Seed orders — scaffold until market_orders collection populated
// ---------------------------------------------------------------------------

const SEED_ORDERS: Omit<OrderRecord, 'created_at' | 'updated_at'>[] = [
  {
    order_id: 'ord-001',
    order_plane: 'marketplace',
    buyer_arc_id: 'arc-user-001',
    buyer_org_id: 'org-ovs-global',
    seller_org_id: 'org-ovs-global',
    line_items: [
      { line_id: 'li-001', product_id: 'prod-lari-thermal-001', description: 'LARI-VISION™ High-Def Thermal Key — Annual', quantity: 1, unit_price: 4800, total_price: 4800 },
    ],
    subtotal: 4800,
    platform_fee: 0,
    tax_amount: 384,
    total_amount: 5184,
    currency: 'USD',
    status: 'fulfilled',
    approval_required: false,
    entitlement_ref: 'ent-lari-001',
    audit_event_id: 'evt-ord-001',
  },
  {
    order_id: 'ord-002',
    order_plane: 'marketplace',
    buyer_arc_id: 'arc-user-001',
    buyer_org_id: 'org-ovs-global',
    seller_org_id: 'org-ovs-governance',
    line_items: [
      { line_id: 'li-002', product_id: 'prod-bane-deep-001', description: 'BANE™ Deep Forensic Ledger — Enterprise Contract', quantity: 1, unit_price: 0, total_price: 0 },
    ],
    subtotal: 0,
    platform_fee: 0,
    tax_amount: 0,
    total_amount: 0,
    currency: 'USD',
    status: 'pending_payment',
    approval_required: true,
    audit_event_id: 'evt-ord-002',
  },
  {
    order_id: 'ord-003',
    order_plane: 'field_market',
    buyer_arc_id: 'arc-director-001',
    buyer_org_id: 'org-ovs-global',
    line_items: [
      { line_id: 'li-003', job_id: 'job-001', description: 'Commercial Rooftop Thermal Inspection — Block 7 Complex', quantity: 1, unit_price: 1200, total_price: 1200 },
    ],
    subtotal: 1200,
    platform_fee: 120,
    tax_amount: 0,
    total_amount: 1320,
    currency: 'USD',
    status: 'fulfillment_pending',
    approval_required: false,
    job_ref: 'job-001',
    audit_event_id: 'evt-ord-003',
  },
];

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', color: 'text-muted-foreground', icon: <CircleDot className="h-3 w-3" /> },
  pending_payment: { label: 'Pending Payment', color: 'text-amber-400', icon: <Clock className="h-3 w-3" /> },
  payment_authorized: { label: 'Payment Authorized', color: 'text-blue-400', icon: <Clock className="h-3 w-3" /> },
  payment_captured: { label: 'Payment Captured', color: 'text-blue-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  fulfillment_pending: { label: 'Fulfillment Pending', color: 'text-indigo-400', icon: <Clock className="h-3 w-3" /> },
  fulfilled: { label: 'Fulfilled', color: 'text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  under_review: { label: 'Under Review', color: 'text-amber-500', icon: <AlertTriangle className="h-3 w-3" /> },
  refunded: { label: 'Refunded', color: 'text-muted-foreground', icon: <CircleDot className="h-3 w-3" /> },
  disputed: { label: 'Disputed', color: 'text-red-400', icon: <AlertTriangle className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', color: 'text-muted-foreground', icon: <CircleDot className="h-3 w-3" /> },
  blocked: { label: 'Blocked', color: 'text-red-500', icon: <AlertTriangle className="h-3 w-3" /> },
};

function OrderRow({ order }: { order: Omit<OrderRecord, 'created_at' | 'updated_at'> }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const isFieldMarket = order.order_plane === 'field_market';

  return (
    <div className="border border-border/50 rounded-md overflow-hidden">
      <div
        className="flex items-center gap-3 p-3 bg-card/50 cursor-pointer hover:bg-card/70 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn('p-1.5 rounded bg-card border border-border/50', isFieldMarket ? 'text-amber-400' : 'text-primary')}>
          {isFieldMarket ? <Briefcase className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground/60">{order.order_id}</span>
            <Badge variant="outline" className="text-[9px] py-0">
              {isFieldMarket ? 'Field Market' : 'Marketplace'}
            </Badge>
            {order.approval_required && (
              <Badge variant="outline" className="text-[9px] py-0 text-amber-400 border-amber-500/30">Approval Required</Badge>
            )}
          </div>
          <div className="text-xs mt-0.5 truncate">{order.line_items[0]?.description}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn('flex items-center gap-1 text-[10px] font-mono', statusCfg.color)}>
            {statusCfg.icon} {statusCfg.label}
          </div>
          <span className="text-xs font-mono font-semibold">
            {order.total_amount === 0 ? 'Contract' : `$${order.total_amount.toFixed(2)}`}
          </span>
          {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/40 p-3 bg-card/30 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
            <div className="space-y-1.5">
              {order.line_items.map((li) => (
                <div key={li.line_id} className="flex justify-between">
                  <span className="text-muted-foreground truncate">{li.description}</span>
                  <span className="font-mono ml-2">${li.total_price.toFixed(2)}</span>
                </div>
              ))}
              {order.platform_fee > 0 && (
                <div className="flex justify-between text-muted-foreground/70">
                  <span>Platform fee</span>
                  <span className="font-mono">${order.platform_fee.toFixed(2)}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-muted-foreground/70">
                  <span>Tax</span>
                  <span className="font-mono">${order.tax_amount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-mono">{order.total_amount === 0 ? 'Contract terms' : `$${order.total_amount.toFixed(2)} ${order.currency}`}</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] text-muted-foreground">
              <div className="flex justify-between"><span>Order ID</span><span className="font-mono">{order.order_id}</span></div>
              <div className="flex justify-between"><span>Plane</span><span className="font-mono">{order.order_plane}</span></div>
              {order.entitlement_ref && <div className="flex justify-between"><span>Entitlement Ref</span><span className="font-mono">{order.entitlement_ref}</span></div>}
              {order.job_ref && <div className="flex justify-between"><span>Job Ref</span><span className="font-mono">{order.job_ref}</span></div>}
              <div className="flex justify-between"><span>Audit Event</span><span className="font-mono">{order.audit_event_id}</span></div>
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground/50 font-mono">
            PAYMENT: SERVER-AUTHORITATIVE | authorized ≠ captured | fulfilled ≠ entitlement_active (until backend confirms)
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const marketplaceOrders = SEED_ORDERS.filter((o) => o.order_plane === 'marketplace');
  const fieldMarketOrders = SEED_ORDERS.filter((o) => o.order_plane === 'field_market');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Orders"
          status="partial"
          guidanceId="action-approval"
          description="Orders records span both marketplace planes, capturing Field Market labor transactions and Marketplace capability purchases within a single governed ledger. Each order carries its originating plane, financial lineage, audit event reference, and entitlement or job reference where applicable. Payment processing and entitlement activation are server-authoritative — no client-side financial state is final without backend confirmation."
          actions={
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 border border-amber-500/20 bg-amber-500/5 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" /> Payment processing: backend pipeline SCAFFOLD
            </div>
          }
        />

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
          <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
          <span>
            <span className="font-semibold text-amber-400/80">Scaffold order feed.</span>
            {' '}Live data requires <code className="text-[10px] bg-muted/50 px-1 rounded">market_orders</code> collection.
            Payment capture and entitlement fulfillment require Cloud Function pipeline.
          </span>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-card/40">
            <TabsTrigger value="all">All Orders ({SEED_ORDERS.length})</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace ({marketplaceOrders.length})</TabsTrigger>
            <TabsTrigger value="field_market">Field Market ({fieldMarketOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-2">
            {SEED_ORDERS.map((o) => <OrderRow key={o.order_id} order={o} />)}
          </TabsContent>
          <TabsContent value="marketplace" className="mt-4 space-y-2">
            {marketplaceOrders.map((o) => <OrderRow key={o.order_id} order={o} />)}
          </TabsContent>
          <TabsContent value="field_market" className="mt-4 space-y-2">
            {fieldMarketOrders.map((o) => <OrderRow key={o.order_id} order={o} />)}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/50 border-t border-border/30 pt-3">
          <span>ORDERS: BOTH_PLANES | FINANCIAL_AUTHORITY: SERVER_ONLY</span>
          <span>BANE_AUDIT: ACTIVE | pending ≠ settled | authorized ≠ captured</span>
        </div>
      </div>
    </div>
  );
}
