'use client';

import RepoSwitcher from './RepoSwitcher';
import FileTree from './FileTree';
import FileDetails from './FileDetails';
import Toolbar from './Toolbar';
import Breadcrumbs from './Breadcrumbs';
import FilePreview from './FilePreview';
import { Separator } from '@/components/ui/separator';

export default function OverHUDExplorer() {
  return (
    <div className="p-4 h-full flex flex-col font-mono text-sm gap-4">
      {/* --- TOP CONTROLS (always visible) --- */}
      <div className="flex-shrink-0 space-y-4">
        <RepoSwitcher />
        <Toolbar />
        <Breadcrumbs />
      </div>

      <Separator className="bg-border/30" />

      {/* --- SPLIT VIEW --- */}
      <div className="flex-1 min-h-0 grid grid-rows-2 gap-4">
        
        {/* Top Half: Image Preview */}
        <div className="row-span-1 min-h-0 relative border rounded-md">
          <FilePreview />
        </div>

        {/* Bottom Half: File Explorer Tree & Details */}
        <div className="row-span-1 min-h-0 grid grid-cols-3 gap-4">
          <div className="col-span-2 border rounded-md p-2">
            <FileTree />
          </div>
          <div className="col-span-1 border rounded-md p-3">
            <FileDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
