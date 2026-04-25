"use client";

import React, { useEffect, useState } from "react";
import { 
  Plane, Activity, Video, Settings, AlertTriangle, Battery, Radar, Wifi, 
  Map, Crosshair, Thermometer, Layers, Zap, Waves, History, Scan, 
  Camera, Eye, ShieldCheck, ShieldAlert, FilePlus, StickyNote, Copy, 
  Trash2, Plus, ZoomIn, ZoomOut, RotateCcw, Grid, Sun, ChevronRight, Maximize2, XCircle, Info, Cpu, ArrowRightLeft
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLiveFlight } from "@/context/LiveFlightContext";
import { useScingularRuntime } from "@/context/ScingularRuntimeContext";
import { useShellLayout } from "@/lib/layout/shell-layout-state";
import { useArcIdentity } from "@/lib/auth/ArcIdentityContext";
import { MissionLogger } from "@/lib/runtime/services/MissionLogger";
import { RestrictedFlightSidebar } from "./RestrictedFlightSidebar";
import { LiveFlightMap } from "./LiveFlightMap";
import { UnifiedPostureIdentityCard } from "./UnifiedPostureIdentityCard";
import { XSCITEArmModule } from "./XSCITEArmModule";
import { XSCITEModeSelector } from "./XSCITEModeSelector";
import { FlightPostureStateDisplay } from "./FlightPostureStateDisplay";
import { OverflightFailsafeBanner } from "./OverflightFailsafeBanner";
import { OverflightRestrictionBand } from "./OverflightRestrictionBand";
import { OverflightMissionStateBand } from "./OverflightMissionStateBand";
import { OverflightWaypointProgressModule } from "./OverflightWaypointProgressModule";
import { OverflightGeofenceProximityModule } from "./OverflightGeofenceProximityModule";
import { OverflightZoneRestrictionDisclosure } from "./OverflightZoneRestrictionDisclosure";
import { OverflightReturnAnchorModule } from "./OverflightReturnAnchorModule";
import { OverflightRouteDeviationIndicator } from "./OverflightRouteDeviationIndicator";
import { OverflightSupportSurfaceSyncStatus } from "./OverflightSupportSurfaceSyncStatus";
import { OverflightSynchronizedMapBridge } from "./OverflightSynchronizedMapBridge";
import { OverflightMissionAbortConfirmationRail } from "./OverflightMissionAbortConfirmationRail";
import { OverflightSurfaceAuthorityLabel } from "./OverflightSurfaceAuthorityLabel";
import { OperatorRoleSwitcher } from "./OperatorRoleSwitcher";
import { OverflightTelePortModule } from "./OverflightTelePortModule";


