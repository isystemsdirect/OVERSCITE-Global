"use client";

import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Settings,
  Cpu,
  Monitor
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { useScingularRuntime } from '@/context/ScingularRuntimeContext';
import SCINGULARDroneVisionUI from '@/components/drone/OversciteDroneVisionUI';
import { ScimegaCommandSurface } from '@/components/scimega/ScimegaCommandSurface';
import { evaluateWorkstationAccess } from '@/lib/scimega/workstation/bane-workstation-access-gate';
import { WorkstationLockoutSurface } from '@/components/scimega/workstation/WorkstationLockoutSurface';
import { FlightSafeCalibrationSurface } from '@/components/scimega/workstation/FlightSafeCalibrationSurface';
import { SCIMEGADomain } from '@/lib/scimega/uix/scimega-uix-state';
import { cn } from '@/lib/utils';
import { FLIGHT_SAFE_MODULES } from '@/lib/scimega/workstation/flight-safe-calibration-whitelist';

/**
 * @fileOverview XSCITE™ Controller UI
 * @authority Director
 * @purpose Unified operator interface containing Flight Control and SCIMEGA™ Workstation.
 */

export function XsciteControllerUI() {
  const { flightMode, currentOperatorRole, isArmed } = useLiveFlight();
  const { state: runtimeState } = useScingularRuntime();
  
  const [activeTab, setActiveTab] = useState('flight');
  const [activeWorkstationDomain, setActiveWorkstationDomain] = useState<SCIMEGADomain>('diagnostics');
  const [activeCalibrationModule, setActiveCalibrationModule] = useState('sensor_health_monitor');

  // Evaluate access gate
  const accessContext = useMemo(() => ({
    flightMode,
    operatorRole: currentOperatorRole,
    isArmed,
    // Add other context fields as they become available in LiveFlightContext
  }), [flightMode, currentOperatorRole, isArmed]);

  const workstationAccess = useMemo(() => 
    evaluateWorkstationAccess(activeWorkstationDomain, accessContext),
  [activeWorkstationDomain, accessContext]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Top Controller Navigation */}
      <div className="h-12 bg-black/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="text-xs font-black tracking-[0.3em] text-white">XSCITE™ CONTROLLER</span>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="bg-transparent h-full p-0 gap-4">
              <TabsTrigger 
                value="flight" 
                className={cn(
                  "h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white/5 px-4 text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === 'flight' ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Plane className="h-3.5 w-3.5 mr-2" />
                Flight Control
              </TabsTrigger>
              <TabsTrigger 
                value="workstation" 
                className={cn(
                  "h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white/5 px-4 text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === 'workstation' ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Monitor className="h-3.5 w-3.5 mr-2" />
                SCIMEGA™ Workstation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isArmed ? "bg-red-500" : "bg-emerald-500")} />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
              {isArmed ? 'Live Flight' : 'Standby'}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase">{flightMode}</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        <Tabs value={activeTab} className="h-full w-full">
          <TabsContent value="flight" className="h-full w-full p-0 m-0 border-none">
            <SCINGULARDroneVisionUI />
          </TabsContent>
          
          <TabsContent value="workstation" className="h-full w-full p-0 m-0 border-none">
            {workstationAccess.status === 'FULL_ACCESS' ? (
              <ScimegaCommandSurface 
                activeDomain={activeWorkstationDomain}
                onDomainChange={setActiveWorkstationDomain}
                systemStatus="NOMINAL"
                phase="OPERATIONAL"
                authority={{
                  scing: true,
                  iu: true,
                  bane: true,
                  teon: true,
                  arc: true
                }}
                dominantAuthority="SCIMEGA_ALPHA"
                scingAdvisory={{
                  statement: "Workstation authority fully synchronized.",
                  interpretation: "Full mutation and build capabilities available."
                }}
                isWorkstationLocked={workstationAccess.status === 'LOCKED' || workstationAccess.status === 'BLOCKED'}
                authorityFlowEvents={[]}
                authorityDetails={{
                  scingStatus: "SYNC",
                  iuBinding: "LOCAL",
                  archivalStatus: "READY",
                  baneGates: [{ label: 'WORKSTATION_ACCESS', status: 'APPROVED' }],
                  teonStack: [{ label: 'UI_RENDER_PRIORITY', active: true }],
                  arcSignature: "VERIFIED"
                }}
                events={[]}
              >
                <div className="h-full flex items-center justify-center border border-white/10 rounded-xl bg-white/5">
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">
                    [ Module: {activeWorkstationDomain} ]
                  </span>
                </div>
              </ScimegaCommandSurface>
            ) : workstationAccess.status === 'CALIBRATION_ONLY' ? (
              <div className="h-full p-6 bg-[#050505] overflow-hidden flex gap-6">
                <div className="flex-1 overflow-hidden">
                  <FlightSafeCalibrationSurface 
                    activeModule={{
                      id: activeCalibrationModule,
                      domain: 'diagnostics',
                      label: activeCalibrationModule.replace(/_/g, ' ').toUpperCase(),
                      isFlightSafe: true
                    }}
                    onModuleChange={setActiveCalibrationModule}
                    availableModules={FLIGHT_SAFE_MODULES.map(id => ({
                      id,
                      domain: 'diagnostics',
                      label: id.replace(/_/g, ' ').toUpperCase(),
                      isFlightSafe: true
                    }))}
                    pilotAuthority={currentOperatorRole}
                    baneStatus="ADVISORY_ONLY"
                    teonStatus="LIVE_ENVELOPE_LOCK"
                  />
                </div>
                <div className="w-80 flex flex-col gap-6">
                  <ScimegaScingPresencePanel 
                    advisory={{
                      statement: "Calibration surface authorized.",
                      interpretation: "Non-disruptive diagnostics only."
                    }}
                    systemStatus="CALIBRATION"
                    isWorkstationLocked={true}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full p-6 bg-[#050505]">
                <WorkstationLockoutSurface 
                  accessReason={workstationAccess}
                  availableModules={FLIGHT_SAFE_MODULES}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
