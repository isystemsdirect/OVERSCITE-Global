/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * Top shell command bar — hosts the Scing command bar (anchored, not modal),
 * BFI toggle, and utility actions. The Scing bar + drop panel are shell-native.
 *
 * @refactor_note
 * V2.1.0: Finalized 'Scing Singularity' refactor. Replaced 
 * ScingBar + ScingDropPanel with a single, layout-stable ScingPanel.
 * The center slot now renders the unified transforming surface.
 */

import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScingPanel } from '@/components/scing/ScingPanel';
import { Button } from "@/components/ui/button";
import { RefreshCw, Expand, Shrink, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopCommandBarProps {
  userId?: string | null;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
  handleRefresh?: () => void;
}

export function TopCommandBar({
  userId,
  isFullScreen,
  toggleFullScreen,
  handleRefresh
}: TopCommandBarProps) {
  return (
    <header className="shell-surface sticky top-0 z-30 flex h-20 items-center border-b border-border/30 px-4 lg:px-6 w-full shadow-sm overflow-visible">
      {/* ─── Left Group: Sidebar Trigger ─── */}
      <div className="flex items-center gap-2 shrink-0">
        <SidebarTrigger className="md:hidden" />
      </div>

      {/* ─── Center: Scing Command Bar (shell-anchored, not modal) ─── */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <ScingPanel />
      </div>
      
      {/* ─── Right Group: Utility Actions ─── */}
      <div className="flex items-center gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/50" onClick={handleRefresh}>
                <RefreshCw className="h-5 w-5" />
                <span className="sr-only">Refresh Page</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/50" onClick={toggleFullScreen}>
                {isFullScreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                <span className="sr-only">{isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/50">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
              <p className="text-xs text-muted-foreground">View recent alerts and messages.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
