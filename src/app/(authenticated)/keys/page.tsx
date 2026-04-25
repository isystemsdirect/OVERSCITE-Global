'use client';

/**
 * Keys & Entitlements — LARI Key and Entitlement Record surface
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Displays LARI Key inventory and entitlement records for the user/org context.
 * Activation and revocation are server-authoritative via Cloud Functions.
 * 'pending' is NOT 'active' — this invariant must be upheld in all display contexts.
 *
 * Implementation Status: PARTIAL — display layer live; activation/revocation: Cloud Function SCAFFOLD.
 */

import React from 'react';
import {
  KeyRound,
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  WifiOff,
  Link2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import type { LariKey, EntitlementRecord, EntitlementStatus } from '@/lib/types/marketplace';

// ---------------------------------------------------------------------------
// Seed data — scaffold until market_lari_keys and market_entitlements populated
// ---------------------------------------------------------------------------

const SEED_KEYS: Omit<LariKey, 'created_at' | 'updated_at'>[] = [
  {
    key_id: 'key-lari-thermal-001',
    product_id: 'prod-lari-thermal-001',
    org_id: 'org-ovs-global',
    assigned_arc_id: 'arc-user-001',
    key_label: 'LARI-VISION™ Thermal — ORG Primary',
    key_type: 'access',
    status: 'active',
    feature_flags: ['lari_thermal_hd', 'lari_thermal_export'],
    dependency_keys: [],
    activated_at: '2026-01-15T09:00:00Z',
    expires_at: '2027-01-15T09:00:00Z',
    order_ref: 'ord-001',
    audit_event_id: 'evt-key-001',
  },
  {
    key_id: 'key-bane-deep-001',
    product_id: 'prod-bane-deep-001',
    org_id: 'org-ovs-global',
    key_label: 'BANE™ Deep Forensic Ledger — Pending',
    key_type: 'access',
    status: 'pending',
    feature_flags: ['bane_deep_ledger', 'bane_forensic_export'],
    dependency_keys: [],
    order_ref: 'ord-002',
    audit_event_id: 'evt-key-002',
  },
];

const SEED_ENTITLEMENTS: Omit<EntitlementRecord, 'created_at' | 'updated_at'>[] = [
  {
    entitlement_id: 'ent-lari-001',
    owner_type: 'org',
    owner_id: 'org-ovs-global',
    source_order_id: 'ord-001',
    source_product_id: 'prod-lari-thermal-001',
    status: 'active',
    feature_flags: ['lari_thermal_hd', 'lari_thermal_export'],
    issued_at: '2026-01-15T09:00:00Z',
    expires_at: '2027-01-15T09:00:00Z',
    renewal_state: 'auto_renew',
    audit_event_id: 'evt-ent-001',
  },
  {
    entitlement_id: 'ent-bane-001',
    owner_type: 'org',
    owner_id: 'org-ovs-global',
    source_order_id: 'ord-002',
    source_product_id: 'prod-bane-deep-001',
    status: 'pending',
    feature_flags: ['bane_deep_ledger'],
    renewal_state: 'none',
    audit_event_id: 'evt-ent-002',
  },
  {
    entitlement_id: 'ent-export-001',
    owner_type: 'user',
    owner_id: 'arc-user-001',
    source_order_id: 'ord-prev-03',
    source_product_id: 'prod-export-pack-001',
    status: 'expired',
    feature_flags: ['export_pdf', 'export_xlsx', 'export_geojson'],
    issued_at: '2026-02-01T00:00:00Z',
    expires_at: '2026-03-01T00:00:00Z',
    renewal_state: 'manual_renew_pending',
    audit_event_id: 'evt-ent-003',
  },
];

const ENTITLEMENT_STATUS_CONFIG: Record<EntitlementStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending Activation', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/30', icon: <Clock className="h-3.5 w-3.5" /> },
  active: { label: 'Active', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  trial: { label: 'Trial Active', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  suspended: { label: 'Suspended', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  revoked: { label: 'Revoked', color: 'text-red-500', bgColor: 'bg-red-700/10 border-red-700/30', icon: <Lock className="h-3.5 w-3.5" /> },
  expired: { label: 'Expired', color: 'text-muted-foreground', bgColor: 'bg-muted/30 border-border', icon: <CircleDot className="h-3.5 w-3.5" /> },
};

function LariKeyCard({ keyData }: { keyData: Omit<LariKey, 'created_at' | 'updated_at'> }) {
  const isActive = keyData.status === 'active';
  const isPending = keyData.status === 'pending';
  const statusCfg = ENTITLEMENT_STATUS_CONFIG[keyData.status];

  return (
    <Card className={cn('border flex flex-col', statusCfg.bgColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isActive ? <Unlock className="h-4 w-4 text-green-400" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            <div>
              <CardTitle className="text-sm">{keyData.key_label}</CardTitle>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{keyData.key_id}</div>
            </div>
          </div>
          <div className={cn('flex items-center gap-1 text-[10px] font-mono shrink-0', statusCfg.color)}>
            {statusCfg.icon} {statusCfg.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pb-3">
        <div>
          <div className="text-[10px] text-muted-foreground/70 uppercase font-mono mb-1">Feature Flags</div>
          <div className="flex flex-wrap gap-1">
            {keyData.feature_flags.map((f) => (
              <span key={f} className="text-[9px] font-mono text-primary/70 bg-primary/5 border border-primary/15 rounded px-1.5 py-0.5">{f}</span>
            ))}
          </div>
        </div>

        {keyData.dependency_keys.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Link2 className="h-3 w-3" />
            <span>Depends on: {keyData.dependency_keys.join(', ')}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {keyData.activated_at && (
            <div>
              <div className="text-muted-foreground/60">Activated</div>
              <div className="font-mono">{new Date(keyData.activated_at).toLocaleDateString()}</div>
            </div>
          )}
          {keyData.expires_at && (
            <div>
              <div className="text-muted-foreground/60">Expires</div>
              <div className="font-mono">{new Date(keyData.expires_at).toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {isPending && (
          <div className="flex items-start gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5">
            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
            Pending — activation requires <code className="text-[9px] bg-amber-500/10 px-0.5 rounded">activateEntitlement</code> Cloud Function [SCAFFOLD]
          </div>
        )}

        <div className="text-[9px] text-muted-foreground/40 font-mono">AUDIT: {keyData.audit_event_id}</div>
      </CardContent>
      <div className="border-t border-border/30 p-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">View Details</Button>
        {isActive && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400/70 hover:text-red-400" disabled>
            Revoke [SCAFFOLD]
          </Button>
        )}
        {isPending && (
          <Button size="sm" className="flex-1 h-7 text-xs" disabled>
            Activate [SCAFFOLD]
          </Button>
        )}
      </div>
    </Card>
  );
}

function EntitlementRow({ ent }: { ent: Omit<EntitlementRecord, 'created_at' | 'updated_at'> }) {
  const statusCfg = ENTITLEMENT_STATUS_CONFIG[ent.status];
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-card/40 border border-border/40">
      <div className={cn('shrink-0', statusCfg.color)}>{statusCfg.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono truncate">{ent.entitlement_id}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {ent.feature_flags.slice(0, 3).map((f) => (
            <span key={f} className="text-[9px] font-mono text-primary/60 bg-primary/5 border border-primary/10 rounded px-1 py-0.5">{f}</span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={cn('text-[10px] font-mono', statusCfg.color)}>{statusCfg.label}</div>
        {ent.renewal_state !== 'none' && (
          <div className="text-[9px] text-muted-foreground">{ent.renewal_state.replace(/_/g, ' ')}</div>
        )}
        {ent.expires_at && (
          <div className="text-[9px] text-muted-foreground/60">{new Date(ent.expires_at).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}

export default function KeysPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Keys & Entitlements"
          status="partial"
          description="The Keys and Entitlements surface provides a governed view of all LARI Key tokens and entitlement records assigned to the user and organization context. LARI Keys carry entitlement-bearing feature flags that authorize specific platform capabilities. Entitlement status is always server-authoritative — pending is not active, and activation requires explicit Cloud Function confirmation."
          actions={
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 border border-amber-500/20 bg-amber-500/5 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" /> Activation / Revocation: Cloud Function SCAFFOLD
            </div>
          }
        />

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
          <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
          <span>
            <span className="font-semibold text-amber-400/80">Scaffold inventory.</span>
            {' '}Live data requires <code className="text-[10px] bg-muted/50 px-1 rounded">market_lari_keys</code> and{' '}
            <code className="text-[10px] bg-muted/50 px-1 rounded">market_entitlements</code> org query.
          </span>
        </div>

        <Tabs defaultValue="keys">
          <TabsList className="bg-card/40">
            <TabsTrigger value="keys" className="gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> LARI Keys ({SEED_KEYS.length})
            </TabsTrigger>
            <TabsTrigger value="entitlements" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Entitlements ({SEED_ENTITLEMENTS.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SEED_KEYS.map((k) => <LariKeyCard key={k.key_id} keyData={k} />)}
            </div>
          </TabsContent>

          <TabsContent value="entitlements" className="mt-4 space-y-4">
            <div className="space-y-2">
              {SEED_ENTITLEMENTS.map((e) => <EntitlementRow key={e.entitlement_id} ent={e} />)}
            </div>

            <Card className="bg-card/30 border-border/40">
              <CardContent className="p-4 text-[11px] text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 text-primary/60 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground/80">Entitlement Governance Notes</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><code className="text-[9px] bg-muted/50 px-0.5 rounded">pending</code> is NOT <code className="text-[9px] bg-muted/50 px-0.5 rounded">active</code>. Feature access is only granted after server-side activation.</li>
                      <li>Revocation is immutable — requires actor identity, reason, and BANE audit event.</li>
                      <li>Auto-renewed entitlements require backend renewal event before expiry.</li>
                      <li>Expired entitlements do not auto-revoke — renewal_state governs continuation path.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/50 border-t border-border/30 pt-3">
          <span>PLANE: MARKETPLACE | ENTITLEMENT_AUTHORITY: SERVER_ONLY</span>
          <span>pending ≠ active | BANE_GATE: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
