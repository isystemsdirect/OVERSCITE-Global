"use client";

import React from "react";
import { Activity, Command, Layers, MapPin, AlertTriangle, Siren, FileText, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollectionData } from "@/lib/hooks/use-collection-data";

/**
 * Secondary Lane Hydration
 * Implements the remaining canonical lanes for SCINGULAR Inspections.
 */

// ---------------------------------------------------------------------------
// Reusable Lane Wrapper
// ---------------------------------------------------------------------------
function LaneContainer({ title, icon: Icon, colorClass, children, loading }: { title: string, icon: React.ElementType, colorClass: string, children: React.ReactNode, loading?: boolean }) {
  return (
    <div className={cn("flex flex-col h-full min-h-[500px] border border-border/10 rounded-xl bg-card/5 backdrop-blur-sm overflow-hidden", colorClass)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 opacity-70" />
          <span className="text-xs font-black tracking-widest uppercase opacity-80">{title}</span>
        </div>
        {loading && <Loader2 className="h-3 w-3 animate-spin opacity-50" />}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Command Lane
// ---------------------------------------------------------------------------
export function CommandLane() {
  const { data: assignments, loading } = useCollectionData('inspections'); // Using inspections as assignments for now

  return (
    <LaneContainer title="Command" icon={Command} colorClass="text-zinc-200" loading={loading}>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/20 border border-white/5 p-4 rounded-lg text-center flex flex-col justify-center">
          <div className="text-3xl font-black">{assignments?.length || 0}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-60">Active Field Dispatches</div>
        </div>
        <div className="bg-black/20 border border-white/5 p-4 rounded-lg text-center flex flex-col justify-center text-emerald-400">
          <div className="text-3xl font-black">Stable</div>
          <div className="text-[10px] uppercase tracking-widest opacity-60">Fleet Posture</div>
        </div>
      </div>
      
      <div className="text-[10px] uppercase tracking-widest opacity-40 mb-2 pl-1 border-l border-white/20">Quick Dispatch Actions</div>
      <div className="space-y-2">
        <button className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 border border-primary/20 p-3 rounded text-left transition-colors">
          <span className="text-xs font-bold uppercase tracking-wide">Initiate SiteOps Recon</span>
          <ArrowRight className="h-3 w-3 opacity-50" />
        </button>
        <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded text-left transition-colors">
          <span className="text-xs font-bold uppercase tracking-wide">Scramble Drone Unit</span>
          <ArrowRight className="h-3 w-3 opacity-50" />
        </button>
      </div>
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 2. Active Lane
// ---------------------------------------------------------------------------
export function ActiveLane() {
  const { data: activeInspections, loading } = useCollectionData('inspections');
  
  return (
    <LaneContainer title="Active" icon={Activity} colorClass="text-blue-200" loading={loading}>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4 mb-4 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <div className="text-xs font-mono tracking-widest uppercase">Live Field Capture Link Active</div>
      </div>
      
      {activeInspections.length === 0 && !loading && (
        <div className="p-8 text-center opacity-40 text-xs font-mono">No active captures.</div>
      )}
      
      <div className="space-y-3">
        {activeInspections.map((insp: any) => (
          <div key={insp.id} className="bg-black/30 border border-white/5 p-3 rounded pb-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-600/50 to-transparent"></div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs opacity-70">Capture ID: {insp.id.substring(0, 8)}</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded uppercase tracking-wider">In Progress</span>
            </div>
          </div>
        ))}
      </div>
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 3. Types Catalog Lane
// ---------------------------------------------------------------------------
export function TypesLane() {
  const { data: types, loading } = useCollectionData('inspection_types');
  return (
    <LaneContainer title="Types" icon={Layers} colorClass="text-indigo-200" loading={loading}>
       <div className="flex border-b border-white/10 pb-2 mb-3">
         <div className="text-xs uppercase tracking-widest opacity-50 flex-1">Domain Class</div>
         <div className="text-xs uppercase tracking-widest opacity-50 w-20 text-right">Governed</div>
       </div>
       <div className="space-y-2">
         {types.length === 0 && !loading ? (
           <div className="flex justify-between p-3 bg-black/20 rounded border border-white/5">
             <span className="text-sm">Industrial SiteOps</span>
             <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">Yes</span>
           </div>
         ) : types.map((t: any) => (
           <div key={t.id} className="flex justify-between p-3 bg-black/20 rounded border border-white/5">
             <span className="text-sm">{t.name || t.id}</span>
           </div>
         ))}
       </div>
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 4. Sites Registry Lane
// ---------------------------------------------------------------------------
export function SitesLane() {
  const { data: sites, loading } = useCollectionData('sites');
  return (
    <LaneContainer title="Sites" icon={MapPin} colorClass="text-emerald-200" loading={loading}>
      {sites.length === 0 && !loading && (
        <div className="text-center py-6">
          <MapPin className="h-6 w-6 opacity-20 mx-auto mb-2" />
          <div className="text-xs font-mono opacity-40">Registry initialized, no sites mapped</div>
        </div>
      )}
      <div className="space-y-2">
        {sites.map((site: any) => (
          <div key={site.id} className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded">
            <div className="font-bold text-sm mb-1">{site.name || 'Unnamed Asset'}</div>
            <div className="text-xs font-mono opacity-60 truncate">{site.id}</div>
          </div>
        ))}
      </div>
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 5. Hazards Registry Lane
// ---------------------------------------------------------------------------
export function HazardsLane() {
  const { data: hazards, loading } = useCollectionData('hazards');
  return (
    <LaneContainer title="Hazards" icon={AlertTriangle} colorClass="text-amber-200" loading={loading}>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-center">
          <div className="text-xs text-red-400 uppercase tracking-wider font-bold">Critical</div>
          <div className="text-xl font-black text-red-200">0</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-center">
          <div className="text-xs text-amber-400 uppercase tracking-wider font-bold">Warning</div>
          <div className="text-xl font-black text-amber-200">0</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded text-center">
          <div className="text-xs text-blue-400 uppercase tracking-wider font-bold">Monitored</div>
          <div className="text-xl font-black text-blue-200">{hazards.length}</div>
        </div>
      </div>
      
      {hazards.map((h: any) => (
        <div key={h.id} className="text-sm p-3 border-l-2 border-amber-500 bg-white/5 mb-2">
          {h.description || h.id}
        </div>
      ))}
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 6. Incidents Lane
// ---------------------------------------------------------------------------
export function IncidentsLane() {
  const { data: incidents, loading } = useCollectionData('incidents');
  return (
    <LaneContainer title="Incidents" icon={Siren} colorClass="text-rose-200" loading={loading}>
      {incidents.length === 0 && !loading && (
        <div className="text-center py-6 text-xs font-mono opacity-40">No active incidents</div>
      )}
      {incidents.map((inc: any) => (
        <div key={inc.id} className="bg-rose-500/10 border border-rose-500/20 p-3 rounded mb-2">
           <div className="text-xs font-bold text-rose-300 uppercase mb-1">INCIDENT TRACK: {inc.id.substring(0,8)}</div>
           <div className="text-xs opacity-70">Awaiting field documentation.</div>
        </div>
      ))}
    </LaneContainer>
  );
}

// ---------------------------------------------------------------------------
// 7. Reports Lane
// ---------------------------------------------------------------------------
export function ReportsLane() {
  const { data: reports, loading } = useCollectionData('reports');
  return (
    <LaneContainer title="Reports" icon={FileText} colorClass="text-violet-200" loading={loading}>
      {reports.length === 0 && !loading && (
        <div className="text-center py-6 opacity-40 text-xs font-mono">No reports generated</div>
      )}
      {reports.map((rep: any) => (
        <div key={rep.id} className="flex justify-between items-center p-3 border-b border-white/10 last:border-0 hover:bg-white/5 rounded transition-colors">
          <div>
            <div className="text-sm font-medium">{rep.title || 'Draft Report'}</div>
            <div className="text-xs opacity-50 font-mono tracking-widest">{rep.id.substring(0,6)}</div>
          </div>
          <div className="text-[10px] px-2 py-1 bg-violet-500/20 text-violet-300 rounded uppercase tracking-wider">
            {rep.status || 'Draft'}
          </div>
        </div>
      ))}
    </LaneContainer>
  );
}
