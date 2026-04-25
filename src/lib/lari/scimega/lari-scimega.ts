/**
 * @classification LARI_SCIMEGA
 * @authority LARI-SCIMEGA Origin Unit
 * @purpose Specialized reasoning/configuration engine for SCIMEGA custom drone builds.
 */

import { SCIMEGA_STANDARDS_MAP, HardwareTarget, HardwareCategory } from './standards-map';

export interface BuildRecommendationContract {
  id: string;
  aircraftClass: string;
  recommendedFC: HardwareTarget;
  recommendedESC: HardwareTarget;
  recommendedCompanion?: HardwareTarget;
  estimatedWeightGram: number;
  confidenceScore: number;
  reasoningNotes: string[];
}

export interface CompatibilityReasoningContract {
  sourceComponentId: string;
  targetComponentId: string;
  isCompatible: boolean;
  protocolMatch: boolean;
  powerMatch: boolean;
  blockers: string[];
  warnings: string[];
}

import { SCIMEGA_BUILD_CAPABILITIES } from '../../scimega/capability-map';
import { evaluateMethodCompatibility } from '../../scimega/method-compatibility';
import { getMethodPack } from '@/lib/inspections/methods/registry';

export class LariScimegaEngine {
  /**
   * Evaluates the compatibility between two components based on the standards map.
   */
  static evaluateCompatibility(
    sourceId: string, 
    sourceCategory: HardwareCategory,
    targetId: string,
    targetCategory: HardwareCategory
  ): CompatibilityReasoningContract {
    const sourceMap = SCIMEGA_STANDARDS_MAP[sourceCategory]?.find(c => c.id === sourceId);
    const targetMap = SCIMEGA_STANDARDS_MAP[targetCategory]?.find(c => c.id === targetId);

    const contract: CompatibilityReasoningContract = {
      sourceComponentId: sourceId,
      targetComponentId: targetId,
      isCompatible: false,
      protocolMatch: false,
      powerMatch: true, // simplified
      blockers: [],
      warnings: []
    };

    if (!sourceMap || !targetMap) {
      contract.blockers.push('Component not found in standards map.');
      return contract;
    }

    // Example reasoning logic
    const commonProtocols = sourceMap.protocols.filter(p => targetMap.protocols.includes(p));
    
    if (commonProtocols.length > 0) {
      contract.protocolMatch = true;
      contract.isCompatible = true;
    } else {
      contract.blockers.push(`No common communication protocols. Source supports [${sourceMap.protocols.join(', ')}], Target supports [${targetMap.protocols.join(', ')}]`);
    }

    if (sourceMap.notes.includes('Legacy')) {
      contract.warnings.push('Source component relies on legacy support protocols.');
    }

    return contract;
  }

  /**
   * Generates a recommended build configuration for a specific aircraft class.
   */
  static generateBuildRecommendation(aircraftClass: string): BuildRecommendationContract {
    // Simplified stub for P1 Origin
    const fc = SCIMEGA_STANDARDS_MAP.FLIGHT_CONTROLLER[0]; // Betaflight
    const esc = SCIMEGA_STANDARDS_MAP.ESC[0]; // DShot
    
    return {
      id: `REC-${Date.now()}`,
      aircraftClass,
      recommendedFC: fc,
      recommendedESC: esc,
      estimatedWeightGram: 450,
      confidenceScore: 0.95,
      reasoningNotes: [
        'Selected standard 5-inch racing/freestyle base.',
        'Matched DShot protocol for low-latency motor control.',
        'Betaflight FC allows rapid tuning and MSP telemetry.'
      ]
    };
  }

  /**
   * Generates operational readiness and method-fit notes based on the drone's capability profile.
   */
  static generateOperationalReadinessNotes(aircraftClass: string, targetMethodId?: string): string[] {
    const capabilities = SCIMEGA_BUILD_CAPABILITIES[aircraftClass];
    const notes: string[] = [];

    if (!capabilities) {
      notes.push(`Unknown capability profile for ${aircraftClass}.`);
      return notes;
    }

    notes.push(`Operational Capability Profile loaded: ${aircraftClass}.`);
    notes.push(`Environmental limits: Wind <= ${capabilities.environmentalLimits.windMaxMph}mph, Temp ${capabilities.environmentalLimits.tempMinF}F - ${capabilities.environmentalLimits.tempMaxF}F.`);

    if (targetMethodId) {
      const method = getMethodPack(targetMethodId);
      const compatibility = evaluateMethodCompatibility(capabilities, method);
      
      notes.push(`Evaluated Method Fit: [${compatibility.status.toUpperCase()}] for ${method.methodName}.`);
      
      if (compatibility.status !== 'compatible') {
        compatibility.reasons.forEach((r: string) => notes.push(`WARNING: ${r}`));
      }
    } else {
      notes.push(`Platform supports ${capabilities.inspectionUseCases.length} core inspection methods.`);
    }

    notes.push(`Scheduler readiness context active. Standby for BANE deployment gate.`);

    return notes;
  }

