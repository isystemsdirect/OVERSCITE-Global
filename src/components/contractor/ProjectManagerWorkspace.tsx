'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  TrendingUp,
  Eye,
  MapPin,
  FileText,
} from 'lucide-react';
import type {
  ProjectExecutionContext,
  ProjectManagerAdvisory,
  ProjectRiskCluster,
  InspectorLensAxes,
} from '@/lib/contractor/project-manager-types';

// ═══════════════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════════════

interface ProjectManagerWorkspaceProps {
  mode: 'manager' | 'planner';
  context: ProjectExecutionContext;
  advisories: ProjectManagerAdvisory[];
  riskClusters: ProjectRiskCluster[];
}

// ═══════════════════════════════════════════════════════════════════════
// Health Indicator
// ═══════════════════════════════════════════════════════════════════════

const healthColors: Record<string, string> = {
  healthy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  at_risk: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  blocked: 'text-red-500 bg-red-500/15 border-red-500/30',
};

const healthLabels: Record<string, string> = {
  healthy: 'Healthy',
  at_risk: 'At Risk',
  critical: 'Critical',
  blocked: 'Blocked',
};

// ═══════════════════════════════════════════════════════════════════════
// Inspector Lens Display
// ═══════════════════════════════════════════════════════════════════════

function InspectorLensCard({ lens }: { lens: InspectorLensAxes }) {
  const axes = [
    { label: 'Site Conditions', value: lens.siteConditionRealism },
    { label: 'Evidence', value: lens.evidenceReadiness },
    { label: 'Compliance', value: lens.complianceExposure },
    { label: 'Weather/Access', value: lens.weatherAccessConstraints },
    { label: 'Field Practicality', value: lens.fieldPracticality },
    { label: 'Quality Risk', value: lens.qualityRisk },
    { label: 'Verification', value: lens.verificationBurden },
    { label: 'Sequence Defensibility', value: lens.inspectionSequenceDefensibility },
  ];

  function axisColor(value: string): string {
    const good = ['clear', 'complete', 'none', 'high', 'light', 'strong'];
    const warn = ['constrained', 'partial', 'low', 'moderate', 'advisory', 'adequate'];
    if (good.includes(value)) return 'text-emerald-400';
    if (warn.includes(value)) return 'text-amber-400';
    return 'text-red-400';
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
      {axes.map(a => (
        <div key={a.label} className="flex items-center justify-between text-[11px]">
          <span className="text-white/40 font-medium">{a.label}</span>
          <span className={`font-bold uppercase tracking-wide ${axisColor(a.value)}`}>
            {a.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export function ProjectManagerWorkspace({
  mode,
  context,
  advisories,
  riskClusters,
}: ProjectManagerWorkspaceProps) {
  const allPackages = context.phases.flatMap(p => p.workPackages);
  const blockedPackages = allPackages.filter(wp => wp.status === 'blocked');
  const activePhases = context.phases.filter(p => p.status === 'active');
  const completedPhases = context.phases.filter(p => p.status === 'completed');

  // Derive health from context
  const criticalIssues = context.issues.filter(i => i.severity === 'critical' && (i.status === 'open' || i.status === 'acknowledged'));
  const health = criticalIssues.length > 0 ? 'critical' : (blockedPackages.length > 0 ? 'at_risk' : 'healthy');

  if (mode === 'planner') {
    return (
      <div className="space-y-6">
        <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">
          LARI-ProjectPlanner™ — Sequencing Workspace
        </div>
        <div className="p-8 border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md text-center">
          <TrendingUp className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-sm text-white/50">
            Switch to Planner mode to view dependency graphs, critical path analysis,
            and scenario modeling. Use the Planner Panel for advisory details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">
          LARI-ProjectManager™ — Operational Workspace
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${healthColors[health]}`}>
          {healthLabels[health]}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Phases', value: activePhases.length, icon: Clock },
          { label: 'Completed', value: completedPhases.length, icon: CheckCircle2 },
          { label: 'Blocked Packages', value: blockedPackages.length, icon: AlertTriangle },
          { label: 'Open Issues', value: context.issues.filter(i => i.status === 'open').length, icon: Shield },
        ].map(metric => (
          <div
            key={metric.label}
            className="p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-3.5 h-3.5 text-white/20" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">{metric.label}</span>
            </div>
            <div className="text-2xl font-black text-white/80">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Advisories */}
      {advisories.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
            <Eye className="w-3 h-3" />
            Active Advisories
          </div>
          {advisories.map(advisory => (
            <div
              key={advisory.advisoryId}
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {advisory.type === 'risk_alert' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {advisory.type === 'state_summary' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                  {advisory.type === 'approval_required' && <Shield className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-xs font-bold text-white/80">{advisory.title}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  advisory.baneReviewPosture === 'ALLOW' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                  advisory.baneReviewPosture === 'REQUIRE_OVERRIDE' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                  'text-red-400 border-red-500/20 bg-red-500/5'
                }`}>
                  {advisory.baneReviewPosture}
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">{advisory.content}</p>
              <div className="text-[9px] text-white/20 font-mono">
                Impact: {advisory.impactSummary}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk Clusters with Inspector Lens */}
      {riskClusters.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            Inspector-Lens Risk Assessment
          </div>
          {riskClusters.slice(0, 3).map(cluster => (
            <div
              key={cluster.clusterId}
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/80">{cluster.clusterName}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  cluster.peakSeverity === 'critical' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                  cluster.peakSeverity === 'high' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                  'text-white/40 border-white/10 bg-white/5'
                }`}>
                  {cluster.peakSeverity}
                </span>
              </div>
              <p className="text-[11px] text-white/40">{cluster.impactSummary}</p>
              <InspectorLensCard lens={cluster.compositeAssessment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
