'use client';

import RepoSwitcher from './RepoSwitcher';
import FileTree from './FileTree';
import FileDetails from './FileDetails';
import Toolbar from './Toolbar';
import Breadcrumbs from './Breadcrumbs';
import { PLATFORM_VERSION, CHANNEL_TAG } from "@/lib/version";

export default function OverHUDExplorer() {
  return (
    <div className="p-4 h-full flex flex-col font-mono text-sm gap-4">
      <div className="flex-shrink-0 flex justify-between items-center border-b border-white/10 pb-2 mb-2">
         <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">OVERSCITE OS</span>
         <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm">v{PLATFORM_VERSION} [{CHANNEL_TAG}]</span>
      </div>
      <div className="flex-shrink-0">
        <RepoSwitcher />
      </div>
      <div className="flex-shrink-0">
        <Toolbar />
      </div>
      <div className="flex-shrink-0">
        <Breadcrumbs />
      </div>
      <div className="flex-1 min-h-0 border-y border-border/30 py-2">
        <FileTree />
      </div>
      <div className="flex-shrink-0">
        <FileDetails />
      </div>
    </div>
  );
}
