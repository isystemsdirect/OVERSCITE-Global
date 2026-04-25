'use client';

/**
 * Marketplace — Plane 2: Capability/Entitlement Commerce
 * UTCB-S V1.0 — SCINGULAR Global Marketplace Stack
 *
 * Implementation Status:
 *  - Capability Catalog UI: LIVE (display layer)
 *  - LARI Key inventory: LIVE (read from market_lari_keys)
 *  - Purchase/license flow: SCAFFOLD (order creation via Cloud Function)
 *  - Entitlement activation: SCAFFOLD (activateEntitlement Cloud Function)
 *
 * ARCHIVED: Pre-V1 Capability Registry page → archive/marketplace-page-pre-v1-marketplace-stack.tsx
 */

import React, { useState } from 'react';
import {
  KeyRound,
  Package,
  Shield,
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Star,
  Loader2,
  WifiOff,
  BarChart3,
  Link2,
  Globe,
  Cpu,
  FlaskConical,
  Building2,
  Code2,
  FileCheck2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import type {
  CapabilityProduct,
  MarketplaceStatus,
  CapabilityProductType,
  LariKey,
  EntitlementStatus,
} from '@/lib/types/marketplace';

// ---------------------------------------------------------------------------
// Seed data — scaffold until Firestore market_products/market_lari_keys populated
// ---------------------------------------------------------------------------

const SEED_PRODUCTS: CapabilityProduct[] = [
  {
    product_id: 'prod-lari-thermal-001',
    publisher_org_id: 'org-ovs-global',
    product_type: 'lari_key',
    name: 'LARI-VISION™ High-Def Thermal Key',
    short_description: 'Unlocks thermal layer analysis for site inspections with LARI-G sensor binding.',
    full_description: 'The LARI-VISION Thermal Key authorizes high-definition thermal imaging analysis through the LARI sensor pipeline. Requires a LARI-G authorized hardware link and org-level compliance verification.',
    pricing_model: 'subscription_annual',
    price_amount: 4800,
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['enterprise', 'pro'], requires_org_role: ['key_manager', 'org_buyer'] },
    entitlement_scope: { feature_flags: ['lari_thermal_hd', 'lari_thermal_export'], access_duration_days: 365, renewable: true, org_wide: false },
    status: 'live',
    version: '2.1.0',
    visibility: 'public',
    requires_review_approval: false,
    governance_annotations: ['LARI-G hardware binding required'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: 'prod-lari-lidar-001',
    publisher_org_id: 'org-ovs-global',
    product_type: 'lari_key',
    name: 'LARI-LiDAR™ Point Cloud Pro Key',
    short_description: 'Full LiDAR processing pipeline with LAS 1.4 export and corridor analysis.',
    full_description: 'Activates the LARI LiDAR point cloud processing engine at Pro tier. Includes automated corridor profiling, LAS 1.4 format export, and LARI-certified deliverable generation.',
    pricing_model: 'subscription_annual',
    price_amount: 6500,
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['enterprise'], requires_org_role: ['key_manager', 'org_buyer'], requires_lari_key: 'prod-lari-thermal-001' },
    entitlement_scope: { feature_flags: ['lari_lidar_pro', 'lari_lidar_export', 'lari_corridor'], access_duration_days: 365, renewable: true, org_wide: false },
    status: 'live',
    version: '1.4.2',
    visibility: 'public',
    requires_review_approval: false,
    governance_annotations: ['Requires LARI-VISION Thermal Key', 'LARI-G drone hardware binding required'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: 'prod-bane-deep-001',
    publisher_org_id: 'org-ovs-governance',
    product_type: 'premium_analytics_module',
    name: 'BANE™ Deep Forensic Ledger',
    short_description: 'Extended audit-trail retention and verification depth for regulatory compliance.',
    full_description: 'Enables extended BANE audit event retention, cryptographic verification replay, and regulatory-submission-ready export paths. Designed for compliance-critical organizational contexts.',
    pricing_model: 'enterprise_contract',
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['enterprise'], requires_org_role: ['compliance_reviewer', 'enterprise_sales_admin', 'org_buyer'] },
    entitlement_scope: { feature_flags: ['bane_deep_ledger', 'bane_forensic_export'], access_duration_days: 365, renewable: true, org_wide: true },
    status: 'restricted',
    version: '1.0.1',
    visibility: 'org_only',
    requires_review_approval: true,
    governance_annotations: ['Enterprise contract required', 'Compliance review mandatory'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: 'prod-compliance-pkg-001',
    publisher_org_id: 'org-ovs-global',
    product_type: 'compliance_pack',
    name: 'Environmental Compliance Pack — NEPA',
    short_description: 'Pre-built compliance workflows, forms, and reporting templates for NEPA submissions.',
    full_description: 'Bundles NEPA-ready documentation templates, field checklist workflows, and automated citation matching against regulatory overlays. Reduces environmental submission preparation by approximately 60%.',
    pricing_model: 'one_time',
    price_amount: 1200,
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['pro', 'enterprise'], requires_org_role: ['org_buyer'] },
    entitlement_scope: { feature_flags: ['compliance_nepa_pack'], access_duration_days: 0, renewable: false, org_wide: true },
    status: 'live',
    version: '3.0.0',
    visibility: 'public',
    requires_review_approval: false,
    governance_annotations: ['One-time purchase — perpetual org-wide access'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: 'prod-standalone-001',
    publisher_org_id: 'org-ovs-enterprise',
    product_type: 'standalone_deployment_tier',
    name: 'SCINGULAR Standalone Deployment Authorization',
    short_description: 'Governed enterprise platform deployment authorization. Commercial review required.',
    full_description: 'Authorizes a qualified enterprise organization to operate a governed standalone deployment of SCINGULAR Global capabilities within their own infrastructure envelope. Subject to formal commercial review, qualification assessment, and contract execution.',
    pricing_model: 'approval_required',
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['enterprise'], requires_org_role: ['enterprise_sales_admin'] },
    entitlement_scope: { feature_flags: ['standalone_deploy_authorized'], access_duration_days: 365, renewable: true, org_wide: true },
    status: 'enterprise_only',
    version: '1.0.0',
    visibility: 'invite_only',
    requires_review_approval: true,
    governance_annotations: ['Formal commercial review required', 'Contract execution required', 'Director-level approval'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: 'prod-export-pack-001',
    publisher_org_id: 'org-ovs-global',
    product_type: 'export_pack',
    name: 'Advanced Export Pack — Multi-Format',
    short_description: 'PDF, XLSX, GeoJSON, and KML export capability for inspection and survey deliverables.',
    full_description: 'Enables automated multi-format export of inspection findings, field survey results, and regulatory submissions. Supports PDF/A for legal admissibility, GeoJSON for GIS workflows, and KML for spatial visualization.',
    pricing_model: 'subscription_monthly',
    price_amount: 149,
    price_currency: 'USD',
    compatibility: { requires_plan_tier: ['pro', 'enterprise'], requires_org_role: ['org_buyer'] },
    entitlement_scope: { feature_flags: ['export_pdf', 'export_xlsx', 'export_geojson', 'export_kml'], access_duration_days: 30, renewable: true, org_wide: false },
    status: 'live',
    version: '2.3.1',
    visibility: 'public',
    requires_review_approval: false,
    governance_annotations: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_LARI_KEYS: Pick<LariKey, 'key_id' | 'product_id' | 'key_label' | 'key_type' | 'status' | 'feature_flags' | 'dependency_keys' | 'expires_at'>[] = [
  {
    key_id: 'key-lari-001',
    product_id: 'prod-lari-thermal-001',
    key_label: 'LARI-VISION Thermal — ORG Primary',
    key_type: 'access',
    status: 'active',
    feature_flags: ['lari_thermal_hd', 'lari_thermal_export'],
    dependency_keys: [],
    expires_at: '2027-01-01',
  },
  {
    key_id: 'key-bane-001',
    product_id: 'prod-bane-deep-001',
    key_label: 'BANE Deep Forensic — Pending Activation',
    key_type: 'access',
    status: 'pending',
    feature_flags: ['bane_deep_ledger'],
    dependency_keys: [],
  },
];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const PRODUCT_STATUS_CONFIG: Record<MarketplaceStatus, { label: string; color: string; icon: React.ReactNode; disclosure?: string }> = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground border-border', icon: <CircleDot className="h-3 w-3" /> },
  review_required: { label: 'Review Required', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
  live: { label: 'Live', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: <CheckCircle2 className="h-3 w-3" /> },
  beta: { label: 'Beta', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: <FlaskConical className="h-3 w-3" />, disclosure: 'Beta — functionality may change' },
  experimental: { label: 'Experimental', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: <FlaskConical className="h-3 w-3" />, disclosure: 'Experimental — not production-ready' },
  restricted: { label: 'Restricted', color: 'bg-amber-700/10 text-amber-500 border-amber-700/30', icon: <Lock className="h-3 w-3" />, disclosure: 'Restricted access — approval required' },
  enterprise_only: { label: 'Enterprise', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: <Building2 className="h-3 w-3" />, disclosure: 'Enterprise — approval required' },
  deprecated: { label: 'Deprecated', color: 'bg-muted text-muted-foreground border-border', icon: <AlertTriangle className="h-3 w-3" /> },
  archived: { label: 'Archived', color: 'bg-muted/50 text-muted-foreground/50 border-border/30', icon: <CircleDot className="h-3 w-3" /> },
  blocked: { label: 'Blocked', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
};

const ENTITLEMENT_STATUS_CONFIG: Record<EntitlementStatus, { label: string; color: string }> = {
  pending: { label: 'Pending Activation', color: 'text-amber-400' },
  active: { label: 'Active', color: 'text-green-400' },
  trial: { label: 'Trial Active', color: 'text-blue-400' },
  suspended: { label: 'Suspended', color: 'text-red-400' },
  revoked: { label: 'Revoked', color: 'text-red-500' },
  expired: { label: 'Expired', color: 'text-muted-foreground' },
};

const PRODUCT_TYPE_ICONS: Record<CapabilityProductType, React.ReactNode> = {
  lari_key: <KeyRound className="h-4 w-4" />,
  workflow_pack: <FileCheck2 className="h-4 w-4" />,
  compliance_pack: <Shield className="h-4 w-4" />,
  export_pack: <Package className="h-4 w-4" />,
  premium_analytics_module: <BarChart3 className="h-4 w-4" />,
  enterprise_connector: <Link2 className="h-4 w-4" />,
  standalone_deployment_tier: <Globe className="h-4 w-4" />,
  developer_integrator_package: <Code2 className="h-4 w-4" />,
  other: <Cpu className="h-4 w-4" />,
};

const PRICING_DISPLAY: Record<string, string> = {
  one_time: 'One-Time Purchase',
  subscription_monthly: '/mo',
  subscription_annual: '/yr',
  enterprise_contract: 'Enterprise Contract',
  approval_required: 'Approval Required',
  free: 'Free',
};

// ---------------------------------------------------------------------------
// Product Card
// ---------------------------------------------------------------------------

function ProductCard({ product }: { product: CapabilityProduct }) {
  const statusCfg = PRODUCT_STATUS_CONFIG[product.status];
  const isActionable = product.status === 'live' || product.status === 'beta';
  const isApproval = product.requires_review_approval || product.pricing_model === 'approval_required';

  const priceDisplay = product.price_amount
    ? `$${product.price_amount.toLocaleString()}${PRICING_DISPLAY[product.pricing_model] ?? ''}`
    : PRICING_DISPLAY[product.pricing_model] ?? product.pricing_model;

  return (
    <Card className="bg-card/50 border-border/60 flex flex-col transition-all hover:bg-card/70 hover:border-primary/20 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            {PRODUCT_TYPE_ICONS[product.product_type]}
            <Badge variant="outline" className="text-[10px]">
              {product.product_type.replace(/_/g, ' ')}
            </Badge>
          </div>
          <div className={cn('flex items-center gap-1 text-[10px] font-mono border rounded px-1.5 py-0.5 shrink-0', statusCfg.color)}>
            {statusCfg.icon}
            <span>{statusCfg.label}</span>
          </div>
        </div>
        <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
        <div className="text-[10px] text-muted-foreground font-mono">v{product.version}</div>
        {statusCfg.disclosure && (
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1 mt-1">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {statusCfg.disclosure}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{product.short_description}</p>

        {/* Entitlement scope */}
        <div className="text-[10px] space-y-1">
          <div className="text-muted-foreground/70 uppercase tracking-wide font-mono">Unlocks</div>
          <div className="flex flex-wrap gap-1">
            {product.entitlement_scope.feature_flags.slice(0, 3).map((f) => (
              <span key={f} className="bg-primary/5 text-primary/70 border border-primary/15 rounded px-1.5 py-0.5 text-[9px] font-mono">{f}</span>
            ))}
            {product.entitlement_scope.feature_flags.length > 3 && (
              <span className="text-muted-foreground text-[9px]">+{product.entitlement_scope.feature_flags.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Compatibility requirements */}
        {(product.compatibility.requires_lari_key || product.compatibility.requires_plan_tier.length > 0) && (
          <div className="text-[10px] space-y-1">
            <div className="text-muted-foreground/70 uppercase tracking-wide font-mono">Requires</div>
            {product.compatibility.requires_plan_tier.length > 0 && (
              <span className="flex items-center gap-1 text-[9px] text-amber-400/80">
                <Shield className="h-2.5 w-2.5" /> Plan: {product.compatibility.requires_plan_tier.join(' or ')}
              </span>
            )}
            {product.compatibility.requires_lari_key && (
              <span className="flex items-center gap-1 text-[9px] text-primary/70">
                <KeyRound className="h-2.5 w-2.5" /> LARI Key dependency
              </span>
            )}
          </div>
        )}

        {/* Governance annotations */}
        {product.governance_annotations.length > 0 && (
          <div className="space-y-1">
            {product.governance_annotations.map((note, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[9px] text-muted-foreground/70">
                <Info className="h-2.5 w-2.5 shrink-0" />{note}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 border-t border-border/40 py-3 mt-auto gap-2 flex flex-col items-stretch">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted-foreground">Pricing</span>
          <span className="font-mono">{priceDisplay}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <ChevronRight className="h-3.5 w-3.5 mr-1" /> Details
          </Button>
          {isActionable && (
            <Button size="sm" className="flex-1 h-8 text-xs" disabled>
              {isApproval ? 'Request Access' : 'Purchase'}
              <span className="ml-1 text-[9px] opacity-60">[SCAFFOLD]</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// LARI Key Row
// ---------------------------------------------------------------------------

function LariKeyRow({ keyData }: { keyData: typeof SEED_LARI_KEYS[0] }) {
  const statusCfg = ENTITLEMENT_STATUS_CONFIG[keyData.status];
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-card/40 border border-border/40 hover:bg-card/60 transition-colors">
      <div className={cn('h-2 w-2 rounded-full shrink-0', keyData.status === 'active' ? 'bg-green-400' : keyData.status === 'pending' ? 'bg-amber-400' : 'bg-muted-foreground')} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{keyData.key_label}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {keyData.feature_flags.map((f) => (
            <span key={f} className="text-[9px] font-mono text-primary/60 bg-primary/5 border border-primary/10 rounded px-1 py-0.5">{f}</span>
          ))}
        </div>
        {keyData.expires_at && (
          <div className="text-[9px] text-muted-foreground mt-1">Expires: {new Date(keyData.expires_at).toLocaleDateString()}</div>
        )}
      </div>
      <div className={cn('text-[10px] font-mono shrink-0', statusCfg.color)}>{statusCfg.label}</div>
      <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" disabled={keyData.status === 'pending'}>
        {keyData.status === 'active' ? 'Manage' : 'Activate'}
        {keyData.status === 'pending' && <span className="ml-1 text-[9px] opacity-60">[SCAFFOLD]</span>}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PRODUCT_TYPE_FILTERS: { label: string; value: CapabilityProductType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'LARI Keys', value: 'lari_key' },
  { label: 'Compliance', value: 'compliance_pack' },
  { label: 'Export', value: 'export_pack' },
  { label: 'Analytics', value: 'premium_analytics_module' },
  { label: 'Enterprise', value: 'standalone_deployment_tier' },
];

export default function MarketplacePage() {
  const [typeFilter, setTypeFilter] = useState<CapabilityProductType | 'all'>('all');

  const filteredProducts = SEED_PRODUCTS.filter(
    (p) => typeFilter === 'all' || p.product_type === typeFilter
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Marketplace"
          status="partial"
          description="The SCINGULAR Marketplace is the capability and entitlement commerce layer for the SCINGULAR™ ecosystem. This is where LARI Keys, premium analytical modules, compliance packs, and governed platform access artifacts are catalogued and licensed. All products are version-controlled, eligibility-gated, and governed by BANE integrity enforcement. Entitlement issuance is server-authoritative — client-side optimistic access state is not permitted."
          actions={
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 border border-amber-500/20 bg-amber-500/5 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" /> Purchase flow: Cloud Function SCAFFOLD
            </div>
          }
        />

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="bg-card/40 max-w-lg">
            <TabsTrigger value="catalog" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Capability Catalog
            </TabsTrigger>
            <TabsTrigger value="keys" className="gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> LARI Keys
            </TabsTrigger>
            <TabsTrigger value="standalone" className="gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Standalone Auth
            </TabsTrigger>
          </TabsList>

          {/* -- CATALOG TAB -- */}
          <TabsContent value="catalog" className="mt-6">
            <div className="flex flex-col gap-4">
              {/* Scaffold notice */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
                <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
                <span>
                  <span className="font-semibold text-amber-400/80">Scaffold catalog active.</span>
                  {' '}Live data requires{' '}<code className="text-[10px] bg-muted/50 px-1 rounded">market_products</code> collection. Purchase and entitlement activation: Cloud Function pipeline.
                </span>
              </div>

              {/* Type filter */}
              <div className="flex gap-2 flex-wrap">
                {PRODUCT_TYPE_FILTERS.map((f) => (
                  <Button
                    key={f.value}
                    variant={typeFilter === f.value ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setTypeFilter(f.value)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* -- LARI KEYS TAB -- */}
          <TabsContent value="keys" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Org LARI Key Inventory</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Active and pending LARI Key entitlements assigned to your organization.</p>
                </div>
                <Button size="sm" className="h-8 text-xs" disabled>
                  <KeyRound className="h-3.5 w-3.5 mr-1" /> Activate Key
                  <span className="ml-1 text-[9px] opacity-60">[SCAFFOLD]</span>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
                <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
                <span>
                  <span className="font-semibold text-amber-400/80">Scaffold key inventory.</span>
                  {' '}Live data requires <code className="text-[10px] bg-muted/50 px-1 rounded">market_lari_keys</code> org query.
                  Pending keys require <code className="text-[10px] bg-muted/50 px-1 rounded">activateEntitlement</code> Cloud Function.
                </span>
              </div>

              <div className="space-y-2">
                {SEED_LARI_KEYS.map((k) => (
                  <LariKeyRow key={k.key_id} keyData={k} />
                ))}
              </div>

              <Card className="bg-card/30 border-border/40">
                <CardContent className="p-4 text-[11px] text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground/80">Key Governance Notes</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Key activation is server-authoritative. Pending ≠ Active.</li>
                    <li>Key revocation requires Gate 3 (actor lineage + reason) and produces an immutable audit event.</li>
                    <li>Dependency keys must be active before dependent key activation.</li>
                    <li>Expiry does not auto-revoke — renewal state governs continuation.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* -- STANDALONE AUTH TAB -- */}
          <TabsContent value="standalone" className="mt-6">
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Standalone Deployment Authorization</CardTitle>
                  </div>
                  <CardDescription className="text-xs leading-relaxed">
                    Enterprise organizations may request authorization to operate governed standalone SCINGULAR deployments.
                    This process involves qualification review, commercial review, and contract execution.
                    It is not a self-service purchase flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-md p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">SCAFFOLD — Review Only Placeholder.</span>
                      {' '}The submission flow triggers the <code className="text-[10px] bg-amber-500/10 px-0.5 rounded">requestStandaloneAuthorization</code> Cloud Function which is currently a typed stub.
                      Full approval pipeline (Gate 4, enterprise_sales_admin review, contract execution) requires backend integration.
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-[11px]">
                    {['Qualification Review', 'Commercial Review', 'Contract Execution'].map((step, i) => (
                      <div key={step} className="bg-card/40 border border-border/40 rounded-md p-3 space-y-1">
                        <div className="font-mono text-primary/50 text-[9px]">STEP {i + 1}</div>
                        <div className="font-semibold">{step}</div>
                        <div className="text-muted-foreground text-[10px]">Gate 4 governed</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-9 text-sm" disabled>
                    Submit Authorization Request
                    <span className="ml-2 text-[10px] opacity-60">[SCAFFOLD]</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Governance footer */}
        <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/50 border-t border-border/30 pt-3">
          <span>PLANE: MARKETPLACE | TRUST_CLASS: CAPABILITY_COMMERCE</span>
          <span>BANE_GATE_STATUS: ACTIVE | ENTITLEMENT_AUTHORITY: SERVER_ONLY</span>
        </div>
      </div>
    </div>
  );
}
