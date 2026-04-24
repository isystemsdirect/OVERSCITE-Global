'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  LayoutPanelLeft,
  GitBranch,
  ChevronDown,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProjectManagerWorkspace } from '@/components/contractor/ProjectManagerWorkspace';
import { ProjectPlannerPanel } from '@/components/contractor/ProjectPlannerPanel';
import { ProjectIssuePanel } from '@/components/contractor/ProjectIssuePanel';
import {
  evaluateProjectState,
  clusterIssuesAndRisks,
  generateManagerialAdvisory,
} from '@/lib/services/lari-project-manager';
import {
  buildDependencyMap,
  evaluateCriticalPath,
} from '@/lib/services/lari-project-planner';
import type {
  ProjectExecutionContext,
  ProjectPlannerScenario,
} from '@/lib/contractor/project-manager-types';

// ═══════════════════════════════════════════════════════════════════════
// Mock Project Data — Simulated operational context
// ═══════════════════════════════════════════════════════════════════════

const MOCK_PROJECTS: ProjectExecutionContext[] = [
  {
    projectId: 'proj-alpha-001',
    projectName: 'Lakewood Commercial Inspection',
    contractorPartyId: 'party-001',
    workflowInstanceIds: ['wf-lk-001'],
    schedulerProposalIds: ['sp-lk-001', 'sp-lk-002'],
    phases: [
      {
        phaseId: 'ph-1',
        projectId: 'proj-alpha-001',
        phaseName: 'Site Assessment',
        phaseOrder: 1,
        status: 'completed',
        methodPhaseRefs: ['site-entry'],
        workPackages: [
          {
            packageId: 'wp-site-survey',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-1',
            title: 'Site Survey & Documentation',
            description: 'Initial site survey, photo capture, and baseline documentation.',
            assignedTradeClass: ['general'],
            requiredInspections: ['site-entry'],
            requiredPermits: [],
            dependsOn: [],
            schedulerPosture: 'approved_candidate',
            status: 'completed',
            estimatedStart: '2026-04-01',
            estimatedEnd: '2026-04-03',
          },
        ],
      },
      {
        phaseId: 'ph-2',
        projectId: 'proj-alpha-001',
        phaseName: 'Structural Inspection',
        phaseOrder: 2,
        status: 'active',
        methodPhaseRefs: ['structural-assessment'],
        workPackages: [
          {
            packageId: 'wp-foundation',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-2',
            title: 'Foundation Assessment',
            description: 'Concrete foundation inspection, crack mapping, and structural integrity evaluation.',
            assignedTradeClass: ['structural'],
            assignedSubcontractorId: 'sub-77',
            requiredInspections: ['foundation-visual', 'foundation-load'],
            requiredPermits: ['permit-structural-001'],
            dependsOn: ['wp-site-survey'],
            schedulerPosture: 'approved_candidate',
            status: 'in_progress',
            estimatedStart: '2026-04-05',
            estimatedEnd: '2026-04-12',
          },
          {
            packageId: 'wp-framing',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-2',
            title: 'Framing & Load Path Verification',
            description: 'Verify framing members, connections, and load path continuity.',
            assignedTradeClass: ['structural', 'framing'],
            requiredInspections: ['framing-nailing', 'shearwall'],
            requiredPermits: [],
            dependsOn: ['wp-foundation'],
            schedulerPosture: 'advisory_candidate',
            status: 'not_started',
            estimatedStart: '2026-04-14',
            estimatedEnd: '2026-04-20',
          },
        ],
      },
      {
        phaseId: 'ph-3',
        projectId: 'proj-alpha-001',
        phaseName: 'MEP Systems',
        phaseOrder: 3,
        status: 'not_started',
        methodPhaseRefs: ['mep-assessment'],
        workPackages: [
          {
            packageId: 'wp-electrical',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-3',
            title: 'Electrical Rough-In Inspection',
            description: 'Verify electrical routing, panel capacity, and code compliance.',
            assignedTradeClass: ['electrical'],
            requiredInspections: ['electrical-rough'],
            requiredPermits: ['permit-electrical-001'],
            dependsOn: ['wp-framing'],
            schedulerPosture: 'restricted',
            status: 'not_started',
            estimatedStart: '2026-04-22',
            estimatedEnd: '2026-04-28',
          },
          {
            packageId: 'wp-plumbing',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-3',
            title: 'Plumbing Top-Out Inspection',
            description: 'Verify plumbing waste/vent/supply routing and pressure test.',
            assignedTradeClass: ['plumbing'],
            requiredInspections: ['plumbing-topout'],
            requiredPermits: ['permit-plumbing-001'],
            dependsOn: ['wp-framing'],
            schedulerPosture: 'advisory_candidate',
            status: 'not_started',
            estimatedStart: '2026-04-22',
            estimatedEnd: '2026-04-26',
          },
          {
            packageId: 'wp-hvac',
            projectId: 'proj-alpha-001',
            phaseId: 'ph-3',
            title: 'HVAC Rough-In Inspection',
            description: 'Duct routing, equipment placement, and refrigerant line verification.',
            assignedTradeClass: ['hvac'],
            requiredInspections: ['hvac-rough'],
            requiredPermits: [],
            dependsOn: ['wp-framing'],
            schedulerPosture: 'blocked',
            status: 'blocked',
            estimatedStart: '2026-04-24',
            estimatedEnd: '2026-04-30',
          },
        ],
      },
    ],
    issues: [
      {
        issueId: 'iss-001',
        projectId: 'proj-alpha-001',
        category: 'weather_impact',
        severity: 'high',
        title: 'Severe weather advisory — potential site delay',
        description: 'NOAA weather advisory indicates sustained high winds exceeding 30mph through April 25. Outdoor structural inspection may be impacted.',
        inspectorLens: {
          siteConditionRealism: 'constrained',
          evidenceReadiness: 'partial',
          complianceExposure: 'low',
          weatherAccessConstraints: 'restricted',
          fieldPracticality: 'moderate',
          qualityRisk: 'moderate',
          verificationBurden: 'moderate',
          inspectionSequenceDefensibility: 'adequate',
        },
        affectedPackageIds: ['wp-framing', 'wp-hvac'],
        raisedBy: 'SmartSCHEDULER™',
        raisedAt: '2026-04-20T14:00:00Z',
        status: 'open',
      },
      {
        issueId: 'iss-002',
        projectId: 'proj-alpha-001',
        category: 'vendor_delay',
        severity: 'moderate',
        title: 'HVAC equipment delivery delayed',
        description: 'Vendor confirmed 5-day delivery delay on HVAC condensing units. Blocking HVAC rough-in.',
        inspectorLens: {
          siteConditionRealism: 'clear',
          evidenceReadiness: 'complete',
          complianceExposure: 'none',
          weatherAccessConstraints: 'clear',
          fieldPracticality: 'low',
          qualityRisk: 'low',
          verificationBurden: 'light',
          inspectionSequenceDefensibility: 'adequate',
        },
        affectedPackageIds: ['wp-hvac'],
        raisedBy: 'Inspector Anderson',
        raisedAt: '2026-04-19T10:00:00Z',
        status: 'acknowledged',
      },
      {
        issueId: 'iss-003',
        projectId: 'proj-alpha-001',
        category: 'permit_delay',
        severity: 'critical',
        title: 'Electrical permit pending AHJ review',
        description: 'Authority Having Jurisdiction has not yet approved electrical permit. Work cannot begin without permit.',
        inspectorLens: {
          siteConditionRealism: 'clear',
          evidenceReadiness: 'insufficient',
          complianceExposure: 'high',
          weatherAccessConstraints: 'clear',
          fieldPracticality: 'low',
          qualityRisk: 'none',
          verificationBurden: 'heavy',
          inspectionSequenceDefensibility: 'weak',
        },
        affectedPackageIds: ['wp-electrical'],
        raisedBy: 'Inspector Anderson',
        raisedAt: '2026-04-18T09:00:00Z',
        status: 'open',
      },
    ],
    artifactBindings: [],
    operatingMode: 'active',
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-04-20T14:00:00Z',
    managedBy: 'Inspector Anderson',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════════════════════════════════

export default function ProjectManagerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].projectId);
  const [activeMode, setActiveMode] = useState<'manager' | 'planner'>('manager');

  const context = useMemo(
    () => MOCK_PROJECTS.find(p => p.projectId === selectedProjectId) || MOCK_PROJECTS[0],
    [selectedProjectId]
  );

  // Run engines
  const stateEval = useMemo(() => evaluateProjectState(context), [context]);
  const riskClusters = useMemo(() => clusterIssuesAndRisks(context), [context]);
  const advisories = useMemo(
    () => generateManagerialAdvisory(context, stateEval, riskClusters),
    [context, stateEval, riskClusters]
  );
  const depMap = useMemo(() => buildDependencyMap(context), [context]);
  const criticalPath = useMemo(
    () => evaluateCriticalPath(context, depMap),
    [context, depMap]
  );

  // Scenarios — placeholder (would come from user-driven generation)
  const scenarios: ProjectPlannerScenario[] = [];

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      <PageHeader
        title="Project Manager"
        status="live"
        guidanceId="project-manager"
        description="Governed project operations workspace. LARI-ProjectManager™ handles state interpretation, issue coordination, and managerial advisories. LARI-ProjectPlanner™ handles sequencing, dependencies, and scenario modeling. All consequential mutations are BANE-gated."
      />

      {/* Command Bar */}
      <div className="flex items-center gap-3 px-8 py-3 border-b border-white/5">
        {/* Project Selector */}
        <div className="relative">
          <select
            id="project-selector"
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white/80 text-xs font-bold rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-indigo-500/30 cursor-pointer"
          >
            {MOCK_PROJECTS.map(p => (
              <option key={p.projectId} value={p.projectId} className="bg-neutral-900">
                {p.projectName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <button
            id="mode-manager"
            onClick={() => setActiveMode('manager')}
            className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeMode === 'manager'
                ? 'bg-indigo-500/15 text-indigo-300 border-r border-indigo-500/20'
                : 'text-white/30 hover:text-white/50 border-r border-white/10'
            }`}
          >
            <LayoutPanelLeft className="w-3 h-3" />
            Manager
          </button>
          <button
            id="mode-planner"
            onClick={() => setActiveMode('planner')}
            className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeMode === 'planner'
                ? 'bg-indigo-500/15 text-indigo-300'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            <GitBranch className="w-3 h-3" />
            Planner
          </button>
        </div>

        {/* Health Indicator */}
        <div className={`ml-auto px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
          stateEval.overallHealth === 'healthy' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
          stateEval.overallHealth === 'at_risk' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
          'text-red-400 border-red-500/20 bg-red-500/5'
        }`}>
          {stateEval.overallHealth}
        </div>
      </div>

      {/* Main Layout — Workspace + Intelligence Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Workspace */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <ProjectManagerWorkspace
            mode={activeMode}
            context={context}
            advisories={advisories}
            riskClusters={riskClusters}
          />
        </div>

        {/* Right Intelligence Panel */}
        <aside className="w-80 border-l border-white/10 bg-white/[0.01] overflow-y-auto p-4 scrollbar-hide shrink-0">
          {activeMode === 'manager' ? (
            <ProjectIssuePanel
              issues={context.issues}
              riskClusters={riskClusters}
              onEscalate={(issueId) => {
                // BANE-gated — would invoke evaluateProjectIssueEscalation
                console.log(`[BANE] Issue escalation requested: ${issueId}`);
              }}
            />
          ) : (
            <ProjectPlannerPanel
              scenarios={scenarios}
              criticalPathIds={criticalPath.criticalPathIds}
              dependencyCount={depMap.edges.length}
              orphanedPackageCount={depMap.orphanedPackages.length}
            />
          )}
        </aside>
      </div>

      {/* Bottom Audit Strip */}
      <div className="px-8 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/15 font-mono">
        <span>Project: {context.projectId} | Mode: {activeMode} | Issues: {context.issues.length} | Packages: {context.phases.flatMap(p => p.workPackages).length}</span>
        <span>LARI-ProjectManager™ + LARI-ProjectPlanner™ | BANE-Gated | Advisory Only</span>
      </div>
    </div>
  );
}