  /**
   * Generates export boundary reasoning and adapter fit notes.
   */
  static generateExportReadinessNotes(target: string): string[] {
    const notes: string[] = [];
    
    notes.push(`Evaluating export compatibility for target: ${target}`);
    
    if (target.includes('msp') || target.includes('mavlink')) {
      notes.push('CRITICAL: Target is firmware-adjacent. All generated artifacts are strictly drafts and will NOT be flashed to hardware.');
    } else if (target.includes('companion')) {
      notes.push('NOTE: Target is a companion service envelope. Artifacts are service maps, not bootable images.');
    } else if (target === 'scimega_dos_manifest') {
      notes.push('NOTE: Target is a SCIMEGA DOS Manifest. This maps the configuration but does not indicate active runtime execution.');
    }

    return notes;
  }

  /**
   * Generates authorization insights based on proposal signing state.
   */
  static generateAuthorizationNotes(arcIdentityPresent: boolean, status: string): string[] {
    const notes: string[] = [];
    if (!arcIdentityPresent) {
      notes.push('WARNING: No active ARC identity detected. Proposal authorization is locked.');
    } else {
      notes.push(`ARC Identity verified. Proposal authorization status: [${status.toUpperCase()}]`);
      if (status === 'approved') {
        notes.push('NOTE: Authorization covers configuration intent mapping ONLY. No hardware mutation authorized.');
      }
    }
    return notes;
  }

  /**
   * Generates telemetry observation insights.
   */
  static generateTelemetryNotes(trustState: string): string[] {
    const notes: string[] = [];
    notes.push(`Telemetry Bridge Active. Trust State: [${trustState.toUpperCase()}]`);
    if (trustState === 'simulated') {
      notes.push('NOTE: Telemetry is currently mocked for architectural testing.');
    } else if (trustState === 'stale') {
      notes.push('WARNING: Telemetry stream is stale. Data cannot be trusted for operational bounds.');
    } else if (trustState === 'degraded') {
      notes.push('WARNING: Inbound telemetry indicates degraded sensor state or signal drop.');
    }
    notes.push('ENFORCED: Inbound observation only. C2 command paths are disabled.');
    return notes;
  }
  /**
   * Generates terminal simulation insights for the operator.
   */
  static generateTerminalSimulationNotes(
    simulationState: string,
    safetyCriticalCount: number,
    target: string
  ): string[] {
    const notes: string[] = [];
    notes.push(`Terminal Emulation Active. State: [${simulationState.toUpperCase()}]`);
    notes.push(`Target Environment: ${target}`);

    if (simulationState === 'blocked') {
      notes.push('BLOCKED: Terminal simulation refused by BANE gate. Review proposal authorization.');
    } else if (simulationState === 'simulated') {
      notes.push('Scripts generated for human review. No commands have been or will be executed.');
    }

    if (safetyCriticalCount > 0) {
      notes.push(`WARNING: ${safetyCriticalCount} safety-critical command(s) detected. Manual review required before any physical application.`);
    }

    notes.push('ENFORCED: No shell execution, no child_process spawning, no serial/network connection.');
    return notes;
  }
  /**
   * Generates audit summary notes for the operator.
   */
  static generateAuditSummaryNotes(
    eventCount: number,
    lifecycleState: string,
    boundaryAcknowledged: boolean
  ): string[] {
    const notes: string[] = [];
    notes.push(`Audit Ledger: ${eventCount} event(s) recorded. Lifecycle: [${lifecycleState.toUpperCase()}]`);
    if (!boundaryAcknowledged) {
      notes.push('WARNING: Operator has not yet acknowledged NO-FLASH / NO-C2 / NO-EXECUTION boundaries.');
    }
    if (lifecycleState === 'draft') {
      notes.push('Proposal is in DRAFT state. Review and authorization pending.');
    } else if (lifecycleState === 'archived') {
      notes.push('Proposal has been archived. No further action required.');
    }
    notes.push('ENFORCED: Audit records are observational evidence only.');
    return notes;
  }

