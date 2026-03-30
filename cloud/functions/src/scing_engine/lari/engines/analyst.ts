/**
 * LARI Analyst Engine
 *
 * Core reasoning engine responsible for pattern interrogation, anomaly surfacing,
 * and deep evidence weighting. Interrogates but does not authorize.
 *
 * Authority: UTCB Track E
 */

import type { LariPipelineRequest, LariPipelineFinding, LariStageTrace } from '../contracts';
import { ContextEnrichment } from './context';

export interface AnalystResult {
  findings: LariPipelineFinding[];
  trace: LariStageTrace;
}

export function runAnalystEngine(
  req: LariPipelineRequest,
  contextFindings: ContextEnrichment[],
  rawCaptures?: any[]
): AnalystResult {
  const startMs = Date.now();
  const findings: LariPipelineFinding[] = [];

  // Analyze raw captures
  if (rawCaptures && rawCaptures.length > 0) {
    for (const cap of rawCaptures) {
      if (cap.type === 'telemetry' && cap.data.z_axis_oscillation > 15) {
        findings.push({
          id: `ana_vibe_${cap.id}`,
          title: 'Vibration/Oscillation Outlier',
          description: `Z-Axis oscillation of ${cap.data.z_axis_oscillation} exceeds safety threshold of 15.0. Potential bearing wear.`,
          confidence: 0.95,
          source: 'analyst' as any,
        });
      }
      if (cap.type === 'sensor' && cap.data.sat_count < 8) {
        findings.push({
          id: `ana_gps_${cap.id}`,
          title: 'GPS Signal Degradation',
          description: `Satellite count dropped to ${cap.data.sat_count} in ${cap.data.location}. Multipath risk high.`,
          confidence: 0.88,
          source: 'analyst' as any,
        });
      }
      if (cap.type === 'document' && cap.data.error) {
        findings.push({
          id: `ana_err_${cap.id}`,
          title: 'Frontend Runtime Error',
          description: `Detected ${cap.data.error} in ${cap.data.file}. Missing import of ${cap.data.symbol}.`,
          confidence: 1.0,
          source: 'analyst' as any,
        });
      }
    }
  }

  const trace: LariStageTrace = {
    engineId: 'LARI-ANALYST',
    stage: 'analysis',
    durationMs: Date.now() - startMs,
    inputSummary: `Analyzing ${rawCaptures?.length || 0} raw capture records for anomalies.`,
    outputSummary: `Generated ${findings.length} analytical findings based on raw SRT evidence.`,
  };

  return { findings, trace };
}
