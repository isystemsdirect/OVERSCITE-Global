'use client';

/**
 * Field Market — Plane 1: Labor/Dispatch Exchange
 * UTCB-S V1.0 — OVERSCITE Global Marketplace Stack
 *
 * Implementation Status:
 *  - Opportunity Feed UI: LIVE (display layer)
 *  - Offer/Assignment action flows: SCAFFOLD (BANE gate wired; Cloud Function dispatch pending)
 *  - Payout display: PARTIAL (read layer live; payout release: backend pipeline required)
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Search,
  Filter,
  Clock,
  Shield,
  ChevronRight,
  Star,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Loader2,
  WifiOff,
  Calendar,
  DollarSign,
  Award,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/PageHeader';
import { TruthStateBadge } from '@/components/layout/TruthStateBadge';
import { cn } from '@/lib/utils';
import type { FieldMarketStatus, FieldJobType, JobListing } from '@/lib/types/marketplace';

// ---------------------------------------------------------------------------
// Seed data — representative scaffold until Firestore collection is populated
// All displayed as SCAFFOLD-grade data; labeled accordingly
// ---------------------------------------------------------------------------

const SEED_JOBS: Omit<JobListing, 'created_at' | 'updated_at'>[] = [
  {
    job_id: 'job-001',
    org_id: 'org-ovs-global',
    creator_arc_id: 'arc-director-001',
    job_type: 'inspection',
    title: 'Commercial Rooftop Thermal Inspection — Block 7 Complex',
    description:
      'Comprehensive thermal and structural inspection of a 14-unit commercial roof assembly. Inspector must hold current LARI-VISION thermal certification.',
    location: { name: 'Houston, TX', lat: 29.76, lng: -95.37, address: '400 Industrial Blvd', jurisdiction_code: 'TX-HOU' },
    coverage_radius_km: 40,
    required_capabilities: ['LARI-VISION Thermal', 'Structural Assessment'],
    required_credentials: ['CI-THERMAL-L2', 'OSHA-30'],
    schedule_window: { starts_at: '2026-04-01T08:00:00Z', ends_at: '2026-04-01T17:00:00Z', flexible: false },
    payout_terms: { gross_amount: 1200, currency: 'USD', payout_model: 'flat', hold_period_days: 3 },
    platform_fee_model: { fee_type: 'percentage', fee_value: 10, disclosed_to_agent: true },
    status: 'live',
    review_flags: [],
    urgency_level: 'standard',
  },
  {
    job_id: 'job-002',
    org_id: 'org-ovs-global',
    creator_arc_id: 'arc-director-001',
    job_type: 'drone_operation',
    title: 'LiDAR Mapping Survey — Industrial Corridor Section 9',
    description:
      'High-resolution LiDAR corridor survey for a 2.3km industrial access road. Must include post-processing deliverable in LAS 1.4 format.',
    location: { name: 'Dallas, TX', lat: 32.78, lng: -96.8, address: 'Section 9, Industrial Ring', jurisdiction_code: 'TX-DAL' },
    coverage_radius_km: 60,
    required_capabilities: ['LiDAR Mapping', 'Post-Processing'],
    required_credentials: ['FAA-Part-107', 'LARI-G-DRONE'],
    schedule_window: { starts_at: '2026-04-05T07:00:00Z', ends_at: '2026-04-05T16:00:00Z', flexible: true },
    payout_terms: { gross_amount: 2800, currency: 'USD', payout_model: 'flat', hold_period_days: 5 },
    platform_fee_model: { fee_type: 'percentage', fee_value: 10, disclosed_to_agent: true },
    status: 'live',
    review_flags: [],
    urgency_level: 'elevated',
  },
  {
    job_id: 'job-003',
    org_id: 'org-ovs-global',
    creator_arc_id: 'arc-director-001',
    job_type: 'forensic_capture',
    title: 'Forensic Evidence Documentation — Site Alpha',
    description:
      'Scene documentation and forensic asset capture for regulatory compliance submission. Strict chain of custody required.',
    location: { name: 'Austin, TX', lat: 30.27, lng: -97.74, address: 'Classified — assigned upon acceptance', jurisdiction_code: 'TX-AUS' },
    coverage_radius_km: 30,
    required_capabilities: ['Forensic Documentation', 'Chain of Custody'],
    required_credentials: ['FORENSIC-CERT-L3', 'CI-CHAIN'],
    schedule_window: { starts_at: '2026-04-03T09:00:00Z', ends_at: '2026-04-03T18:00:00Z', flexible: false },
    payout_terms: { gross_amount: 3500, currency: 'USD', payout_model: 'flat', hold_period_days: 7 },
    platform_fee_model: { fee_type: 'percentage', fee_value: 8, disclosed_to_agent: true },
    status: 'review_required',
    review_flags: ['security_clearance_check'],
    urgency_level: 'critical',
  },
  {
    job_id: 'job-004',
    org_id: 'org-ovs-field',
    creator_arc_id: 'arc-dispatch-001',
    job_type: 'environmental_survey',
    title: 'Environmental Baseline Survey — Wetland Zone B',
    description:
      'Field survey of designated wetland area for regulatory environmental impact baseline. Requires EPA-certified field assessor.',
    location: { name: 'New Orleans, LA', lat: 29.95, lng: -90.07, address: 'Wetland Zone B, Jefferson Parish', jurisdiction_code: 'LA-JEF' },
    coverage_radius_km: 25,
    required_capabilities: ['Environmental Assessment', 'GIS Documentation'],
    required_credentials: ['EPA-FIELD-CERT', 'NEPA-COMPLIANCE'],
    schedule_window: { starts_at: '2026-04-08T06:30:00Z', ends_at: '2026-04-08T15:00:00Z', flexible: true },
    payout_terms: { gross_amount: 1850, currency: 'USD', payout_model: 'flat', hold_period_days: 3 },
    platform_fee_model: { fee_type: 'percentage', fee_value: 10, disclosed_to_agent: true },
    status: 'offered',
    review_flags: [],
    urgency_level: 'standard',
  },
];

// ---------------------------------------------------------------------------
// Status badge mapping for FieldMarketStatus
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<FieldMarketStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground border-border', icon: <CircleDot className="h-3 w-3" /> },
  review_required: { label: 'Review Required', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
  live: { label: 'Live', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: <CheckCircle2 className="h-3 w-3" /> },
  partial: { label: 'Partial', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: <CircleDot className="h-3 w-3" /> },
  offered: { label: 'Offered', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: <Zap className="h-3 w-3" /> },
  accepted: { label: 'Accepted', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30', icon: <CheckCircle2 className="h-3 w-3" /> },
  assigned: { label: 'Assigned', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: <Users className="h-3 w-3" /> },
  in_progress: { label: 'In Progress', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
  completed: { label: 'Completed', color: 'bg-green-700/10 text-green-500 border-green-700/30', icon: <CheckCircle2 className="h-3 w-3" /> },
  under_review: { label: 'Under Review', color: 'bg-amber-700/10 text-amber-500 border-amber-700/30', icon: <AlertTriangle className="h-3 w-3" /> },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border', icon: <CircleDot className="h-3 w-3" /> },
  blocked: { label: 'Blocked', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: <AlertTriangle className="h-3 w-3" /> },
  archived: { label: 'Archived', color: 'bg-muted/50 text-muted-foreground border-border/50', icon: <CircleDot className="h-3 w-3" /> },
};

const URGENCY_CONFIG = {
  standard: { label: 'Standard', color: 'text-muted-foreground' },
  elevated: { label: 'Elevated', color: 'text-amber-400' },
  critical: { label: 'Critical', color: 'text-red-400' },
};

const JOB_TYPE_LABELS: Record<FieldJobType, string> = {
  inspection: 'Inspection',
  drone_operation: 'Drone Operation',
  environmental_survey: 'Environmental Survey',
  forensic_capture: 'Forensic Capture',
  thermal_lidar_mapping: 'Thermal / LiDAR Mapping',
  specialized_contractor: 'Specialized Contractor',
  specialist_engineer_support: 'Engineer Support',
  other: 'Other',
};

// ---------------------------------------------------------------------------
// Component: Job Listing Card
// ---------------------------------------------------------------------------

function JobCard({ job }: { job: Omit<JobListing, 'created_at' | 'updated_at'> }) {
  const status = STATUS_CONFIG[job.status];
  const urgency = URGENCY_CONFIG[job.urgency_level];
  const netPayout = job.payout_terms.gross_amount * (1 - job.platform_fee_model.fee_value / 100);
  const canAct = job.status === 'live' || job.status === 'offered';

  return (
    <Card className="bg-card/50 border-border/60 flex flex-col transition-all hover:bg-card/70 hover:border-primary/20 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
            {JOB_TYPE_LABELS[job.job_type]}
          </Badge>
          <div className={cn(
            'flex items-center gap-1 text-[10px] font-mono border rounded px-1.5 py-0.5 shrink-0',
            status.color
          )}>
            {status.icon}
            <span>{status.label}</span>
          </div>
        </div>
        <CardTitle className="text-base leading-tight">{job.title}</CardTitle>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{job.location.name}</span>
          </div>
          <div className={cn('flex items-center gap-1 text-[10px] font-semibold', urgency.color)}>
            <Zap className="h-3 w-3" />
            <span>{urgency.label}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(job.schedule_window.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          {job.schedule_window.flexible && <span className="text-primary/70 ml-1">· Flexible</span>}
        </div>

        <div className="flex flex-wrap gap-1">
          {job.required_credentials.map((cred) => (
            <span key={cred} className="flex items-center gap-1 text-[9px] bg-primary/5 text-primary/70 border border-primary/15 rounded px-1.5 py-0.5">
              <Shield className="h-2.5 w-2.5" />
              {cred}
            </span>
          ))}
        </div>

        {/* Payout display — fee disclosed per platform_fee_model.disclosed_to_agent */}
        <div className="bg-muted/30 rounded-md p-2 border border-border/40">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Gross
            </span>
            <span className="font-mono">${job.payout_terms.gross_amount.toLocaleString()} {job.payout_terms.currency}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Platform ({job.platform_fee_model.fee_value}%)</span>
            <span className="font-mono text-red-400/70">−${(job.payout_terms.gross_amount * job.platform_fee_model.fee_value / 100).toFixed(0)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-muted-foreground">Est. Net</span>
            <span className="font-mono text-green-400">${netPayout.toFixed(0)} {job.payout_terms.currency}</span>
          </div>
          {job.payout_terms.hold_period_days && (
            <p className="text-[9px] text-muted-foreground/60 mt-1">
              Hold period: {job.payout_terms.hold_period_days}d after completion. Release subject to platform conditions.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-border/40 py-3 mt-auto gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
          <ChevronRight className="h-3.5 w-3.5 mr-1" /> View Details
        </Button>
        {canAct && (
          <Button size="sm" className="flex-1 h-8 text-xs" disabled={job.status === 'offered'}>
            {job.status === 'offered' ? 'Respond to Offer' : 'Express Interest'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Component: Reputation Context Panel
// ---------------------------------------------------------------------------

function ReputationPanel() {
  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" /> Field Compliance Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-[11px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-mono text-green-400">— %</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg Response</span>
            <span className="font-mono">— hrs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Verified Reviews</span>
            <span className="font-mono">—</span>
          </div>
        </div>
        <Separator />
        <p className="text-[10px] text-muted-foreground/70">
          Reputation data populates after verified job completions. Signals remain reviewable and auditable.
        </p>
        <div className="flex items-center justify-between font-mono text-[9px] opacity-60">
          <span>BANE_GATE_STATUS:</span>
          <span className="text-primary">ACTIVE</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FieldMarketPage() {
  const [jobs, setJobs] = useState<typeof SEED_JOBS>(SEED_JOBS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FieldMarketStatus | 'all'>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Field Market"
          status="partial"
          description="The Field Market is the OVERSCITE Global labor and dispatch exchange for certified field agents, operators, and specialized contractors. Opportunities range from thermal inspections and LiDAR mapping to forensic capture and environmental surveys. All dispatch actions are BANE-gated and require credentialed agent eligibility. Offer acceptance and payout release are server-authoritative and governed at every state transition."
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80 border border-amber-500/20 bg-amber-500/5 rounded px-2 py-1">
                <AlertTriangle className="h-3 w-3" /> SCAFFOLD — Dispatch binding: Cloud Function
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Briefcase className="h-3.5 w-3.5" /> Post Job
              </Button>
            </div>
          }
        />

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, location, type..."
              className="pl-9 bg-card/40 border-border/50 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'live', 'offered', 'review_required'] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                className="h-9 text-xs capitalize"
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label ?? s}
              </Button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="space-y-4">
            {/* Scaffold disclosure */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/30 border border-border/40 rounded-md px-3 py-2">
              <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400/70" />
              <span>
                <span className="font-semibold text-amber-400/80">Scaffold feed active.</span>
                {' '}Displaying representative seed jobs. Live Firestore data requires{' '}
                <code className="text-[10px] bg-muted/50 px-1 rounded">market_jobs</code> collection population.
              </span>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="text-sm">Loading opportunity feed...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-muted-foreground">
                <Briefcase className="h-10 w-10 mb-4 opacity-40" />
                <p className="text-sm">No opportunities match current filters.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredJobs.map((job) => (
                  <JobCard key={job.job_id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="sticky top-24 space-y-4">
            <ReputationPanel />

            <Card className="bg-card/40 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Coverage Context
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground space-y-2">
                <p>Geo-filtered opportunity discovery and territory mapping will populate as agent profiles and coverage data is registered.</p>
                <div className="flex items-center justify-between font-mono text-[9px] opacity-60 mt-3">
                  <span>PLANE:</span><span>FIELD_MARKET</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[9px] opacity-60">
                  <span>TRUST_CLASS:</span><span>LABOR_EXCHANGE</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
