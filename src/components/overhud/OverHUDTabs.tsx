// src/components/overhud/OverHUDTabs.tsx
'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import LariRepoPanel from './lari-repo/LariRepoPanel';
import FileViewer from './lari-repo/FileViewer';
import ImageFindingOverlay from './lari-repo/ImageFindingOverlay';
import FindingReviewRail from './lari-repo/FindingReviewRail';
import NotesPanel from './lari-repo/NotesPanel';
import ApprovalsPanel from './lari-repo/ApprovalsPanel';
import LearningQueuePanel from './lari-repo/LearningQueuePanel';
import AuditPanel from './lari-repo/AuditPanel';

const TABS = [
  { key: 'repo', label: 'Repo', band: 'operational' },
  { key: 'viewer', label: 'Viewer', band: 'operational' },
  { key: 'overlay', label: 'Overlay', band: 'operational' },
  { key: 'findings', label: 'Findings', band: 'review' },
  { key: 'notes', label: 'Notes', band: 'review' },
  { key: 'approvals', label: 'Approvals', band: 'review' },
  { key: 'learning_queue', label: 'Learning Queue', band: 'governance' },
  { key: 'audit', label: 'Audit', band: 'governance' },
];

export default function OverHUDTabs() {
  const [activeTab, setActiveTab] = useState('repo');

  const renderContent = () => {
    switch (activeTab) {
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
      {/* Tab Navigation */}
      <div className="flex flex-col border-b border-border/30 bg-black/20">
        <div className="flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-3 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all flex-shrink-0",
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
            v1.0.01 // GOVERNED
        </div>
      </div>
    </div>
  );
}
