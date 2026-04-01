'use client';

import React from 'react';

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUIDANCE_REGISTRY } from '@/lib/guidance/guidance-registry';
import { useScingPanel } from '@/lib/scing/scing-panel-state';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SplashCard } from './SplashCard';

interface GuidanceHintProps {
  guidanceId: string;
  className?: string;
}

export function GuidanceHint({ guidanceId, className }: GuidanceHintProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const entry = GUIDANCE_REGISTRY[guidanceId];
  const { isScingPanelExpanded, setScingPanelExpanded } = useScingPanel();

  // We check if injectPrompt exists (it will be added in the next step to scing-panel-state)
  // Casting to any to avoid TS errors before state file is updated
  const scingState = useScingPanel() as any;

  if (!entry) return null;

  const handleAskScing = () => {
    setIsOpen(false);
    if (!isScingPanelExpanded) {
      setScingPanelExpanded(true);
    }
    
    // Slight delay to allow panel to open before injecting text
    setTimeout(() => {
      if (typeof scingState.injectPrompt === 'function') {
        scingState.injectPrompt(entry.scingPrompt);
      }
    }, 100);
  };

  const IconTriggerContent = () => (
    <div className={cn(
      "flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer",
      className
    )}>
      <Info className="w-3.5 h-3.5" />
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <IconTriggerContent />
            </PopoverTrigger>
          </TooltipTrigger>
          {/* Tooltip visible only on hover, hides when popover opens */}
          {!isOpen && (
            <TooltipContent side="bottom" align="center" className="max-w-[280px] p-3 border-white/10 bg-black/80 backdrop-blur-md">
              <p className="text-xs text-white/90 leading-relaxed font-medium">{entry.tooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <PopoverContent 
        side="bottom" 
        align="start" 
        alignOffset={-10}
        sideOffset={12} 
        className="w-[360px] p-0 border-none bg-transparent shadow-none"
      >
        <SplashCard entry={entry} onAskScing={handleAskScing} />
      </PopoverContent>
    </Popover>
  );
}