  /**
   * Generates training scenario guidance notes.
   */
  static generateTrainingNotes(scenarioId: string | null): string[] {
    const notes: string[] = [];
    if (!scenarioId) {
      notes.push('No training scenario active. Select a scenario to begin operator familiarization.');
      return notes;
    }
    notes.push(`Training Scenario [${scenarioId}] active.`);
    notes.push('Review all checklist items and boundary acknowledgments before marking complete.');
    notes.push('REMINDER: Training scenarios are separate from production proposal authority.');
    return notes;
  }

  /**
   * Generates replay review notes for the operator.
   */
  static generateReplayReviewNotes(
    totalFrames: number,
    totalEvents: number,
    staleCount: number,
    rejectedCount: number,
    simulatedCount: number
  ): string[] {
    const notes: string[] = [];
    notes.push(`Replay Session: ${totalFrames} frame(s), ${totalEvents} event(s).`);
    if (staleCount > 0) {
      notes.push(`WARNING: ${staleCount} stale frame(s) detected. Data freshness cannot be guaranteed.`);
    }
    if (rejectedCount > 0) {
      notes.push(`CRITICAL: ${rejectedCount} rejected frame(s). Data integrity may be compromised.`);
    }
    if (simulatedCount > 0 && simulatedCount === totalFrames) {
      notes.push('All frames are SIMULATED. No observed hardware telemetry in this session.');
    }
    notes.push('ENFORCED: Replay is read-only. No command, control, or execution authority.');
    return notes;
  }

  /**
   * Generates timeline anomaly notes.
   */
  static generateTimelineAnomalyNotes(riskAnnotationCount: number): string[] {
    const notes: string[] = [];
    if (riskAnnotationCount === 0) {
      notes.push('Timeline review: No risk annotations detected.');
    } else {
      notes.push(`Timeline review: ${riskAnnotationCount} risk annotation(s) require operator attention.`);
      notes.push('Review each annotation before concluding replay session.');
    }
    return notes;
  }

  /**
   * Generates archive readiness notes.
   */
  static generateArchiveReadinessNotes(
    sectionsIncluded: number,
    totalSections: number,
    archiveGateVerdict: string,
    auditComplete: boolean,
    simulatedOnly: boolean
  ): string[] {
    const notes: string[] = [];
    notes.push(`ArcHive™ Manifest: ${sectionsIncluded}/${totalSections} sections included.`);
    if (sectionsIncluded < totalSections) {
      notes.push(`WARNING: ${totalSections - sectionsIncluded} section(s) missing from manifest.`);
    }
    if (!auditComplete) {
      notes.push('WARNING: Audit chain is incomplete. Some lifecycle events may be absent from archive.');
    }
    if (simulatedOnly) {
      notes.push('All telemetry data is SIMULATED. No observed hardware data in this archive.');
    }
    notes.push(`Archive Gate: ${archiveGateVerdict}`);
    notes.push('ENFORCED: Archived artifacts are evidence only. No execution authority is conferred.');
    return notes;
  }

  /**
   * Generates advisory notes regarding production cutover readiness and reality bridge boundaries.
   */
  static generateProductionReadinessNotes(
    productionGateVerdict: string,
    hasCryptographicIntegrity: boolean,
    hasSignature: boolean
  ): string[] {
    const notes: string[] = [];
    notes.push(`Production Gate Verdict: ${productionGateVerdict.replace(/_/g, ' ')}`);
    
    if (hasCryptographicIntegrity && hasSignature) {
      notes.push('Cryptographic chain verified. Artifact is structurally ready for reality bridge.');
    } else {
      notes.push('WARNING: Artifact lacks cryptographic integrity or ARC signature. Not production ready.');
    }

    notes.push('BOUNDARY ENFORCED: Reality Bridge is CONTROLLED/INACTIVE. No execution commands will be transmitted to physical hardware.');
    return notes;
  }

