/**
 * BANE-Watcher — Defender Normalizer
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { SecurityEvent, SecuritySeverity, SourceClass } from '@/types/security-event';
import { DefenderSignal } from '../adapters/windows-defender';
import { TruthState } from '@/types/truth-state';

export const defenderNormalizer = {
  /**
   * Normalizes a Windows Defender signal into a canonical SecurityEvent.
   */
  normalize(signal: DefenderSignal): SecurityEvent {
    // 1) Severity Mapping
    const severityMap: Record<DefenderSignal['severity_level'], SecuritySeverity> = {
      'Low': 'info',
      'Moderate': 'warning',
      'High': 'elevated',
      'Severe': 'critical'
    };

    // 2) Canonical Event Creation
    return {
      id: signal.id,
      source: signal.source,
      type: `${signal.source}_event_${signal.event_id}`,
      severity: severityMap[signal.severity_level] || 'info',
      truthState: 'normalized' as TruthState,
      trust: {
        sourceReliability: 0.85, // Pre-defined for Defender
        verified: true,
        sourceClass: 'os' as SourceClass
      },
      timestamp: signal.timestamp,
      deviceId: signal.device_id,
      payload: {
        threatName: signal.threat_name,
        actionTaken: signal.action_taken,
        rawTelemetry: signal.raw_payload ? JSON.parse(signal.raw_payload) : null
      }
    };
  }
};
