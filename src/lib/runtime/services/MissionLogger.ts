/**
 * @classification OVERSCITE_INTEGRATION
 * @engine MISSION_LOGGER
 * @purpose Extracts the BANE ledger and active session metrics to produce exportable, compliance-ready mission reports for the OVERSCITE platform.
 */

import { BaneLedger } from '../core/BaneLedger';
import { UniversalRuntimeState } from '../core/ScingularRuntimeEngine';
import { ArcIdentity } from '../../auth/ArcIdentityContext';

export interface MissionReport {
  missionId: string;
  generatedAt: string;
  operator: ArcIdentity | null;
  runtimeStateSnapshot: Partial<UniversalRuntimeState<any>>;
  baneAuditTrace: ReturnType<typeof BaneLedger.readLedger>;
  integrityHash: string;
}

export class MissionLogger {
  public static generateMissionReport(
    currentState: UniversalRuntimeState<any>,
    operator: ArcIdentity | null
  ): MissionReport {
    const trace = BaneLedger.readLedger();
    const generatedAt = new Date().toISOString();
    const missionId = `MSN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // A real system would use a cryptographic library here
    const integrityInput = `${missionId}|${generatedAt}|${operator?.arcId || 'UNBOUND'}|${trace.length}`;
    const integrityHash = `OVS-INT-${this.simpleHash(integrityInput)}`;

    return {
      missionId,
      generatedAt,
      operator,
      runtimeStateSnapshot: {
        domain: currentState.domain,
        isConnected: currentState.isConnected,
        isActiveOrArmed: currentState.isActiveOrArmed,
        actuationPosture: currentState.actuationPosture,
        telemetry: currentState.telemetry
      },
      baneAuditTrace: trace,
      integrityHash
    };
  }

  public static exportToOverscite(report: MissionReport) {
    if (typeof window === 'undefined') return;
    
    // Simulate API push to OVERSCITE Global
    console.log('[OVERSCITE INTEGRATION] Exporting Mission Report to canonical backend:', report);
    
    // Fallback: Download as a JSON file for the operator
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `OVERSCITE_MISSION_${report.missionId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }
}
