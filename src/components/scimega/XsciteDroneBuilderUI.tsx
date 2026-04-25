"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  CheckCircle2, Box, Check, Circle, ShieldAlert, AlertTriangle, 
  Terminal, ScrollText, BookOpen, Eye, Archive, Network, 
  Crosshair, Radio, FileWarning, FileJson, Play, Pause, SkipBack, SkipForward, Power, Anchor,
  ShieldCheck, Activity, Lock
} from 'lucide-react';
import { SCIMEGADomain, SCIMEGAUIXState } from '@/lib/scimega/uix/scimega-uix-state';
import { SCIMEGAAuthorityLevel, SCIMEGAAuthorityFlowEvent } from '@/lib/scimega/uix/scimega-authority-flow-trace';
import { ScimegaCommandSurface } from './ScimegaCommandSurface';
import { cn } from '@/lib/utils';
import { SCIMEGA_STANDARDS_MAP } from '@/lib/lari/scimega/standards-map';
import { LariScimegaEngine } from '@/lib/lari/scimega/lari-scimega';
import { SCIMEGA_BUILD_CAPABILITIES } from '@/lib/scimega/capability-map';
import { evaluateMethodCompatibility } from '@/lib/scimega/method-compatibility';
import { getMethodPack } from '@/lib/inspections/methods/registry';
import { BaneDroneDeploymentGate } from '@/lib/scimega/bane-drone-deployment-gate';
import { ScimegaExportEngine } from '@/lib/scimega/export/scimega-export-engine';
import { BaneProposalSigningGate } from '@/lib/scimega/authorization/bane-proposal-signing-gate';
import { ScimegaTerminalEngine } from '@/lib/scimega/terminal/scimega-terminal-engine';
import type { SCIMEGAExportTarget } from '@/lib/scimega/export/scimega-export-types';
import { ScimegaSimulationLedger } from '@/lib/scimega/audit/scimega-simulation-ledger';
import { SCIMEGA_TRAINING_SCENARIOS } from '@/lib/scimega/training/scimega-training-sandbox';
import { SCIMEGA_OPERATOR_CHECKLIST } from '@/lib/scimega/training/scimega-operator-checklist';
import { ScimegaReplayAssembler } from '@/lib/scimega/replay/scimega-replay-assembler';
import { ScimegaReplayRiskAnnotator } from '@/lib/scimega/replay/scimega-replay-risk-annotator';
import type { SCIMEGAReplayFrame } from '@/lib/scimega/replay/scimega-replay-types';
import { ArchiveAssembler } from '@/lib/scimega/archive/archive-assembler';
import type { ArcHivePackage } from '@/lib/scimega/archive/archive-manifest-types';
import { ArcCryptoSignature, type ArcSignatureRecord } from '@/lib/scimega/authorization/arc-crypto-signature';
import { ArcHiveStorageLayer } from '@/lib/scimega/archive/archive-storage';
import { BaneProductionGate } from '@/lib/scimega/governance/bane-production-gate';
import { ScimegaRealityBridge } from '@/lib/scimega/bridge/scimega-reality-bridge';

// Phase 10 Imports
import type { SCIMEGAFlightMode, SCIMEGAControlAuthority } from '@/lib/scimega/autonomy/scimega-autonomy-types';
import { FlightModeManager } from '@/lib/scimega/autonomy/flight-mode-manager';
import { ControlArbitrationEngine } from '@/lib/scimega/autonomy/control-arbitration-engine';
import { PilotInterruptProtocol } from '@/lib/scimega/autonomy/pilot-interrupt-protocol';
import { BaneAutomationAuthorityGate } from '@/lib/scimega/autonomy/bane-automation-authority-gate';
import { LariArchiveTranslationBinding } from '@/lib/scimega/autonomy/lari-archivetranslation-binding';
import { MissionExecutionModel } from '@/lib/scimega/autonomy/mission-execution-model';
import { AnchorHoldModel } from '@/lib/scimega/autonomy/anchor-hold';
import { TeonFlightEnvelope } from '@/lib/scimega/autonomy/teon-flight-envelope';

// Phase 11 Imports
import { ScimegaDosPlBridge } from '@/lib/scimega/pl/scimega-dos-pl-bridge';

