"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Command,
  List,
  Activity,
  Layers,
  MapPin,
  Files,
  AlertTriangle,
  Siren,
  FileText,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { TruthStateBadge } from "@/components/layout/TruthStateBadge";

import { getInspections } from "@/lib/services/canonical-provider";
import { Inspection } from "@/lib/types";
import { EvidenceLane } from "@/components/inspections/evidence-lane";
import { AuditTrailLane } from "@/components/inspections/audit-trail-lane";
import { 
  CommandLane, 
  ActiveLane, 
  TypesLane, 
  SitesLane, 
  HazardsLane, 
  IncidentsLane, 
  ReportsLane 
} from "@/components/inspections/secondary-lanes";

import {
  INSPECTION_SHELL_LANES,
  InspectionShellLane,
  SHELL_LANE_LABELS,
  INSPECTION_DOMAIN_CLASSES,
  InspectionDomainClass,
  DOMAIN_MODE_LABELS,
} from "@/lib/constants/recognition-truth-states";
import { cn } from "@/lib/utils";

// Map lanes to icons for the navigation rail
const LANE_ICONS: Record<InspectionShellLane, React.ElementType> = {
  command: Command,
  queue: List,
  active: Activity,
  types: Layers,
  sites: MapPin,
  evidence: Files,
  hazards: AlertTriangle,
  incidents: Siren,
  reports: FileText,
  audit: ShieldAlert,
};

function QueueLaneView() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getInspections();
      setInspections(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase pt-1">Inspection Queue</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-border/30">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Date</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inspector</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Status</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1 border-border/30">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/inspections/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Start Inspection</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border border-border/20 bg-card/10 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20 border-b border-border/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Title</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground hidden md:table-cell">Inspector</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground hidden md:table-cell">Date</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Activity className="h-5 w-5 animate-pulse text-muted-foreground/50" />
                    Loading canonical queue data...
                  </div>
                </TableCell>
              </TableRow>
            ) : inspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No canonical inspections found in workflow queue.
                </TableCell>
              </TableRow>
            ) : (
              inspections.map((inspection) => (
                <TableRow key={inspection.id} className="cursor-pointer hover:bg-accent/5 transition-colors border-border/5 text-sm">
                  <TableCell className="font-medium align-top py-4">
                    <Link href={`/inspections/${inspection.id}`} className="hover:underline hover:text-primary transition-colors text-foreground block mb-0.5">
                      {inspection.title}
                    </Link>
                    <div className="text-xs text-muted-foreground/70 font-mono tracking-tight">{inspection.propertyAddress}</div>
                  </TableCell>
                  <TableCell className="align-top py-4">
                    <TruthStateBadge state={inspection.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell align-top py-4 text-muted-foreground">
                    {inspection.inspectorName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell align-top py-4 text-muted-foreground/80 tabular-nums">
                    {String(inspection.date)}
                  </TableCell>
                  <TableCell className="align-top py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/5">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-border/30 shadow-xl bg-background/95 backdrop-blur-md">
                        <DropdownMenuLabel className="text-xs font-black tracking-widest text-muted-foreground uppercase">Target Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer font-medium text-xs"><Link href={`/inspections/${inspection.id}`}>View Sovereignty Details</Link></DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium text-xs">Ammend Record</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium text-xs">Generate Artifact</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/20" />
                        <DropdownMenuItem className="text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 cursor-pointer font-bold text-xs uppercase tracking-wider">
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


export default function InspectionsShell() {
  const [activeLane, setActiveLane] = useState<InspectionShellLane>('queue');
  const [activeDomain, setActiveDomain] = useState<InspectionDomainClass>('indeterminate');
  const [inspectionId, setInspectionId] = useState<string | null>('insp_001');

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pb-8">
      {/* Doctrine-compliant Ultra-grade Header */}
      <PageHeader 
        title="Field Inspections Command" 
        status="live"
        guidanceId="inspections"
        description="Global field intelligence, evidence verification, and hazard documentation under strict BANE enforcement."
        className="mb-6 border-b border-border/10 pb-6"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/50 mb-0.5">Domain Mode</span>
              <span className="flex items-center">
                {activeDomain !== 'indeterminate' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                )}
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  {activeDomain === 'indeterminate' ? 'AWAITING BINDING' : 'LOCKED'}
                </span>
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-10 gap-2 border-border/30 bg-background/50 font-semibold min-w-[160px] justify-between shadow-sm transition-all",
                    activeDomain !== 'indeterminate' && "border-emerald-500/30 text-emerald-100 bg-emerald-950/20"
                  )}
                >
                  <span className="truncate">{DOMAIN_MODE_LABELS[activeDomain]}</span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] border-border/30 shadow-xl bg-background/95 backdrop-blur-md">
                <DropdownMenuLabel className="text-xs font-black tracking-widest text-muted-foreground uppercase">Select Engine Class</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuRadioGroup value={activeDomain} onValueChange={(v) => setActiveDomain(v as InspectionDomainClass)}>
                  {INSPECTION_DOMAIN_CLASSES.map((domain) => (
                    <DropdownMenuRadioItem 
                      key={domain} 
                      value={domain}
                      className="cursor-pointer text-sm font-medium"
                    >
                      {DOMAIN_MODE_LABELS[domain]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      
      {/* 10-Lane Scaffold */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Canonical Lanes Sidebar / Context Rail */}
        <div className="w-full lg:w-48 xl:w-56 shrink-0 lg:border-r border-border/10 lg:pr-4 flex flex-col pt-1">
          <div className="px-3 pb-3">
            <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/40">Operation Vector</span>
          </div>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 hide-scrollbar px-1 lg:px-0">
            {INSPECTION_SHELL_LANES.map(lane => {
              const Icon = LANE_ICONS[lane];
              const isActive = activeLane === lane;
              return (
                <button
                  key={lane}
                  onClick={() => setActiveLane(lane)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 w-full shrink-0 lg:shrink",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]" 
                      : "text-muted-foreground/80 hover:bg-muted/40 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-50")} />
                  {SHELL_LANE_LABELS[lane]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Work Region */}
        <div className="flex-1 min-w-0 bg-transparent lg:bg-card/5 lg:border border-border/10 rounded-xl relative overflow-hidden flex flex-col">
          <div className="flex-1 lg:p-6 p-1 overflow-x-hidden">
            {activeLane === 'queue' && <QueueLaneView />}
            {activeLane === 'audit' && <AuditTrailLane auditState={{ status: 'idle', entries: [], lastUpdated: null, error: null }} />}
            {activeLane === 'command' && <CommandLane />}
            {activeLane === 'active' && <ActiveLane />}
            {activeLane === 'types' && <TypesLane />}
            {activeLane === 'sites' && <SitesLane />}
            {activeLane === 'hazards' && <HazardsLane />}
            {activeLane === 'incidents' && <IncidentsLane />}
            {activeLane === 'reports' && <ReportsLane />}
          </div>
        </div>
      </div>
    </div>
  );
}
