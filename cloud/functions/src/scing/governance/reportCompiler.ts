/**
 * Scing Cloud Core — Report Compiler Engine (SCING-REPORT)
 *
 * Implements the truth-artifact compilation layer defined in Track H.
 * SCING-REPORT takes granular EngineFindings and other reasoning/domain
 * artifacts and compiles them into a structured report_blocks format 
 * suitable for the Scing interface to ingest and render.
 *
 * Canon: Scing is the interface presence. SCING-REPORT is the conduit
 * between backend intelligence (findings) and front-end explanation (blocks).
 * It relies on LARI-STANDARDS or BANE for validation before reaching here.
 *
 * Authority: UTCB Track H — Director Anderson, 2026-03-23
 */

import { EngineFinding, EngineVerdict, EngineTrace } from '../../scing_engine/engine/logicContracts';

// ---------------------------------------------------------------------------
// Report Block Data Contracts
// ---------------------------------------------------------------------------

export type ReportBlockType = 
  | 'executive_summary' 
  | 'finding_detail' 
  | 'audit_lineage' 
  | 'enforcement_action';

export interface ReportBlock {
  id: string;
  type: ReportBlockType;
  title: string;
  content: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
  references?: string[]; // IDs of source findings/traces
}

// ---------------------------------------------------------------------------
// Compiler Execution
// ---------------------------------------------------------------------------

export interface ReportCompilerRequest {
  traceId: string;
  findings: EngineFinding[];
  traces: EngineTrace[];
  verdicts?: EngineVerdict[];
  sessionContext?: Record<string, unknown>;
}

export interface ReportCompilerResult {
  engineId: 'SCING-REPORT';
  reportBlocks: ReportBlock[];
  compiledAt: string;
  traceId: string;
}

/**
 * Compiles a flat array of findings and verdicts into a structured,
 * interface-ready block list.
 */
export function compileScingReport(req: ReportCompilerRequest): ReportCompilerResult {
  const blocks: ReportBlock[] = [];

  // 1. Executive Summary Block (if there are findings)
  if (req.findings.length > 0) {
    const highestSeverity = req.findings.reduce((max, f) => {
      const tiers = { 'R1-low': 1, 'R2-medium': 2, 'R3-high': 3, 'R4-critical': 4, 'R5-system': 5 };
      const curTier = tiers[f.severity as keyof typeof tiers] || 1;
      const maxTier = tiers[max as keyof typeof tiers] || 1;
      return curTier > maxTier ? f.severity : max;
    }, 'R1-low' as string);

    blocks.push({
      id: `block_summary_${req.traceId}`,
      type: 'executive_summary',
      title: 'Execution Summary',
      content: `Compiled ${req.findings.length} findings across ${req.traces.length} engine invocations.`,
      severity: highestSeverity.includes('critical') ? 'critical' : 
                highestSeverity.includes('high') ? 'high' : 
                highestSeverity.includes('medium') ? 'medium' : 'low',
    });
  }

  // 2. Finding Details
  for (const finding of req.findings) {
    blocks.push({
      id: `block_finding_${finding.id}`,
      type: 'finding_detail',
      title: finding.title,
      content: finding.description,
      metadata: { sourceEngine: finding.sourceEngineId, confidence: finding.confidence },
      references: [finding.id],
    });
  }

  // 3. Enforcement Actions
  if (req.verdicts && req.verdicts.length > 0) {
    const denied = req.verdicts.filter(v => v.disposition === 'denied');
    if (denied.length > 0) {
      blocks.push({
        id: `block_enforcement_${req.traceId}`,
        type: 'enforcement_action',
        title: 'BANE Enforcement Triggered',
        content: `${denied.length} actions were halted by BANE boundaries.`,
        severity: 'critical',
        references: denied.map(v => v.issuedBy),
      });
    }
  }

  return {
    engineId: 'SCING-REPORT',
    reportBlocks: blocks,
    compiledAt: new Date().toISOString(),
    traceId: req.traceId,
  };
}