  /**
   * Generates advisory notes regarding BFI-Governed Flight Autonomy readiness.
   * PHASE 10.1: Governance Lock Pass additions.
   */
  static generateAutonomyReadinessNotes(
    flightMode: string,
    baneVerdict: string,
    teonActive: boolean,
    pilotInterruptAvailable: boolean,
    missionReady: boolean,
    authorityResolution?: { activeAuthority: string; reason: string; preemptionSource: string | null }
  ): string[] {
    const notes: string[] = [];
    notes.push(`Active Simulation Mode: ${flightMode.toUpperCase()}`);
    notes.push(`BANE Automation Gate: ${baneVerdict}`);

    if (authorityResolution) {
      notes.push(`CONTROL AUTHORITY: ${authorityResolution.activeAuthority} (${authorityResolution.reason})`);
      if (authorityResolution.preemptionSource) {
        notes.push(`PREEMPTION: Active control seized by [${authorityResolution.preemptionSource}]`);
      }
    }
    
    if (teonActive) {
      notes.push('TEON Safety Envelope: ACTIVE (Hard enforcement enabled)');
    } else {
      notes.push('CRITICAL: TEON Safety Envelope: INACTIVE. ENFORCEMENT TRIGGER: System forced to TEON_SAFETY authority.');
    }

    if (pilotInterruptAvailable) {
      notes.push('Pilot Interrupt Protocol: AVAILABLE (IU takeover authorized)');
    } else {
      notes.push('CRITICAL: Pilot Interrupt Protocol: UNAVAILABLE. ENFORCEMENT: Automation blocked.');
    }

    if (missionReady) {
      notes.push('Mission Plan: VALIDATED. Ready for governed simulation.');
    } else {
      notes.push('Mission Plan: INVALID. BLOCKED TRANSITION: Cannot enter autonomous mode.');
    }

    notes.push('GOVERNANCE LOCK: Mandatory [anchor_hold] enforced between automation and manual takeover.');
    notes.push('LARI-ArcHive™ Binding: SCING context verified. Unbound external intents are rejected.');
    notes.push('ENFORCED: Phase 10.1 autonomy is SIMULATION ONLY. No hardware commands are generated.');
    return notes;
  }

  /**
   * Generates advisory notes regarding Physical Laboratory (PL) boundary readiness.
   * PHASE 11 / 11.1: Controlled Hardware Boundary Interface and Tightening.
   */
  static generatePlReadinessNotes(
    profileId: string,
    adapterStatus: string,
    banePlVerdict: string,
    isPlReady: boolean,
    hardwareStatus: { fcOnline: boolean; companionOnline: boolean; pilotInputAvailable: boolean }
  ): string[] {
    const notes: string[] = [];
    notes.push(`SCIMEGA™ PL Profile: ${profileId}`);
    notes.push(`Adapter Boundary Status: [${adapterStatus.toUpperCase()}]`);
    notes.push(`BANE PL Boundary Gate: ${banePlVerdict}`);

    if (adapterStatus !== 'simulated' && adapterStatus !== 'inert' && adapterStatus !== 'dry_link_only') {
      notes.push(`WARNING: Hardware boundary status [${adapterStatus.toUpperCase()}] is outside governed simulation posture.`);
    }

    if (hardwareStatus.fcOnline) {
      notes.push('Hardware Simulation: FC Online (Mock Heartbeat Active)');
    }
    
    if (hardwareStatus.pilotInputAvailable) {
      notes.push('Pilot Input Channel: Binding active (Mapped to PilotInterruptProtocol).');
    } else {
      notes.push('CRITICAL: No pilot input channel detected. Hardware readiness rejected.');
    }

    if (isPlReady) {
      notes.push('PL READINESS: Physical Laboratory boundary modeled and validated for simulation.');
    } else {
      notes.push('PL READINESS: BLOCKED. Boundary violations detected.');
    }

    notes.push('PHASE 11.1 TIGHTENING: Pilot interrupt and TEON safety signals bound to autonomy stack.');
    notes.push('HARDWARE BOUNDARY: SIMULATION ONLY. No serial/network commands authorize execution.');
    notes.push('C2 PATH ENFORCEMENT: No MAVLink/MSP transmission enabled in this phase.');
    return notes;
  }

  /**
   * Generates advisory notes regarding Dry-Link interface contracts.
   * PHASE 12: Dry-Link Interface Layer.
   */
  static generateDryLinkReadinessNotes(
    profileId: string,
    overallReadiness: string,
    contractCount: number,
    baneVerdict: string,
    reasons: string[]
  ): string[] {
    const notes: string[] = [];
    notes.push(`SCIMEGA™ Dry-Link Profile: ${profileId}`);
    notes.push(`Interface Contracts Loaded: ${contractCount}`);
    notes.push(`BANE Dry-Link Gate: ${baneVerdict}`);
    
    if (overallReadiness === 'dry_link_ready') {
      notes.push('DRY-LINK READINESS: Interface contracts verified and ready for potential activation mapping.');
    } else {
      notes.push(`DRY-LINK READINESS: ${overallReadiness.toUpperCase()}. Activation intent blocked.`);
    }

    reasons.forEach(r => {
      if (r.startsWith('CRITICAL')) {
        notes.push(`ENFORCEMENT: ${r}`);
      } else {
        notes.push(`ADVISORY: ${r}`);
      }
    });

    notes.push('DRY-LINK BOUNDARY: Activation-aware metadata only. NO HARDWARE CONNECTION.');
    notes.push('ENFORCED: All contracts are [isExecutionDisabled: true]. No I/O drivers loaded.');
    return notes;
  }
}