const ledger = new ScimegaSimulationLedger();
export function XsciteDroneBuilderUI() {
  const [aircraftClass, setAircraftClass] = useState<string>('INSPECTION_QUAD_5');
  const [activeDomain, setActiveDomain] = useState<SCIMEGADomain>('BUILD');
  const [targetMethodId, setTargetMethodId] = useState<string>('drone-exterior-survey');
  const [exportTarget, setExportTarget] = useState<SCIMEGAExportTarget>('betaflight_msp');
  const [arcIdentityPresent] = useState<boolean>(true);
  const [telemetryTrustState] = useState<string>('simulated');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  // Phase 10 Autonomy States
  const [flightMode, setFlightMode] = useState<SCIMEGAFlightMode>('manual_pilot');
  const [pilotInterruptActive, setPilotInterruptActive] = useState<boolean>(false);
  
  // Phase 9 States
  const [archive, setArchive] = useState<ArcHivePackage | null>(null);
  const [signature, setSignature] = useState<ArcSignatureRecord | null>(null);
  const [bridgeResponse, setBridgeResponse] = useState<any>(null);

  const recommendation = LariScimegaEngine.generateBuildRecommendation(aircraftClass);
  const operationalNotes = LariScimegaEngine.generateOperationalReadinessNotes(aircraftClass, targetMethodId);
  const capabilities = SCIMEGA_BUILD_CAPABILITIES[aircraftClass] || null;
  const method = getMethodPack(targetMethodId);
  const compatibility = capabilities ? evaluateMethodCompatibility(capabilities, method) : null;
  const mockCurrentWindMph = 12;
  const mockCurrentTempF = 75;
  const mockSchedulerPosture = 'approved_candidate';
  const mockDroneContext = capabilities ? {
    buildId: recommendation.id, aircraftClass, readiness: 'ready' as const,
    batteryLevelPercent: 100, maintenanceState: { requiresMaintenance: false },
    environmentalLimits: capabilities.environmentalLimits, assignedMethod: targetMethodId
  } : null;
  const baneGate = (compatibility && mockDroneContext) ? BaneDroneDeploymentGate.evaluate(compatibility, mockDroneContext, mockSchedulerPosture, mockCurrentWindMph, mockCurrentTempF) : null;
  const exportProposal = capabilities ? ScimegaExportEngine.generateProposal(recommendation.id, exportTarget, capabilities, compatibility, mockSchedulerPosture, baneGate) : null;
  const signingGate = exportProposal ? BaneProposalSigningGate.evaluate(exportProposal, arcIdentityPresent, false) : null;
  const terminalScript = exportProposal ? ScimegaTerminalEngine.generateScript(exportProposal, arcIdentityPresent) : null;

  // Phase 10 Logic
  const mockIntent = "Inspect the drone exterior focusing on payload bay.";
  const translationBinding = LariArchiveTranslationBinding.translateIntentToMissionPlan(mockIntent, "ARC-994", true);
  const teonParams = { maxAltitudeMeters: 120, maxSpeedMetersPerSec: 15, geofenceRadiusMeters: 500, maxWindSpeedMph: 25, minProximityThresholdMeters: 2.0, returnToOriginRequired: true };
  const teonConditions = TeonFlightEnvelope.evaluateConditions(teonParams, mockCurrentWindMph, 'good', 100);
  const missionReadyState = MissionExecutionModel.evaluateMissionReadiness(translationBinding.plan, arcIdentityPresent, !!baneGate, teonConditions.active, !!compatibility);
  const baneAutomationGate = BaneAutomationAuthorityGate.evaluate(arcIdentityPresent, missionReadyState.isReady, teonConditions.active, true, true, true);
  
  const anchorHoldState = AnchorHoldModel.evaluateHoldReadiness('3D', 12, true, mockCurrentWindMph);
  if (flightMode === 'anchor_hold') anchorHoldState.isActive = true;

  const authorityRes = ControlArbitrationEngine.determineAuthority(flightMode, teonConditions.active, !baneAutomationGate.isAuthorized, pilotInterruptActive ? { eventId: 'INT-1', timestamp: new Date().toISOString(), severity: 'soft_interrupt', triggerSource: 'stick', requiresAnchorHold: true } : undefined);
  const autonomyNotes = LariScimegaEngine.generateAutonomyReadinessNotes(flightMode, baneAutomationGate.verdict, teonConditions.active, true, missionReadyState.isReady, authorityRes);
  
  // Phase 11 Logic
  const plReadiness = ScimegaDosPlBridge.getReadinessSummary('X1-CONFIG-A');
  const plNotes = LariScimegaEngine.generatePlReadinessNotes(
    plReadiness.profile.profileId,
    plReadiness.profile.adapterStatus,
    plReadiness.baneVerdict.verdict,
    plReadiness.isPlReadyForAutonomy,
    plReadiness.hardwareStatus
  );
  
  // Phase 12 Logic
  const dryLinkNotes = LariScimegaEngine.generateDryLinkReadinessNotes(
    plReadiness.dryLinkProfile.profileId,
    plReadiness.dryLinkProfile.overallReadiness,
    plReadiness.dryLinkProfile.contracts.length,
    plReadiness.dryLinkReadiness.verdict,
    plReadiness.dryLinkReadiness.reasons
  );
  
  const handleSimulateInterrupt = () => {
    setPilotInterruptActive(true);
    const interruptResult = PilotInterruptProtocol.processInterrupt({ eventId: 'INT-1', timestamp: new Date().toISOString(), severity: 'hard_interrupt', triggerSource: 'stick', requiresAnchorHold: true }, flightMode);
    setFlightMode(interruptResult.targetMode);
    setTimeout(() => setPilotInterruptActive(false), 3000); // Reset interrupt simulation after 3s
  };

  const handleRequestMode = (mode: SCIMEGAFlightMode) => {
    const currentState = { activeMode: flightMode, controlAuthority: authorityRes.activeAuthority, pilotInterruptAvailable: true, teonEnvelopeActive: teonConditions.active, baneAutomationApproved: baneAutomationGate.isAuthorized, isSimulationOnly: true };
    const transition = FlightModeManager.requestTransition(currentState, mode, arcIdentityPresent);
    if (transition.allowed) {
      setFlightMode(transition.nextMode);
    } else {
      console.warn("Transition Blocked:", transition.reason);
    }
  };

  // Phase 9 Async Manifest Generation
  useEffect(() => {
    async function generateAsyncManifest() {
      try {
        const pkg = await ArchiveAssembler.assemble({
          proposalId: 'PROPOSAL-DEMO',
          buildId: 'BUILD-101',
          arcId: 'ARC-994',
          aircraftClass: aircraftClass,
          version: 'v1.0.0-final',
          hasBuildProfile: true,
          hasCapabilityMap: true,
          hasMethodCompatibility: !!compatibility,
          hasSchedulerPosture: true,
          hasBaneVerdict: !!baneGate,
          hasArcAuthorization: true,
          hasTerminalSimulation: !!terminalScript,
          hasTelemetryReplay: true,
          hasAuditChain: true,
          auditEventCount: 12,
          auditChainRoot: 'AUDIT-00000000',
          auditChainTip: 'AUDIT-12345678',
          arcAuthorized: arcIdentityPresent,
          hardwareMutationAuthorized: false
        });
        setArchive(pkg);

        // Sign the manifest
        const sig = await ArcCryptoSignature.signManifest('ARC-994', pkg.manifest.integrity.manifestHash);
        setSignature(sig);

        // Test Reality Bridge (Inactive Boundary)
        const bridgeRes = await ScimegaRealityBridge.transmitSignedManifest(pkg, sig);
        setBridgeResponse(bridgeRes);

        // Auto-save to storage
        ArcHiveStorageLayer.saveManifest(pkg);
      } catch (err) {
        console.error("Failed to generate archive asynchronously:", err);
      }
    }
    generateAsyncManifest();
  }, [aircraftClass, compatibility, baneGate, terminalScript, arcIdentityPresent]);

  const authorityDetails = {
    dominantAuthority: (authorityRes.activeAuthority === 'IU_PILOT' ? 'PILOT_CONTROL' : 
                        authorityRes.activeAuthority === 'TEON_SAFETY' ? 'TEON_SAFETY' : 
                        authorityRes.activeAuthority === 'BANE_HOLD' ? 'BANE_GOVERNANCE' : 'SCING_BFI') as SCIMEGAAuthorityLevel,
    scingStatus: "BFI_NOMINAL",
    iuBinding: "SECURE_TUNNEL",
    archivalStatus: archive ? "MANIFEST_READY" : "GENERATING",
    baneGates: [
      { label: "Deployment Gate", status: (baneGate?.verdict === 'APPROVED' ? 'APPROVED' : 'PENDING') as any },
      { label: "Signing Gate", status: (signingGate?.verdict === 'APPROVABLE' ? 'APPROVED' : 'PENDING') as any },
      { label: "Automation Gate", status: (baneAutomationGate.isAuthorized ? 'APPROVED' : 'LOCKED') as any },
      { label: "Production Gate", status: (bridgeResponse?.gateVerdict === 'APPROVED_FOR_TRANSMISSION' ? 'APPROVED' : 'LOCKED') as any }
    ],
    teonStack: [
      { label: "Altitude Limit", active: teonConditions.active },
      { label: "Velocity Limit", active: teonConditions.active },
      { label: "Geofence Enforcement", active: teonConditions.active },
      { label: "Proximity Shield", active: teonConditions.active }
    ],
    arcSignature: signature?.signatureHash || "AWAITING_IDENTITY_BINDING",
    preemptionReason: authorityRes.preemptionSource ? `Control seized by ${authorityRes.preemptionSource}` : undefined
  };

  const scingAdvisory = {
    statement: pilotInterruptActive ? "Pilot interrupt detected. Anchor hold is required before manual confirmation." :
               !teonConditions.active ? "TEON has restricted forward motion due to safety envelope breach." :
               !baneAutomationGate.isAuthorized ? "BANE has placed the autonomy request under review." :
               "Mission remains simulation-only. No live control path is active.",
    interpretation: pilotInterruptActive ? "Sovereign Human Preemption protocol active." :
                    !teonConditions.active ? "Kinetic safety constraint arbitration engaged." :
                    "Sovereign Intelligence maintained via simulation boundary.",
    explanation: !teonConditions.active ? "Atmospheric turbulence or geofence proximity detected." : undefined
  };

  const authorityFlowEvents: SCIMEGAAuthorityFlowEvent[] = [
    {
      id: 'flow-1',
      transition: {
        timestamp: new Date().toISOString(),
        class: 'scing_autonomy_request' as const,
        priorAuthority: 'PILOT_CONTROL' as const,
        newAuthority: 'SCING_BFI' as const,
        preemptionSource: 'LARI-Engine',
        reason: 'Optimal flight path calculated',
        severity: 'LOW' as const
      }
    }
  ];

  if (pilotInterruptActive) {
    authorityFlowEvents.push({
      id: 'flow-2',
      transition: {
        timestamp: new Date().toISOString(),
        class: 'pilot_interrupt' as const,
        priorAuthority: 'SCING_BFI' as const,
        newAuthority: 'PILOT_CONTROL' as const,
        preemptionSource: 'Stick Input',
        reason: 'Manual override detected',
        severity: 'HIGH' as const
      }
    });
  }

  const mockEvents: any[] = [
    { id: '1', timestamp: new Date().toISOString(), type: 'AUDIT' as const, message: 'SCIMEGA Core Initialized', severity: 'INFO' as const },
    { id: '2', timestamp: new Date().toISOString(), type: 'GOVERNANCE' as const, message: 'BANE Gate Evaluated: APPROVED', severity: 'INFO' as const },
    { id: '3', timestamp: new Date().toISOString(), type: 'AUTHORIZATION' as const, message: 'ARC Identity Verified', severity: 'INFO' as const },
    { id: '4', timestamp: new Date().toISOString(), type: 'SAFETY' as const, message: 'TEON Safety Envelope Active', severity: 'INFO' as const }
  ];

  if (pilotInterruptActive) {
    mockEvents.push({
      id: '5',
      timestamp: new Date().toISOString(),
      type: 'TRANSITION',
      message: 'Pilot Interrupt: Switching to Manual',
      severity: 'WARNING'
    });
  }

  const renderDomainContent = () => {
    switch (activeDomain) {
      case 'BUILD':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3"><CardTitle className="text-xs uppercase tracking-widest text-white/40">Aircraft Class</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                {[{ id: 'INSPECTION_QUAD_5', name: '5" Inspection Quad', type: 'QUADCOPTER' },{ id: 'SURVEY_HEX_10', name: '10" Survey Hexa', type: 'HEXACOPTER' },{ id: 'INDOOR_CINELOOP', name: 'Indoor Cinewhoop', type: 'QUADCOPTER' }].map(cls => (
                  <button key={cls.id} onClick={() => setAircraftClass(cls.id)} className={cn("flex items-center justify-between p-3 rounded-lg border transition-all text-left", aircraftClass === cls.id ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10")}>
                    <div className="flex flex-col"><span className="text-xs font-bold">{cls.name}</span><span className="text-[10px] font-mono opacity-60">{cls.type}</span></div>
                    {aircraftClass === cls.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>))}
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3"><CardTitle className="text-xs uppercase tracking-widest text-white/40">LARI Intelligence</CardTitle></CardHeader>
              <CardContent>
                <div className="text-[10px] text-white/60 leading-relaxed font-mono space-y-1">
                  {recommendation.reasoningNotes.map((n, i) => <p key={i}>&gt; {n}</p>)}
                  {operationalNotes.map((n, i) => <p key={`o-${i}`} className="text-blue-400/80">&gt; {n}</p>)}
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10 flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-xs"><span className="text-white/40">Confidence</span><span className="font-bold text-green-400">{Math.round(recommendation.confidenceScore * 100)}%</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-white/40">Est. Weight</span><span className="font-mono">{recommendation.estimatedWeightGram}g</span></div>
                </div>
              </CardContent>
            </Card>
            <div className="md:col-span-2">
              <h4 className="text-xs font-black tracking-widest text-white/60 mb-2">BUILD SPECIFICATIONS</h4>
              {capabilities && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(capabilities.payloads).map(([k, v]) => (<div key={k} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3"><Box className="h-5 w-5 text-primary/60" /><div><div className="text-xs font-bold text-white/80">{k.toUpperCase()}</div><div className="text-[10px] text-white/40 font-mono">{v ? 'EQUIPPED' : 'NOT EQUIPPED'}</div></div></div>))}</div>}
            </div>
          </div>
        );
      case 'METHOD_FIT':
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3"><CardTitle className="text-xs uppercase tracking-widest text-white/40">Target Method Selection</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {[{ id: 'drone-exterior-survey', name: 'Exterior Survey' },{ id: 'drone-roof-scan', name: 'Roof Scan' },{ id: 'drone-thermal-envelope', name: 'Thermal Envelope' }].map(m => (
                  <button key={m.id} onClick={() => setTargetMethodId(m.id)} className={cn("flex items-center justify-between p-3 rounded-lg border transition-all text-left", targetMethodId === m.id ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10")}>
                    <span className="text-xs font-bold">{m.name}</span>{targetMethodId === m.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>))}
              </CardContent>
            </Card>
            {compatibility && <div className="space-y-3"><div className="flex justify-between items-center text-xs"><span className="text-white/40">Method Compatibility:</span><Badge variant="outline" className={compatibility.status === 'compatible' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}>{compatibility.status.toUpperCase()}</Badge></div>{compatibility.reasons.length > 0 && <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-400 space-y-1">{compatibility.reasons.map((w: string, i: number) => <div key={i}>&gt; {w}</div>)}</div>}</div>}
          </div>
        );
      case 'SCHEDULER':
        return (
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-sm font-black tracking-widest text-white/80 mb-4 uppercase">Mission Schedule Context</h3>
            <div className="flex gap-4 border-t border-white/10 pt-4 text-[10px] text-white/40">
              <div className="flex items-center gap-1"><Activity className="h-3 w-3" /> Posture: {mockSchedulerPosture}</div>
              <div>Wind: {mockCurrentWindMph}mph</div>
              <div>Temp: {mockCurrentTempF}F</div>
            </div>
            {baneGate && <div className="mt-6 space-y-3"><div className="flex justify-between items-center text-xs"><span className="text-white/40">BANE Deployment Verdict:</span><Badge variant="outline" className={cn("text-[10px]", baneGate.verdict === 'APPROVED' ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400')}>{baneGate.verdict}</Badge></div>{baneGate.reasons.length > 0 && <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-400 space-y-1">{baneGate.reasons.map((r: string, i: number) => <div key={i}>&gt; {r}</div>)}</div>}</div>}
          </Card>
        );
      case 'EXPORT':
        return (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-start gap-3"><FileWarning className="h-5 w-5 text-red-400 mt-0.5" /><div><h4 className="text-xs font-black tracking-widest text-red-400">NO HARDWARE WRITE BOUNDARY</h4><p className="text-[10px] text-red-400/80 mt-1 uppercase">Simulation Proposal Only. No serial or network mutation.</p></div></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-2">EXPORT TARGET</h4>
                <select className="bg-black/50 border border-white/20 text-xs p-1 rounded w-full" value={exportTarget} onChange={(e) => setExportTarget(e.target.value as SCIMEGAExportTarget)}>
                  <option value="betaflight_msp">Betaflight (MSP)</option><option value="ardupilot_mavlink">ArduPilot (MAVLink)</option><option value="companion_raspberry_pi">Companion (RPi)</option><option value="scimega_dos_manifest">DOS Manifest</option>
                </select>
                {exportProposal && <div className="mt-4 flex flex-col gap-2"><div className="flex justify-between items-center text-xs"><span className="text-white/40">Status:</span><Badge variant="outline" className={cn("text-[10px] font-bold", exportProposal.overallStatus === 'approved_for_export' ? 'border-green-500 text-green-400' : exportProposal.overallStatus === 'review_required' ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400')}>{exportProposal.overallStatus.replace(/_/g,' ').toUpperCase()}</Badge></div>{exportProposal.blockers.length > 0 && <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 space-y-1">{exportProposal.blockers.map((b,i) => <div key={i}>&gt; {b}</div>)}</div>}</div>}
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-2">CONFIGURATION DIFF</h4>
                {exportProposal ? <div className="flex flex-col gap-2 text-xs"><div className="flex justify-between items-center"><span className="text-white/40">Classification:</span><Badge variant="outline" className={cn("text-[10px]", exportProposal.diff.classification === 'firmware_adjacent' ? 'border-yellow-500 text-yellow-400' : 'border-blue-500 text-blue-400')}>{exportProposal.diff.classification.replace(/_/g,' ').toUpperCase()}</Badge></div><div className="bg-black/50 p-2 rounded border border-white/5 text-[10px] text-white/70 space-y-1 mt-2">{exportProposal.diff.humanReadableSummary.map((s,i) => <div key={i}>- {s}</div>)}</div></div> : <span className="text-xs text-white/40">No diff available.</span>}
              </div>
            </div>
            {exportProposal && exportProposal.artifacts.length > 0 && <div className="border border-purple-500/30 rounded-lg overflow-hidden flex flex-col"><div className="bg-purple-500/10 p-3 flex justify-between items-center border-b border-purple-500/30"><h4 className="text-xs font-black tracking-widest text-purple-400 flex items-center gap-2"><FileJson className="h-4 w-4" /> GENERATED PROPOSAL ARTIFACT</h4><Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[9px]">{exportProposal.artifacts[0].target.toUpperCase()}</Badge></div><div className="bg-black p-4 text-[10px] font-mono text-green-400/80 overflow-auto max-h-[200px] whitespace-pre">{exportProposal.artifacts[0].payloadContent}</div></div>}
          </div>
        );
      case 'ARC_AUTH':
        return (
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h4 className="text-xs font-black tracking-widest text-cyan-400 mb-4 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> ARC AUTHORIZATION CORE</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs"><span className="text-white/40">Identity Binding:</span><Badge variant="outline" className={arcIdentityPresent ? 'border-cyan-500 text-cyan-400' : 'border-red-500 text-red-400'}>{arcIdentityPresent ? 'VERIFIED' : 'MISSING'}</Badge></div>
                <div className="flex justify-between items-center text-xs"><span className="text-white/40">Signing Gate:</span><Badge variant="outline" className={cn("text-[10px]", signingGate?.verdict === 'APPROVABLE' ? 'border-green-500 text-green-400' : signingGate?.verdict === 'REVIEW_REQUIRED' ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400')}>{signingGate?.verdict || 'PENDING'}</Badge></div>
                {signingGate && signingGate.reasons.length > 0 && <div className="bg-black/50 p-2 rounded border border-white/5 text-[10px] text-red-400/80 space-y-1">{signingGate.reasons.map((r,i) => <div key={i}>&gt; {r}</div>)}</div>}
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-6">
              <h4 className="text-xs font-black tracking-widest text-white/60 mb-4 uppercase">Cryptographic Integrity</h4>
              <div className="p-3 rounded bg-black/40 border border-white/10">
                <span className="text-[10px] font-mono text-cyan-400/60 break-all">{signature?.signatureHash || "AWAITING_SIGNATURE"}</span>
              </div>
            </Card>
          </div>
        );
      case 'TELEMETRY':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-blue-500/5 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-bold px-2 py-1 tracking-widest">INBOUND ONLY / NO C2</div>
              <h4 className="text-xs font-black tracking-widest text-blue-400 mb-4 flex items-center gap-2"><Radio className="h-4 w-4" /> COMPANION TELEMETRY STREAM</h4>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs"><span className="text-white/40">Trust State:</span><Badge variant="outline" className={cn("text-[10px]", telemetryTrustState === 'observed' ? 'border-green-500 text-green-400' : telemetryTrustState === 'simulated' ? 'border-purple-500 text-purple-400' : 'border-red-500 text-red-400')}>{telemetryTrustState.toUpperCase()}</Badge></div>
                  <div className="bg-black/40 p-3 rounded border border-white/5 text-[10px] font-mono text-blue-300 space-y-1">
                    <div className="flex justify-between"><span>Battery:</span><span>14.8v / 85%</span></div>
                    <div className="flex justify-between"><span>GPS Fix:</span><span>3D (12 sat)</span></div>
                    <div className="flex justify-between"><span>Signal:</span><span>-45 dBm</span></div>
                  </div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg flex items-center justify-center border border-white/5">
                  <Activity className="h-12 w-12 text-blue-500/20" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'TERMINAL':
        return (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-lg flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" /><div><h4 className="text-xs font-black tracking-widest text-amber-400 uppercase tracking-tighter">Simulation Only Environment</h4><p className="text-[10px] text-amber-400/80 mt-1">Generated scripts are for human review. NO EXECUTION PATHS EXIST.</p></div></div>
            {terminalScript && <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-2 uppercase">Status</h4>
                <div className="flex justify-between items-center text-xs"><span className="text-white/40">State:</span><Badge variant="outline" className={cn("text-[10px]", terminalScript.simulationState === 'simulated' ? 'border-amber-500 text-amber-400' : 'border-red-500 text-red-400')}>{terminalScript.simulationState.toUpperCase()}</Badge></div>
                <div className="flex justify-between items-center text-xs mt-2"><span className="text-white/40">Environment:</span><span className="text-[10px] text-white/70">{terminalScript.environmentHint}</span></div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-2 uppercase">Safety</h4>
                <div className="flex justify-between items-center text-xs"><span className="text-white/40">Risk Commands:</span><span className="text-[10px] text-red-400 font-bold">{terminalScript.commands.filter(c => c.isSafetyCritical).length} safety-critical</span></div>
                <div className="flex justify-between items-center text-xs mt-2"><span className="text-white/40">Execution Authorization:</span><Badge variant="outline" className="border-red-500 text-red-500 text-[8px]">DENIED</Badge></div>
              </div>
            </div>}
            {terminalScript && <div className="border border-amber-500/30 rounded-lg overflow-hidden flex flex-col"><div className="bg-amber-500/10 p-3 flex justify-between items-center border-b border-amber-500/30"><h4 className="text-xs font-black tracking-widest text-amber-400 flex items-center gap-2"><Terminal className="h-4 w-4" /> COMMAND SCRIPT OUTPUT</h4><Badge variant="outline" className="border-amber-500/50 text-amber-400 text-[9px]">READ-ONLY</Badge></div><div className="bg-black p-4 text-[10px] font-mono text-amber-400/80 overflow-auto max-h-[300px] whitespace-pre">{terminalScript.rawScript}</div></div>}
          </div>
        );
      case 'AUDIT':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-black tracking-widest text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-tighter"><ScrollText className="h-4 w-4" /> Simulation Audit Ledger</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-4 uppercase">Proposal Lifecycle</h4>
                {['draft','reviewed','arc_authorized','simulated','rejected','revoked','archived'].map(s => (<div key={s} className="flex items-center gap-2 text-[10px] py-1"><Circle className={cn('h-2 w-2', s === 'draft' ? 'text-emerald-400 fill-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-white/20')} /><span className="text-white/60">{s.toUpperCase()}</span></div>))}
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-xs font-black tracking-widest text-white/60 mb-4 uppercase">Event Chain</h4>
                <div className="text-[10px] text-white/40 font-mono space-y-2 leading-relaxed">
                  <div>&gt; Genesis: AUDIT-00000000</div>
                  <div>&gt; Root: {archive?.manifest.integrity.auditChainRoot || "PENDING"}</div>
                  <div>&gt; Events: {archive?.manifest.sections.find(s=>s.sectionId==='audit')?.sectionName.includes('Events') ? '12 recorded' : '0 recorded'}</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-black/40 border border-white/5 rounded-lg">
              <h4 className="text-xs font-black tracking-widest text-white/40 mb-4 uppercase">Hard Governance Boundaries</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded bg-red-500/5 border border-red-500/20 text-center"><div className="text-[10px] font-black text-red-500/60 uppercase">NO-FLASH</div></div>
                <div className="p-3 rounded bg-blue-500/5 border border-blue-500/20 text-center"><div className="text-[10px] font-black text-blue-500/60 uppercase">NO-C2</div></div>
                <div className="p-3 rounded bg-amber-500/5 border border-amber-500/20 text-center"><div className="text-[10px] font-black text-amber-500/60 uppercase">NO-EXECUTION</div></div>
              </div>
            </div>
          </div>
        );
      case 'TRAINING':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-widest text-pink-400 uppercase flex items-center gap-2"><BookOpen className="h-4 w-4" /> Scenarios</h4>
              {SCIMEGA_TRAINING_SCENARIOS.map(sc => (<button key={sc.id} onClick={() => setActiveScenarioId(sc.id)} className={cn('p-4 rounded-lg border transition-all text-left w-full', activeScenarioId === sc.id ? 'bg-pink-500/10 border-pink-500/40 text-pink-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10')}><div className="text-[10px] font-bold">{sc.name}</div><div className="text-[9px] opacity-60 mt-1">{sc.description}</div></button>))}
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-widest text-white/40 uppercase">Operator Checklist</h4>
              {SCIMEGA_OPERATOR_CHECKLIST.map(item => (<button key={item.id} onClick={() => { const next = new Set(checkedItems); next.has(item.id) ? next.delete(item.id) : next.add(item.id); setCheckedItems(next); }} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-left w-full">{checkedItems.has(item.id) ? <Check className="h-3 w-3 text-green-400 mt-0.5 shrink-0" /> : <Circle className="h-3 w-3 text-white/10 mt-0.5 shrink-0" />}<div><div className={cn('text-[10px] font-bold', item.isBoundaryItem ? 'text-red-400' : 'text-white/80')}>{item.label}</div><div className="text-[9px] text-white/40 mt-1">{item.description}</div></div></button>))}
            </div>
          </div>
        );
      case 'REPLAY':
        return (
          <div className="space-y-8">
            <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-lg flex items-center gap-3"><ShieldAlert className="h-5 w-5 text-teal-400" /><div><h4 className="text-xs font-black tracking-widest text-teal-400 uppercase tracking-tighter">Read-Only Telemetry Replay</h4><p className="text-[10px] text-teal-400/80 mt-1">Observation only. No device control or command authority.</p></div></div>
            {(() => { const mockFrames: SCIMEGAReplayFrame[] = [{frameId:'F-001',timestamp:new Date(Date.now()-30000).toISOString(),source:'simulated',trustState:'simulated',telemetry:{batteryVoltage:14.8,batteryPercent:85,gpsFix:'3D',satelliteCount:12,signalDbm:-45,altitudeMeters:30,groundSpeedMps:2.5}},{frameId:'F-002',timestamp:new Date(Date.now()-20000).toISOString(),source:'simulated',trustState:'simulated',telemetry:{batteryVoltage:14.6,batteryPercent:78,gpsFix:'3D',satelliteCount:11,signalDbm:-48,altitudeMeters:35,groundSpeedMps:3.1}},{frameId:'F-003',timestamp:new Date(Date.now()-10000).toISOString(),source:'simulated',trustState:'degraded',telemetry:{batteryVoltage:14.2,batteryPercent:65,gpsFix:'2D',satelliteCount:6,signalDbm:-62,altitudeMeters:28,groundSpeedMps:1.8}}]; const session = ScimegaReplayAssembler.assemble('PROPOSAL-DEMO', mockFrames, null, []); const annotations = ScimegaReplayRiskAnnotator.annotate(session); return (<>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10"><h4 className="text-[10px] font-black tracking-widest text-white/30 mb-3 uppercase">Session</h4><div className="text-[10px] text-white/50 font-mono space-y-1"><div>&gt; ID: {session.sessionId}</div><div>&gt; Frames: {session.frames.length}</div><div>&gt; Duration: {(session.totalDurationMs / 1000).toFixed(1)}s</div></div></div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10"><h4 className="text-[10px] font-black tracking-widest text-white/30 mb-3 uppercase">Trust</h4><div className="text-[10px] space-y-1"><div className="flex justify-between"><span className="text-white/30">Simulated:</span><span className="text-purple-400 font-mono">{session.trustSummary.simulatedCount}</span></div><div className="flex justify-between"><span className="text-white/30">Degraded:</span><span className="text-yellow-400 font-mono">{session.trustSummary.degradedCount}</span></div></div></div>
                <div className="p-4 rounded-lg bg-teal-500/5 border border-teal-500/20"><h4 className="text-[10px] font-black tracking-widest text-teal-400/60 mb-3 uppercase">Playback</h4><div className="flex gap-2 justify-center"><button className="p-2 rounded bg-white/5 border border-white/10"><SkipBack className="h-3 w-3 text-white/40" /></button><button className="p-2 rounded bg-teal-500/20 border border-teal-500/30"><Play className="h-3 w-3 text-teal-400" /></button><button className="p-2 rounded bg-white/5 border border-white/10"><Pause className="h-3 w-3 text-white/40" /></button><button className="p-2 rounded bg-white/5 border border-white/10"><SkipForward className="h-3 w-3 text-white/40" /></button></div></div>
              </div>
              <div className="mt-8 border border-teal-500/20 rounded-xl overflow-hidden bg-black/40"><div className="bg-teal-500/5 p-4 border-b border-teal-500/20"><h4 className="text-xs font-black tracking-widest text-teal-400 uppercase">Telemetry Timeline</h4></div><div className="p-4 max-h-[300px] overflow-y-auto space-y-2">{session.frames.map((f, i) => (<div key={f.frameId} className="flex items-center gap-4 text-[10px] py-2 border-b border-white/[0.02] font-mono text-white/60"><span className="text-white/20 w-8">#{i+1}</span><Badge variant="outline" className={cn('text-[8px] tracking-widest', f.trustState === 'simulated' ? 'border-purple-500/50 text-purple-400' : 'border-yellow-500/50 text-yellow-400')}>{f.trustState.toUpperCase()}</Badge><span>{f.telemetry.batteryPercent}% | {f.telemetry.gpsFix} | {f.telemetry.altitudeMeters}m | {f.telemetry.signalDbm}dBm</span></div>))}</div></div>
            </>); })()}
          </div>
        );
      case 'ARCHIVE':
        return (
          <div className="space-y-8">
            <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-lg flex items-center gap-3"><Archive className="h-5 w-5 text-indigo-400" /><div><h4 className="text-xs font-black tracking-widest text-indigo-400 uppercase tracking-tighter">ArcHive™ Manifest Package</h4><p className="text-[10px] text-indigo-400/80 mt-1">Cryptographic operational lineage record.</p></div></div>
            {archive ? (<>
              <div className="grid grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/10 p-6">
                  <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">Metadata</h4>
                  <div className="text-[10px] text-white/60 font-mono space-y-2 leading-relaxed">
                    <div>&gt; ID: {archive.manifest.manifestId}</div>
                    <div>&gt; Version: {archive.manifest.versionState}</div>
                    <div>&gt; Identity: {archive.manifest.arcId}</div>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-6">
                  <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">BANE Archive Gate</h4>
                  <div className="flex items-center gap-3 mb-4"><ShieldCheck className={cn('h-5 w-5', archive.archiveGateVerdict==='APPROVED_FOR_ARCHIVE'?'text-green-400':'text-amber-400')} /><span className="text-xs font-black tracking-widest text-white/80">{archive.archiveGateVerdict.replace(/_/g,' ')}</span></div>
                  <div className="space-y-1">{archive.archiveGateReasons.map((r,i)=>(<div key={i} className="text-[9px] text-white/40 leading-tight">- {r}</div>))}</div>
                </Card>
              </div>
              <div className="border border-indigo-500/20 rounded-xl overflow-hidden bg-black/40"><div className="bg-indigo-500/5 p-4 border-b border-indigo-500/20"><h4 className="text-xs font-black tracking-widest text-indigo-400 uppercase">Serialized Manifest</h4></div><div className="p-6 overflow-x-auto"><pre className="text-[10px] text-indigo-400/60 font-mono m-0">{archive.serializedContent}</pre></div></div>
            </>) : <div className="text-white/20 text-xs p-12 text-center border border-white/5 border-dashed rounded-xl">Generating Cryptographic Package...</div>}
          </div>
        );
      case 'PRODUCTION':
        return (
          <div className="space-y-8">
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg flex items-start gap-4"><ShieldAlert className="h-8 w-8 text-red-500" /><div><h4 className="text-sm font-black tracking-widest text-red-500 uppercase tracking-tighter">Reality Bridge Boundary</h4><p className="text-[11px] text-red-400/80 mt-1 font-bold uppercase">Hardware Transmission Locked. All physical write paths are actively rejected.</p></div></div>
            {bridgeResponse && signature && archive ? (<div className="grid grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">BANE Production Gate</h4>
                <div className="flex items-center gap-3 mb-4"><CheckCircle2 className="h-5 w-5 text-green-400" /><span className="text-xs font-black tracking-widest text-green-400">{bridgeResponse.gateVerdict.replace(/_/g, ' ')}</span></div>
                <div className="text-[10px] text-white/50 leading-relaxed italic">All operational conditions met. Manifest is cryptographically sound and production-ready.</div>
              </Card>
              <Card className="bg-red-500/5 border-red-500/20 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-red-400/60 mb-4 uppercase">Bridge Status: {bridgeResponse.status.replace(/_/g, ' ')}</h4>
                <div className="text-[11px] text-red-400/80 font-mono leading-relaxed bg-black p-4 rounded border border-red-500/10">{bridgeResponse.message}</div>
              </Card>
            </div>) : <div className="text-white/20 text-xs p-12 text-center border border-white/5 border-dashed rounded-xl">Evaluating Boundary...</div>}
          </div>
        );
      case 'BFI_AUTONOMY':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 p-6 relative overflow-hidden">
                {authorityRes.priority <= 1 && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-3 py-1.5 tracking-widest">ACTIVE CONTROL</div>}
                <h4 className="text-xs font-black tracking-widest text-white/30 mb-6 uppercase">Control Arbitration Engine</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">Authority:</span><Badge variant="outline" className={cn("text-[9px] font-black tracking-widest px-3", authorityRes.activeAuthority==='IU_PILOT'?'border-green-500 text-green-400':authorityRes.activeAuthority==='BANE_HOLD'?'border-red-500 text-red-400':authorityRes.activeAuthority==='TEON_SAFETY'?'border-orange-500 text-orange-400':'border-cyan-500 text-cyan-400')}>{authorityRes.activeAuthority}</Badge></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">Priority:</span><span className="text-[10px] font-mono text-white/80">{authorityRes.priority}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">Mode:</span><Badge variant="outline" className="border-white/10 text-white/60 text-[9px] px-3">{flightMode.toUpperCase()}</Badge></div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button size="sm" variant="outline" onClick={() => handleRequestMode('manual_pilot')} className="text-[10px] font-black h-8 flex-1 bg-black border-white/10 hover:bg-white/5 uppercase tracking-widest">Manual</Button>
                  <Button size="sm" variant="outline" onClick={() => handleRequestMode('full_mission_automation')} className="text-[10px] font-black h-8 flex-1 bg-black border-cyan-500/20 hover:bg-cyan-900/20 text-cyan-400 uppercase tracking-widest">Auto</Button>
                </div>
                <Button size="sm" variant="outline" onClick={handleSimulateInterrupt} className="w-full mt-3 text-[10px] font-black h-8 bg-black border-amber-500/20 hover:bg-amber-500/10 text-amber-500 uppercase tracking-widest">Simulate Interrupt</Button>
              </Card>
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 p-5">
                  <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase flex justify-between items-center">Teon Flight Envelope <Badge variant="outline" className={cn("text-[8px] tracking-widest", teonConditions.active?'border-green-500 text-green-400':'border-red-500 text-red-400')}>{teonConditions.active?'ACTIVE':'RESTRICTED'}</Badge></h4>
                  <div className="text-[10px] text-white/50 font-mono space-y-1">
                    <div>&gt; Enforcement: {teonConditions.enforcement}</div>
                    <div>&gt; Condition: {teonConditions.reason}</div>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-5">
                  <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">BANE Automation Gate</h4>
                  <div className="flex items-center gap-3 mb-2"><ShieldCheck className={cn("h-5 w-5", baneAutomationGate.isAuthorized?'text-green-400':'text-red-400')}/><span className={cn('text-xs font-black tracking-widest', baneAutomationGate.isAuthorized?'text-green-400':'text-red-400')}>{baneAutomationGate.verdict.toUpperCase()}</span></div>
                  <div className="space-y-1">{baneAutomationGate.reasons.map((r,i) => <div key={i} className="text-[9px] text-white/30 leading-tight">- {r}</div>)}</div>
                </Card>
              </div>
            </div>
            <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl"><h4 className="text-[10px] font-black tracking-widest text-cyan-400/60 mb-4 uppercase">LARI-Archive™ Translation</h4><div className="text-[10px] text-cyan-400/40 font-mono bg-black p-4 rounded mb-4 leading-relaxed">&gt; Intent: "{mockIntent}"</div><div className="grid grid-cols-2 gap-4">{translationBinding.translationNotes.map((n, i) => <div key={i} className="text-[9px] text-cyan-400/70 leading-tight flex items-start gap-2"><div className="h-1 w-1 rounded-full bg-cyan-400/30 mt-1 shrink-0" />{n}</div>)}</div></div>
          </div>
        );
      case 'PL_BOUNDARY':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-6 uppercase flex items-center gap-2"><Network className="h-3 w-3"/> Adapter</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">FC Model:</span><span className="text-[10px] font-mono text-white/80">{plReadiness.profile.fcModel}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">Comp:</span><span className="text-[10px] font-mono text-white/80">{plReadiness.profile.companionModel}</span></div>
                  <div className="pt-4 border-t border-white/[0.03]">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 block">Channels</span>
                    {plReadiness.profile.channels.map(ch => (<div key={ch.channelId} className="flex justify-between items-center py-1"><span className="text-[9px] text-white/40">{ch.protocol}</span><Badge variant="outline" className="text-[7px] border-white/5 text-white/20">{ch.status}</Badge></div>))}
                  </div>
                </div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-6 uppercase flex items-center gap-2"><Activity className="h-3 w-3"/> Telemetry</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">FC Link:</span><Badge variant="outline" className="border-green-500/50 text-green-400 text-[8px] tracking-widest">ONLINE</Badge></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase tracking-widest">Voltage:</span><span className="text-[10px] font-mono text-green-400">{plReadiness.hardwareStatus.batteryVoltage}V</span></div>
                  <div className="pt-4 border-t border-white/[0.03]">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 block">Safety Paths</span>
                    {plReadiness.profile.safetyChannels.map(s => (<div key={s.channelId} className="flex justify-between items-center py-1"><span className="text-[9px] text-white/40">{s.type.replace(/_/g,' ')}</span><Badge variant="outline" className={cn("text-[7px]", s.isReady ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400')}>{s.isReady ? 'READY' : 'FAULT'}</Badge></div>))}
                  </div>
                </div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-white/30 mb-6 uppercase flex items-center gap-2"><Lock className="h-3 w-3"/> BANE PL</h4>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-6 text-center"><div className={cn("text-xs font-black tracking-widest", plReadiness.baneVerdict.isAuthorized ? 'text-green-400' : 'text-red-400')}>{plReadiness.baneVerdict.verdict.replace(/_/g,' ')}</div></div>
                <div className="space-y-2">{plReadiness.baneVerdict.reasons.map((r, i) => (<div key={i} className="text-[9px] text-white/30 leading-tight flex items-start gap-2"><div className="h-1 w-1 rounded-full bg-white/10 mt-1 shrink-0" />{r}</div>))}</div>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-black/40 border border-white/5"><h4 className="text-[10px] font-black tracking-widest text-white/20 mb-4 uppercase">Input & Safety Diagnostics</h4><div className="grid grid-cols-2 gap-8"><div className="space-y-2">{plReadiness.pilotInputStatus.map((s, i) => <div key={i} className="text-[9px] text-white/50 font-mono">&gt; {s}</div>)}</div><div className="space-y-2">{plReadiness.safetyStatus.map((s, i) => <div key={i} className="text-[9px] text-white/50 font-mono">&gt; {s}</div>)}</div></div></div>
              <div className="p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/10"><h4 className="text-[10px] font-black tracking-widest text-cyan-400/30 mb-4 uppercase">PL Readiness Diagnostics</h4><div className="space-y-2 font-mono">{plNotes.map((n, i) => <p key={i} className={cn("text-[10px]", n.includes('CRITICAL') ? 'text-red-400/80' : n.includes('WARNING') ? 'text-amber-400/80' : 'text-cyan-400/60')}>&gt; {n}</p>)}</div></div>
            </div>
          </div>
        );
      case 'DRY_LINK':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-indigo-400 mb-6 uppercase flex items-center gap-2"><Network className="h-3 w-3"/> Dry-Link Contracts</h4>
                <div className="grid grid-cols-1 gap-4">
                  {plReadiness.dryLinkProfile.contracts.map(contract => (
                    <div key={contract.adapterId} className="p-4 rounded-xl bg-black/40 border border-white/5 relative group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-center mb-2"><span className="text-[11px] font-black text-white/80 tracking-widest uppercase">{contract.type}</span><Badge variant="outline" className="text-[8px] border-indigo-500/30 text-indigo-400 uppercase tracking-tighter">Contract Only</Badge></div>
                      <div className="text-[10px] text-white/40 leading-relaxed mb-4">{contract.description}</div>
                      <div className="flex gap-1.5 flex-wrap">{contract.commandFamilies.map(f => (<span key={f} className="text-[8px] bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400/60 uppercase font-bold">{f}</span>))}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-[10px] font-black tracking-widest text-indigo-400 mb-6 uppercase flex items-center gap-2"><ShieldCheck className="h-3 w-3"/> BANE Dry-Link Gate</h4>
                <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 text-center mb-8"><div className={cn("text-sm font-black tracking-[0.2em]", plReadiness.dryLinkReadiness.isReady ? 'text-indigo-400' : 'text-red-400')}>{plReadiness.dryLinkReadiness.verdict.toUpperCase()}</div></div>
                <div className="space-y-3 font-mono">{dryLinkNotes.map((n, i) => <p key={i} className={cn("text-[10px]", n.includes('ENFORCEMENT') ? 'text-red-400/60' : 'text-indigo-400/50')}>&gt; {n}</p>)}</div>
              </Card>
            </div>
          </div>
        );
      default:
        return <div>Domain selection required.</div>;
    }
  };

  return (
    <ScimegaCommandSurface
      activeDomain={activeDomain}
      onDomainChange={setActiveDomain}
      systemStatus={telemetryTrustState === 'simulated' ? 'SIMULATION' : 'DRY-LINK'}
      phase="12.00-FINAL"
      authority={{
        scing: true,
        iu: true,
        bane: true,
        teon: true,
        arc: arcIdentityPresent
      }}
      dominantAuthority={authorityDetails.dominantAuthority}
      scingAdvisory={scingAdvisory}
      authorityFlowEvents={authorityFlowEvents}
      authorityDetails={authorityDetails}
      events={mockEvents}
    >
      {renderDomainContent()}
    </ScimegaCommandSurface>
  );
}
