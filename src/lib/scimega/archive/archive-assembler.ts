/**
 * @classification ARCHIVE_ASSEMBLER
 * @authority ArcHive™ Packaging Layer
 * @purpose Assembles ArcHive™ manifest packages from SCIMEGA™ lifecycle artifacts.
 * @warning Does not mutate source data. Read-only collection and assembly only.
 */

import type { ArcHiveManifest, ArcHivePackage, ArcHiveComponentSection } from './archive-manifest-types';
import { ArchiveIntegrity } from './archive-integrity';
import { ArchiveSerializer } from './archive-serializer';
import { BaneArchiveGate } from './bane-archive-gate';
import { ScimegaAuditHash } from '../audit/scimega-audit-hash';

export class ArchiveAssembler {
  /**
   * Assembles a complete ArcHive™ package from SCIMEGA™ artifacts.
   * All inputs are consumed read-only.
   */
  static async assemble(options: {
    proposalId: string;
    buildId: string;
    arcId: string;
    aircraftClass: string;
    version: string;
    hasBuildProfile: boolean;
    hasCapabilityMap: boolean;
    hasMethodCompatibility: boolean;
    hasSchedulerPosture: boolean;
    hasBaneVerdict: boolean;
    hasArcAuthorization: boolean;
    hasTerminalSimulation: boolean;
    hasTelemetryReplay: boolean;
    hasAuditChain: boolean;
    auditEventCount: number;
    auditChainRoot: string;
    auditChainTip: string;
    arcAuthorized: boolean;
    hardwareMutationAuthorized: boolean;
  }): Promise<ArcHivePackage> {
    const sections: ArcHiveComponentSection[] = [
      { sectionId: 'SEC-BUILD', sectionName: 'Build Profile', included: options.hasBuildProfile, contentSummary: 'Aircraft class, hardware map, and DOS manifest', artifactCount: options.hasBuildProfile ? 1 : 0 },
      { sectionId: 'SEC-CAP', sectionName: 'Capability Map', included: options.hasCapabilityMap, contentSummary: 'Payload, range, flight time, and stability class', artifactCount: options.hasCapabilityMap ? 1 : 0 },
      { sectionId: 'SEC-METHOD', sectionName: 'Method Compatibility', included: options.hasMethodCompatibility, contentSummary: 'Method-to-capability evaluation results', artifactCount: options.hasMethodCompatibility ? 1 : 0 },
      { sectionId: 'SEC-SCHED', sectionName: 'Scheduler Posture', included: options.hasSchedulerPosture, contentSummary: 'SmartSCHEDULER™ readiness and posture', artifactCount: options.hasSchedulerPosture ? 1 : 0 },
      { sectionId: 'SEC-BANE', sectionName: 'BANE Verdicts', included: options.hasBaneVerdict, contentSummary: 'Deployment and proposal gate results', artifactCount: options.hasBaneVerdict ? 1 : 0 },
      { sectionId: 'SEC-ARC', sectionName: 'ARC Authorization', included: options.hasArcAuthorization, contentSummary: 'Human identity verification and signing gate', artifactCount: options.hasArcAuthorization ? 1 : 0 },
      { sectionId: 'SEC-TERM', sectionName: 'Terminal Simulation', included: options.hasTerminalSimulation, contentSummary: 'Non-executing CLI command scripts', artifactCount: options.hasTerminalSimulation ? 1 : 0 },
      { sectionId: 'SEC-REPLAY', sectionName: 'Telemetry Replay', included: options.hasTelemetryReplay, contentSummary: 'Read-only telemetry session summary', artifactCount: options.hasTelemetryReplay ? 1 : 0 },
      { sectionId: 'SEC-AUDIT', sectionName: 'Audit Chain', included: options.hasAuditChain, contentSummary: 'Simulation audit event ledger', artifactCount: options.auditEventCount }
    ];

    const manifestId = `ARCHIVE-${Date.now()}`;
    const contentHash = ScimegaAuditHash.generate(
      sections.map(s => s.sectionId).join('|'),
      new Date().toISOString(),
      options.proposalId,
      ScimegaAuditHash.GENESIS_HASH
    );

    const integrity = await ArchiveIntegrity.generate(
      manifestId,
      options.auditChainRoot || ScimegaAuditHash.GENESIS_HASH,
      options.auditChainTip || ScimegaAuditHash.GENESIS_HASH,
      options.auditEventCount,
      contentHash
    );

    const manifest: ArcHiveManifest = {
      manifestId,
      version: options.version,
      versionState: 'draft',
      proposalId: options.proposalId,
      buildId: options.buildId,
      arcId: options.arcId,
      aircraftClass: options.aircraftClass,
      createdAt: new Date().toISOString(),
      sections,
      integrity,
      boundaryDeclarations: [
        'NO EXECUTION — This archive contains no executable content.',
        'NO HARDWARE WRITE — No firmware flashing or device mutation is authorized.',
        'NO C2 — No command-and-control pathways exist in this package.'
      ],
      metadata: {
        generator: 'SCIMEGA™ ArcHive™ Assembler v1.0',
        phase: 'Phase 8',
        format: 'ArcHive™ Configuration Manifest'
      }
    };

    const gateResult = BaneArchiveGate.evaluate(
      manifest,
      options.arcAuthorized,
      options.hardwareMutationAuthorized,
      options.hasAuditChain
    );

    const serializedContent = ArchiveSerializer.serialize(manifest);

    return {
      manifest,
      serializedContent,
      archiveGateVerdict: gateResult.verdict,
      archiveGateReasons: gateResult.reasons
    };
  }
}
