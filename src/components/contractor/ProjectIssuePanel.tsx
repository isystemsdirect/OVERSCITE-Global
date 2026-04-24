'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import type {
  ProjectIssuePacket,
  ProjectRiskCluster,
  InspectorLensAxes,
  IssueSeverity,
} from '@/lib/contractor/project-manager-types';

// ═══════════════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════════════

interface ProjectIssuePanelProps {
  issues: ProjectIssuePacket[];
  riskClusters: ProjectRiskCluster[];
  onEscalate?: (issueId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════
// Severity Styling
// ═══════════════════════════════════════════════════════════════════════

const severityConfig: Record<IssueSeverity, { color: string; icon: React.ElementType; label: string }> = {
  critical: { color: 'text-red-400 border-red-500/20 bg-red-500/5', icon: AlertTriangle, label: 'Critical' },
  high: { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: AlertCircle, label: 'High' },
  moderate: { color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5', icon: AlertCircle, label: 'Moderate' },
  low: { color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', icon: Info, label: 'Low' },
  informational: { color: 'text-white/30 border-white/10 bg-white/5', icon: Info, label: 'Info' },
};

// ═══════════════════════════════════════════════════════════════════════
// Inspector Lens Axis Display
// ═══════════════════════════════════════════════════════════════════════

function AxisRating({ label, value }: { label: string; value: string }) {
  const good = ['clear', 'complete', 'none', 'high', 'light', 'strong'];
  const warn = ['constrained', 'partial', 'low', 'moderate', 'advisory', 'adequate'];
  const color = good.includes(value) ? 'bg-emerald-500/20' : warn.includes(value) ? 'bg-amber-500/20' : 'bg-red-500/20';

  return (
    <div className="flex items-center justify-between text-[9px]">
      <span className="text-white/30">{label}</span>
      <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${color} text-white/60`}>
        {value}
      </span>
    </div>
  );
}

function InspectorLensDetail({ lens }: { lens: InspectorLensAxes }) {
  return (
    <div className="space-y-1 mt-2 pt-2 border-t border-white/5">
      <div className="text-[8px] text-white/20 uppercase tracking-widest font-bold mb-1">Inspector Lens</div>
      <AxisRating label="Site" value={lens.siteConditionRealism} />
      <AxisRating label="Evidence" value={lens.evidenceReadiness} />
      <AxisRating label="Compliance" value={lens.complianceExposure} />
      <AxisRating label="Weather" value={lens.weatherAccessConstraints} />
      <AxisRating label="Field" value={lens.fieldPracticality} />
      <AxisRating label="Quality" value={lens.qualityRisk} />
      <AxisRating label="Verification" value={lens.verificationBurden} />
      <AxisRating label="Sequence" value={lens.inspectionSequenceDefensibility} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export function ProjectIssuePanel({
  issues,
  riskClusters,
  onEscalate,
}: ProjectIssuePanelProps) {
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [showClusters, setShowClusters] = useState(true);

  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'acknowledged' || i.status === 'escalated');
  const resolvedIssues = issues.filter(i => i.status === 'resolved' || i.status === 'mitigated');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">
          Issues & Risks
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/20 font-bold">{openIssues.length} open</span>
          <span className="text-[10px] text-white/10 font-bold">{resolvedIssues.length} resolved</span>
        </div>
      </div>

      {/* Risk Clusters */}
      {riskClusters.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowClusters(!showClusters)}
            className="flex items-center gap-1.5 text-[10px] text-white/25 uppercase tracking-wider font-bold hover:text-white/40 transition-colors"
          >
            <Shield className="w-3 h-3" />
            Risk Clusters ({riskClusters.length})
            {showClusters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showClusters && riskClusters.map(cluster => (
            <div
              key={cluster.clusterId}
              className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/60">{cluster.clusterName}</span>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                  severityConfig[cluster.peakSeverity].color
                }`}>
                  {cluster.peakSeverity}
                </span>
              </div>
              <p className="text-[10px] text-white/30">{cluster.impactSummary}</p>
              <div className="text-[9px] text-white/15">{cluster.issueIds.length} issue(s)</div>
            </div>
          ))}
        </div>
      )}

      {/* Issue List */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          Open Issues
        </div>

        {openIssues.length === 0 ? (
          <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center">
            <p className="text-[11px] text-white/30">No open issues</p>
          </div>
        ) : (
          openIssues.map(issue => {
            const config = severityConfig[issue.severity];
            const SeverityIcon = config.icon;
            const isExpanded = expandedIssueId === issue.issueId;

            return (
              <div
                key={issue.issueId}
                className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIssueId(isExpanded ? null : issue.issueId)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SeverityIcon className={`w-3.5 h-3.5 shrink-0 ${config.color.split(' ')[0]}`} />
                    <span className="text-[11px] font-bold text-white/60 truncate">{issue.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${config.color}`}>
                      {config.label}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2">
                    <p className="text-[10px] text-white/40 leading-relaxed">{issue.description}</p>

                    <div className="flex items-center gap-3 text-[9px] text-white/20">
                      <span>Category: <strong className="text-white/40">{issue.category.replace(/_/g, ' ')}</strong></span>
                      <span>By: <strong className="text-white/40">{issue.raisedBy}</strong></span>
                    </div>

                    {issue.affectedPackageIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.affectedPackageIds.map(id => (
                          <span key={id} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/25 border border-white/5 font-mono">
                            {id.length > 16 ? `${id.slice(0, 16)}…` : id}
                          </span>
                        ))}
                      </div>
                    )}

                    <InspectorLensDetail lens={issue.inspectorLens} />

                    {/* Escalation control — BANE-gated */}
                    {issue.status !== 'escalated' && onEscalate && (
                      <button
                        onClick={() => onEscalate(issue.issueId)}
                        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        Escalate (BANE Review)
                      </button>
                    )}

                    {issue.status === 'escalated' && (
                      <div className="text-[9px] text-amber-400/60 font-bold uppercase tracking-wider mt-1">
                        ⚡ Escalated — Awaiting Review
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Engine Lineage */}
      <div className="p-3 border-t border-white/5 text-[9px] text-white/15 font-mono text-center">
        LARI-ProjectManager™ — Issue Intelligence
      </div>
    </div>
  );
}
