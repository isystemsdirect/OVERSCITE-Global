import React from 'react';
import Image from 'next/image';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AiSearchDialog } from "@/components/ai-search-dialog";
import { ScingGPT } from '@/components/ScingGPT';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCw, Expand, Shrink, Bell, Mic } from "lucide-react";

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
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/30 bg-background/50 backdrop-blur-lg px-4 lg:px-6 w-full shadow-sm">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex items-center gap-4 border-r border-border/50 pr-4 mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl text-primary hover:bg-primary/10 scing-border-glow p-0 overflow-hidden"
              >
                <Image 
                  src="/Scing_ButtonIcon_White.svg" 
                  alt="Scing Hands-Free" 
                  width={24} 
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                <span className="sr-only">Toggle Hands-Free Mode</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hands-Free Mode</p>
              <p className="text-xs text-muted-foreground">Activate SCINGULAR voice command layer.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {userId && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ScingGPT 
                    userId={userId} 
                    accessKey={process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY || "dummy_key_for_development"} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Scing™ BFI</p>
                <p className="text-xs text-muted-foreground">Activate the Bona Fide Intelligence layer.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex-1 flex items-center gap-2">
        <AiSearchDialog />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
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
