'use client';

import React from 'react';
import {
  GitBranch,
  Route,
  Cloud,
  Compass,
  ArrowRightLeft,
  Timer,
} from 'lucide-react';
import type {
  ProjectPlannerScenario,
  InspectorLensAxes,
} from '@/lib/contractor/project-manager-types';

// ═══════════════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════════════

interface ProjectPlannerPanelProps {
  scenarios: ProjectPlannerScenario[];
  criticalPathIds: string[];
  dependencyCount: number;
  orphanedPackageCount: number;
}

// ═══════════════════════════════════════════════════════════════════════
// Inspector Lens Mini
// ═══════════════════════════════════════════════════════════════════════

function LensMini({ lens }: { lens: InspectorLensAxes }) {
  const critical = [
    lens.complianceExposure === 'high',
    lens.qualityRisk === 'high',
    lens.siteConditionRealism === 'impractical',
    lens.weatherAccessConstraints === 'blocked',
  ].filter(Boolean).length;

  const color = critical > 0 ? 'text-red-400' : 'text-emerald-400';
  const label = critical > 0 ? `${critical} critical axis` : 'Clear';

  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export function ProjectPlannerPanel({
  scenarios,
  criticalPathIds,
  dependencyCount,
  orphanedPackageCount,
}: ProjectPlannerPanelProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">
        Planner Intelligence
      </div>

      {/* Dependency Summary */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <GitBranch className="w-3 h-3" />
          Dependencies
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="text-lg font-black text-white/70">{dependencyCount}</div>
            <div className="text-[9px] text-white/25 uppercase tracking-wider font-bold">Edges</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="text-lg font-black text-white/70">{orphanedPackageCount}</div>
            <div className="text-[9px] text-white/25 uppercase tracking-wider font-bold">Orphaned</div>
          </div>
        </div>
      </div>

      {/* Critical Path */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <Route className="w-3 h-3" />
          Critical Path
        </div>
        <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="text-lg font-black text-white/70">{criticalPathIds.length}</div>
          <div className="text-[9px] text-white/25 uppercase tracking-wider font-bold mb-2">Nodes on Path</div>
          {criticalPathIds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {criticalPathIds.slice(0, 6).map(id => (
                <span
                  key={id}
                  className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300/60 border border-indigo-500/10 font-mono"
                >
                  {id.length > 12 ? `${id.slice(0, 12)}…` : id}
                </span>
              ))}
              {criticalPathIds.length > 6 && (
                <span className="text-[8px] text-white/20 px-1.5 py-0.5">
                  +{criticalPathIds.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <Compass className="w-3 h-3" />
          Scenarios
        </div>

        {scenarios.length === 0 ? (
          <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center">
            <p className="text-[11px] text-white/30">No scenarios generated yet</p>
          </div>
        ) : (
          scenarios.map(scenario => (
            <div
              key={scenario.scenarioId}
              className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/70">{scenario.scenarioName}</span>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                  scenario.publishState === 'published' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                  scenario.publishState === 'under_review' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                  'text-white/30 border-white/10 bg-white/5'
                }`}>
                  {scenario.publishState}
                </span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">{scenario.hypothesis}</p>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-white/25">
                  <Timer className="w-2.5 h-2.5" />
                  {scenario.estimatedDurationDays}d
                </div>
                <div className="flex items-center gap-1 text-white/25">
                  <ArrowRightLeft className="w-2.5 h-2.5" />
                  {scenario.resequencingProposals.length} resequence(s)
                </div>
                <LensMini lens={scenario.inspectorLens} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Weather/Routing Exposure */}
      <div className="space-y-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider font-bold flex items-center gap-1.5">
          <Cloud className="w-3 h-3" />
          Environmental Exposure
        </div>
        <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
          <p className="text-[10px] text-white/30 leading-relaxed">
            Environmental and routing pressure data is sourced from SmartSCHEDULER™.
            Active constraints will surface when scheduler proposals are bound.
          </p>
        </div>
      </div>

      {/* Engine Lineage */}
      <div className="p-3 border-t border-white/5 text-[9px] text-white/15 font-mono text-center">
        LARI-ProjectPlanner™ — Advisory Only
      </div>
    </div>
  );
}