export default function OversciteDroneVisionUI() {
  const { 
    isArmed, flightMode, isConnected, 
    faultSeverity, setFaultSeverity,
    telemetryFreshness, setTelemetryFreshness,
    truthDivergence, setTruthDivergence,
    setConsequenceState,
    missionState, setMissionState,
    zoneContext, setZoneContext,
    routeIntegrity, setRouteIntegrity,
    syncIntegrity, setSyncIntegrity,
    setMissionData, trackWindow, activeSupportWindows,
    delegateAuthority, currentOperatorRole
  } = useLiveFlight();
  const { 
    state: runtimeState, switchDomain, setConnection, bindHardwareLayer
  } = useScingularRuntime();
  
  const { currentIdentity, loginAs, logout, getSignature } = useArcIdentity();

  const { isOverHUDOpen } = useShellLayout();
  const [activeMode, setActiveMode] = useState('flight');
  const [showStressController, setShowStressController] = useState(false);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#020406] text-white font-sans selection:bg-primary/30 relative">
      
      {/* ─── OverFLIGHT™ Failsafe Banner (Supreme Priority) ─── */}
      <OverflightFailsafeBanner />

      {/* ─── Phase 5 Sovereign Authority Disclosure ─── */}
      <OverflightSurfaceAuthorityLabel surfaceId="primary_cockpit" />

      {/* ─── Top-Level Control Overlay (Non-Instrument Shell) ─── */}
      {!isArmed && (
        <div className="absolute top-4 right-6 z-[60] flex items-center gap-4">
           <XSCITEArmModule />
        </div>
      )}

      {/* ─── OverFLIGHT™ Phase 4 Mission & Geo Layers ─── */}
      <OverflightMissionStateBand />
      <OverflightWaypointProgressModule />
      <OverflightGeofenceProximityModule />
      <OverflightZoneRestrictionDisclosure />
      <OverflightReturnAnchorModule />
      <OverflightRouteDeviationIndicator />
      <OverflightSupportSurfaceSyncStatus />
      <OverflightSynchronizedMapBridge />
      <OverflightMissionAbortConfirmationRail />

      {/* ─── Phase 3 Stress Controller (Dev Only) ─── */}
      <div className="absolute bottom-4 left-4 z-[70] flex flex-col gap-2">
         <button 
           id="stress-controller-toggle"
           onClick={() => setShowStressController(!showStressController)}
           className="bg-black/80 border border-white/20 p-2 rounded-full hover:bg-white/10 transition-all shadow-xl pointer-events-auto"
         >
           <Settings className={cn("h-4 w-4 text-white/40", showStressController && "text-primary animate-spin-slow")} />
         </button>
         
         {showStressController && (
           <div className="bg-black/90 border border-white/20 p-4 rounded-lg backdrop-blur-xl shadow-2xl flex flex-col gap-4 w-64 animate-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-primary">FAULT_SEVERITY_RAIL</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['advisory', 'caution', 'critical', 'failsafe'] as const).map(s => (
                       <button 
                         id={`stress-fault-${s}`}
                         key={s} 
                         onClick={() => setFaultSeverity(s)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           faultSeverity === s ? "bg-primary/20 border-primary/40 text-primary" : "border-white/5 text-white/40"
                         )}
                       >
                         {s}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-primary">TRUTH_DIVERGENCE_RAIL</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['aligned', 'minor_divergence', 'material_divergence', 'confidence_collapse'] as const).map(d => (
                       <button 
                         id={`stress-diverge-${d}`}
                         key={d} 
                         onClick={() => setTruthDivergence(d)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           truthDivergence === d ? "bg-primary/20 border-primary/40 text-primary" : "border-white/5 text-white/40"
                         )}
                       >
                         {d.split('_')[0]}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-primary">DATA_FRESHNESS</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['live', 'delayed', 'stale', 'unknown'] as const).map(f => (
                       <button 
                         id={`stress-fresh-${f}`}
                         key={f} 
                         onClick={() => setTelemetryFreshness(f)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           telemetryFreshness === f ? "bg-primary/20 border-primary/40 text-primary" : "border-white/5 text-white/40"
                         )}
                       >
                         {f}
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                id="stress-clear-consequence"
                onClick={() => setConsequenceState('idle')}
                className="text-[8px] font-black py-2 bg-white/5 border border-white/10 rounded uppercase hover:bg-white/10"
              >
                CLEAR_CONSEQUENCE_STATE
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* Phase 4 Controls */}
              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-blue-400">MISSION_STATE</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['not_loaded', 'loaded', 'staged', 'in_progress', 'abort_pending', 'completed'] as const).map(m => (
                       <button 
                         id={`stress-mission-${m}`}
                         key={m} 
                         onClick={() => {
                           setMissionState(m);
                           if (m === 'loaded' || m === 'staged' || m === 'in_progress') {
                             setMissionData({
                               id: 'OPER-8821',
                               name: 'FACADE_INTEGRITY_SCAN_V4',
                               currentWaypointIndex: 2,
                               waypoints: [
                                 { id: '1', name: 'ENTRY_POINT', distance: 0, eta: 0, status: 'passed' },
                                 { id: '2', name: 'NORTH_FACADE_L1', distance: 0, eta: 0, status: 'passed' },
                                 { id: '3', name: 'WEST_CORNER_STABILIZE', distance: 42, eta: 12, status: 'active' },
                                 { id: '4', name: 'EXIT_CORRIDOR', distance: 150, eta: 45, status: 'pending' }
                               ],
                               homeAnchor: { lat: 0, lng: 0, distance: 285 }
                             });
                           }
                         }}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           missionState === m ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/5 text-white/40"
                         )}
                       >
                         {m.replace('_', ' ')}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-blue-400">ZONE_CONTEXT</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['clear', 'approaching_boundary', 'inside_boundary', 'restricted_zone_near', 'restricted_zone_entered'] as const).map(z => (
                       <button 
                         id={`stress-zone-${z}`}
                         key={z} 
                         onClick={() => setZoneContext(z)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           zoneContext === z ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/5 text-white/40"
                         )}
                       >
                         {z.split('_')[0]}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-blue-400">ROUTE_INTEGRITY</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['on_path', 'minor_deviation', 'material_deviation'] as const).map(r => (
                       <button 
                         id={`stress-route-${r}`}
                         key={r} 
                         onClick={() => setRouteIntegrity(r)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           routeIntegrity === r ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/5 text-white/40"
                         )}
                       >
                         {r.replace('_', ' ')}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-blue-400">SYNC_INTEGRITY</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['aligned', 'lagging', 'stale', 'divergent'] as const).map(sy => (
                       <button 
                         id={`stress-sync-${sy}`}
                         key={sy} 
                         onClick={() => setSyncIntegrity(sy)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           syncIntegrity === sy ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/5 text-white/40"
                         )}
                       >
                         {sy}
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                id="stress-toggle-map"
                onClick={() => trackWindow('map_surface_01', !activeSupportWindows.includes('map_surface_01'))}
                className={cn(
                   "text-[8px] font-black py-2 border rounded uppercase transition-all",
                   activeSupportWindows.includes('map_surface_01') ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                TOGGLE_SYNC_MAP_SURFACE
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* Phase 5 Controls */}
              <OperatorRoleSwitcher />
              
              <div className="h-px bg-white/10 my-1" />
              
              <OverflightTelePortModule />

              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-primary">MAP_AUTHORITY_DELEGATION</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['DISPLAY_ONLY', 'ADVISORY', 'DELEGATED_CONTROL', 'BLOCKED'] as const).map(a => (
                       <button 
                         id={`stress-delegate-${a}`}
                         key={a} 
                         onClick={() => delegateAuthority('map_surface_01', a)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase",
                           "border-white/5 text-white/40 hover:bg-white/10"
                         )}
                       >
                         {a.replace('_', ' ')}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="h-px bg-white/10 my-1" />

              {/* Phase 6 Controls */}
              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-orange-400">OS_RUNTIME_DOMAIN</span>
                 <div className="grid grid-cols-3 gap-1">
                    {(['FLIGHT', 'INSPECTION', 'WIRM'] as const).map(d => (
                       <button 
                         id={`stress-domain-${d}`}
                         key={d} 
                         onClick={() => switchDomain(d)}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase transition-all",
                           runtimeState.domain === d ? "bg-orange-500/20 border-orange-500/40 text-orange-400" : "border-white/5 text-white/40 hover:bg-white/10"
                         )}
                       >
                         {d}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="h-px bg-white/10 my-1" />

              {/* Phase 8 Controls */}
              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-cyan-400">SIGNAL & INTEGRITY STRESS (HAL)</span>
                 <div className="grid grid-cols-2 gap-1">
                    {(['NONE', 'TELEMETRY_LOSS', 'COMMAND_DELAY', 'DATA_CORRUPTION'] as const).map(f => (
                       <button 
                         id={`stress-failure-${f}`}
                         key={f} 
                         onClick={() => {
                            if ((window as any).__SCINGULAR_ENGINE) {
                                (window as any).__SCINGULAR_ENGINE.hal.injectFailure(f);
                            }
                         }}
                         className={cn(
                           "text-[7px] font-black py-1 border rounded uppercase transition-all hover:bg-white/10 border-white/5 text-white/40"
                         )}
                       >
                         {f.replace('_', ' ')}
                       </button>
                    ))}
                 </div>
                 
                 <div className="mt-1">
                    <button 
                         id="stress-domain-collision"
                         onClick={() => {
                            // Rapid switching simulation
                            const domains = ['FLIGHT', 'INSPECTION', 'WIRM'] as const;
                            let ticks = 0;
                            const interval = setInterval(() => {
                               switchDomain(domains[ticks % 3]);
                               ticks++;
                               if (ticks > 15) clearInterval(interval); // Stop after 1.5 seconds of thrashing
                            }, 100);
                         }}
                         className={cn(
                           "w-full text-[7px] font-black py-1 border rounded uppercase transition-all bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                         )}
                       >
                         TRIGGER DOMAIN COLLISION TEST
                    </button>
                 </div>
              </div>

              <div className="h-px bg-white/10 my-1" />

              {/* Phase 9 Controls */}
              <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black tracking-widest text-green-400">PHASE 9 - DEPLOYMENT</span>
                 <div className="grid grid-cols-2 gap-1">
                    <button 
                         onClick={() => bindHardwareLayer(true)}
                         className="text-[7px] font-black py-1 border rounded uppercase transition-all hover:bg-white/10 border-white/5 text-white/40"
                    >
                         BIND PHYSICAL HAL
                    </button>
                    <button 
                         onClick={() => bindHardwareLayer(false)}
                         className="text-[7px] font-black py-1 border rounded uppercase transition-all hover:bg-white/10 border-white/5 text-white/40"
                    >
                         REVERT MOCK HAL
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-1 mt-1">
                    {!currentIdentity ? (
                        <button 
                            onClick={() => loginAs({
                                arcId: 'ARC-8921-X',
                                displayName: 'L. Anderson',
                                clearanceLevel: 5,
                                certifications: ['FLIGHT_SUPERVISOR', 'WIRM_OP'],
                                sessionToken: Math.random().toString(36).substring(2)
                            })}
                            className="col-span-2 text-[7px] font-black py-1 border rounded uppercase transition-all bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        >
                            ARC LOGIN (SIMULATED)
                        </button>
                    ) : (
                        <button 
                            onClick={logout}
                            className="col-span-2 text-[7px] font-black py-1 border rounded uppercase transition-all hover:bg-white/10 border-white/5 text-white/40"
                        >
                            LOGOUT ARC: {currentIdentity.arcId}
                        </button>
                    )}
                 </div>

                 <div className="mt-1">
                     <button 
                         onClick={() => {
                             const report = MissionLogger.generateMissionReport(runtimeState, currentIdentity);
                             MissionLogger.exportToOverscite(report);
                         }}
                         className="w-full text-[7px] font-black py-1 border rounded uppercase transition-all bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                     >
                         EXPORT OVERSCITE MISSION LOG
                     </button>
                 </div>
              </div>
           </div>
         )}
      </div>

      <OverflightRestrictionBand />

      {/* ─── Main Operational Cockpit ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        <RestrictedFlightSidebar />
        
        <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden w-full relative">
          
          {/* Left Instrument Cluster (XSCITE™ Authority Path) */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2 flex flex-col min-h-0 overflow-hidden gap-3 min-w-0 z-10">
            <FlightPostureStateDisplay />
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 flex flex-col gap-3">
               <XSCITEModeSelector />
               
               <div className="h-px bg-white/5" />
               
               <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">SAFETY_ENVELOPE</span>
                    <ShieldCheck className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="bg-white/5 p-1.5 rounded flex flex-col">
                        <span className="text-[6px] font-bold text-muted-foreground uppercase">CEILING</span>
                        <span className="text-[10px] font-mono font-bold text-primary">120M</span>
                     </div>
                     <div className="bg-white/5 p-1.5 rounded flex flex-col">
                        <span className="text-[6px] font-bold text-muted-foreground uppercase">FENCE</span>
                        <span className="text-[10px] font-mono font-bold text-green-500">ACTIVE</span>
                     </div>
                  </div>
               </div>
            </div>

            <LiveFlightMap className="h-[140px] rounded-lg border border-white/10 shrink-0" />
            
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 overflow-hidden">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-2">LARI_MONITOR</span>
                <div className="text-[8px] font-mono text-primary/60 uppercase animate-pulse leading-tight">
                   SCANNING LARI.VISION STREAM...<br/>
                   [NO ANOMALIES DETECTED]
                </div>
            </div>
          </div>

          {/* Center Column - Prime Flight Canvas */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col min-h-0 h-full relative">
             <DroneVisualCanvas activeMode={activeMode} />
          </div>

          {/* Right Instrument Cluster - Findings & Security */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col min-h-0 overflow-hidden gap-3 z-10">
            <DroneFindingsPanel activeMode={activeMode} />
            
            <BaneAuditDiagnosticPanel />
          </div>
        </div>
      </div>
    </div>
  );
}


function DroneVisualCanvas({ activeMode }: { activeMode: string }) {
  return (
    <div className="flex flex-col h-full border border-white/10 bg-black/80 backdrop-blur-xl relative overflow-hidden group rounded-lg">
      <div className="absolute top-4 left-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded border border-white/10 pointer-events-auto flex items-center gap-2 px-2 py-1 shadow-lg">
          <div className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em]">LIVE_FEED</span>
          </div>
          <span className="text-[7px] font-mono text-primary ml-2">4K_UHD_ENCRYPTED</span>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0a0f16] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale-[0.5] contrast-[1.2]"></div>
        
        {/* Synthetic HUD Overlay Elements */}
        <HUDCrosshair />
        
        {/* Tactical Control Module Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 pointer-events-auto">
          <div className="bg-black/90 backdrop-blur-3xl border border-white/20 rounded-lg px-4 py-2 flex items-center gap-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-all group">
                <Camera className="h-3.5 w-3.5 text-white/60 group-hover:text-white" />
                <span className="text-[9px] font-black text-white/60 group-hover:text-white uppercase tracking-widest">Capture_Evidence</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 hover:bg-primary/40 border border-primary/40 rounded transition-all group">
                <Scan className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Analyze_Scene</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HUDCrosshair() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
       <div className="relative w-80 h-80 border border-white/10 rounded-full flex items-center justify-center opacity-20">
          <div className="absolute w-[1px] h-6 bg-primary/40 top-0" />
          <div className="absolute w-[1px] h-6 bg-primary/40 bottom-0" />
          <div className="absolute w-6 h-[1px] bg-primary/40 left-0" />
          <div className="absolute w-6 h-[1px] bg-primary/40 right-0" />
          
          <div className="absolute top-1/4 left-1/4 w-4 h-4 border-t border-l border-primary/30" />
          <div className="absolute top-1/4 right-1/4 w-4 h-4 border-t border-r border-primary/30" />
          <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-b border-l border-primary/30" />
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-b border-r border-primary/30" />

          <div className="h-[1px] w-12 bg-primary/40" />
          <div className="w-[1px] h-12 bg-primary/40 absolute" />
          <div className="h-1.5 w-1.5 bg-primary/60 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
       </div>
    </div>
  );
}

function DroneFindingsPanel({ activeMode }: { activeMode: string }) {
  return (
    <div className="flex-1 flex flex-col border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden rounded-lg">
      <div className="py-2 px-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em]">OPERATIONAL_FINDINGS</span>
        </div>
        <Badge variant="outline" className="h-3.5 text-[7px] border-primary/30 text-primary">LIVE_AUDIT</Badge>
      </div>
      <div className="p-3 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-default relative overflow-hidden">
                <div className="flex justify-between items-center mb-1.5 relative z-10">
                    <span className="text-[9px] font-black text-primary tracking-widest">ANOMALY_DETECTED</span>
                    <span className="text-[7px] text-muted-foreground font-mono">14:32:01</span>
                </div>
                <p className="text-[10px] text-white/70 leading-relaxed relative z-10 font-medium italic">Major structural fissure detected on western facade. Proximity: 1.2m.</p>
                <div className="mt-2 flex gap-1.5 relative z-10">
                   <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[6px] font-black text-primary uppercase">FISSURE</div>
                   <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[6px] font-black text-white/40 uppercase">PRIORITY_HIGH</div>
                </div>
                {/* Tactical Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            </div>
            
            <div className="p-2.5 rounded bg-white/5 border border-white/5 opacity-50 relative overflow-hidden">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black text-muted-foreground tracking-widest">SCAN_COMPLETE</span>
                    <span className="text-[7px] text-muted-foreground font-mono">14:28:44</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Rooftop perimeter scan finalized. No obstructions found.</p>
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function BaneAuditDiagnosticPanel() {
  const { currentOperatorRole } = useLiveFlight();
  const { state: runtimeState } = useScingularRuntime();
  
  const isSupervisor = currentOperatorRole === 'SUPERVISOR';
  
  return (
    <div className="bg-black/60 backdrop-blur-md border border-red-500/20 rounded-lg overflow-hidden flex flex-col shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.05)] max-h-48">
       <div className="px-3 py-1.5 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between shrink-0">
           <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.3em]">BANE™ SECURITY_DOCK</span>
           <div className="flex items-center gap-2">
             {isSupervisor && <Badge variant="outline" className="h-3.5 text-[6px] border-red-500/30 text-red-400">SUPERVISOR_DIAGNOSTICS</Badge>}
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_5px_red]" />
           </div>
       </div>
       
       <div className="p-3 flex-1 overflow-hidden flex flex-col">
          {!isSupervisor ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground">
                 <span>ZTI_ENFORCEMENT</span>
                 <span className="text-red-400">ENCRYPTED</span>
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground">
                 <span>AUDIT_LINAGE</span>
                 <span className="text-white/60">STRATUM-1::VERIFIED</span>
              </div>
              <div className="mt-2 text-[7px] text-red-500/60 font-mono text-center uppercase">
                [ DIAGNOSTIC TRACE CLASSIFIED ]
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2">
               <div className="flex flex-col gap-2">
                  {runtimeState.baneAuditLog.length === 0 ? (
                    <div className="text-[7px] text-white/40 font-mono text-center py-2 uppercase">NO_AUDIT_EVENTS</div>
                  ) : (
                    runtimeState.baneAuditLog.map((log, i) => (
                      <div key={i} className={cn(
                        "p-2 rounded border border-white/5 bg-black/40 relative overflow-hidden",
                        log.permitted ? "border-l-green-500/50" : "border-l-red-500/50"
                      )}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[7px] font-black text-white/80 tracking-widest">{log.action}</span>
                          <span className="text-[6px] text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          <span className="text-[6px] px-1 bg-white/5 rounded text-white/60 uppercase">{log.triad.role}</span>
                          <span className="text-[6px] px-1 bg-white/5 rounded text-white/60 uppercase">{log.triad.surfaceClassification}</span>
                          <span className={cn(
                            "text-[6px] px-1 rounded uppercase font-bold",
                            log.permitted ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          )}>
                            {log.permitted ? 'PERMITTED' : `BLOCKED: ${log.reason}`}
                          </span>
                        </div>
                        <div className="text-[5px] font-mono text-muted-foreground uppercase break-all">
                          HASH: {log.baneComplianceHash}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </ScrollArea>
          )}
       </div>
    </div>
  );
}