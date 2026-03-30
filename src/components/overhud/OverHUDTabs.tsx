/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.1.0
 *
 * @purpose
 * Tab-based content switcher for the OverHUD intelligence panel.
 * Partitioned into two governed zones:
 *   - Top Zone (SECURITY & GOVERNANCE): BANE notifications, system integrity, security signals
 *   - Bottom Zone (OPERATIONAL INTELLIGENCE): Repo, findings, audit, learning queue
 *
 * @role_lock
 * OverHUD is the dedicated BANE / LARI / system-awareness surface.
 * Must NOT contain Scing command/interaction content.
 * ALL monitoring content in the shell MUST exist here and nowhere else.
 */
// src/components/overhud/OverHUDTabs.tsx
'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Shield, Database } from 'lucide-react';
import LariRepoPanel from './lari-repo/LariRepoPanel';
import FileViewer from './lari-repo/FileViewer';
import ImageFindingOverlay from './lari-repo/ImageFindingOverlay';
import FindingReviewRail from './lari-repo/FindingReviewRail';
import NotesPanel from './lari-repo/NotesPanel';
import ApprovalsPanel from './lari-repo/ApprovalsPanel';
import LearningQueuePanel from './lari-repo/LearningQueuePanel';
import AuditPanel from './lari-repo/AuditPanel';
import { BANEWatcherLivePanel } from '../security/BANEWatcherLivePanel';

// ─── Top Zone: Security & Governance ─────────────────────────────────────────
const TOP_ZONE_TABS = [
  { key: 'bane', label: 'BANE', band: 'governance-bane' as const },
  { key: 'audit', label: 'Audit', band: 'governance' as const },
];

// ─── Bottom Zone: Operational Intelligence ───────────────────────────────────
const BOTTOM_ZONE_TABS = [
  { key: 'repo', label: 'Repo', band: 'operational' as const },
  { key: 'viewer', label: 'Viewer', band: 'operational' as const },
  { key: 'overlay', label: 'Overlay', band: 'operational' as const },
  { key: 'findings', label: 'Findings', band: 'review' as const },
  { key: 'notes', label: 'Notes', band: 'review' as const },
  { key: 'approvals', label: 'Approvals', band: 'review' as const },
  { key: 'learning_queue', label: 'Learning Queue', band: 'governance' as const },
];

const ALL_TABS = [...TOP_ZONE_TABS, ...BOTTOM_ZONE_TABS];

export default function OverHUDTabs() {
  const [activeTab, setActiveTab] = useState('bane');

  const renderContent = () => {
    switch (activeTab) {
      case 'bane': return <BANEWatcherLivePanel />;
      case 'repo': return <LariRepoPanel />;
      case 'viewer': return <FileViewer />;
      case 'overlay': return <ImageFindingOverlay />;
      case 'findings': return <FindingReviewRail />;
      case 'notes': return <NotesPanel />;
      case 'approvals': return <ApprovalsPanel />;
      case 'learning_queue': return <LearningQueuePanel />;
      case 'audit': return <AuditPanel />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-md border-l border-border/40">
      {/* Tab Navigation — Partitioned Zones */}
      <div className="flex flex-col border-b border-border/30 bg-black/20">

        {/* ─── Top Zone: Security & Governance ─── */}
        <div className="px-3 pt-2 pb-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="w-2.5 h-2.5 text-red-400/60" />
            <span className="text-[8px] font-mono text-red-400/40 uppercase tracking-[0.2em]">
              Security & Governance
            </span>
          </div>
          <div className="flex">
            {TOP_ZONE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-2 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all flex-shrink-0",
                  activeTab === tab.key 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5",
                  tab.band === 'governance-bane' && activeTab !== tab.key && "text-red-400/60 hover:text-red-400"
                )}
              >
                {tab.band === 'governance-bane' && (
                  <Shield className="inline-block w-3 h-3 mr-1.5 -mt-0.5" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zone Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent mx-3" />

        {/* ─── Bottom Zone: Operational Intelligence ─── */}
        <div className="px-3 pt-1.5 pb-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Database className="w-2.5 h-2.5 text-primary/40" />
            <span className="text-[8px] font-mono text-primary/30 uppercase tracking-[0.2em]">
              Operational Intelligence
            </span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar">
            {BOTTOM_ZONE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-2 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all flex-shrink-0",
                  activeTab === tab.key 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {/* Operational Footer */}
      <div className="p-2 border-t border-border/30 bg-black/40 flex justify-between items-center">
        <div className="flex gap-2">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Mode: Guided</span>
            <span className="text-[9px] font-mono text-primary animate-pulse uppercase">LARI ACTIVE</span>
        </div>
        <div className="text-[9px] font-mono text-muted-foreground opacity-50">
            v2.1.0 // GOVERNED
        </div>
      </div>
    </div>
  );
}
