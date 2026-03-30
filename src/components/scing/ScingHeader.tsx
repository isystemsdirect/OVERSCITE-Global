'use client';

import React from 'react';
import { useScingPanel } from '@/lib/scing/scing-panel-state';
import { MOCK_THREADS } from './ActiveThreadsList';
import { X, Sparkles, Zap, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * Header for the Scing Panel drop surface. Shows active thread context,
 * Scing presence indicator (alive/thinking), and mode display.
 *
 * @role_lock
 * Conversation + control only. No monitoring content.
 */
export function ScingHeader() {
  const {
    toggleScingPanel,
    scingMode,
    isScingThinking,
    clearConversation,
  } = useScingPanel();

  const currentThread = MOCK_THREADS[0];

  return (
    <div className="flex items-center justify-between px-6 py-4 scing-panel-divide">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-primary/90 tracking-wide">
          {currentThread.title}
        </h2>
        <div className="flex items-center gap-3">
          {/* Scing Presence Indicator */}
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "flex h-1.5 w-1.5 rounded-full transition-colors",
              isScingThinking
                ? "bg-amber-400 animate-pulse"
                : "bg-emerald-400 animate-[pulse_3s_ease-in-out_infinite]"
            )} />
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
              {isScingThinking ? 'Thinking...' : 'Scing is here'}
            </span>
          </div>

          <div className="w-px h-3 bg-border/20" />

          {/* Mode badge */}
          <div className={cn(
            "flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full transition-all",
            scingMode === 'conversational'
              ? "text-sky-400/70 bg-sky-400/5 border border-sky-400/10"
              : "text-amber-400/70 bg-amber-400/5 border border-amber-400/10"
          )}>
            {scingMode === 'conversational'
              ? <><Sparkles className="h-2.5 w-2.5" /> Conversation</>
              : <><Zap className="h-2.5 w-2.5" /> Operational</>
            }
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Clear conversation */}
        <Button
          variant="ghost"
          size="icon"
          onClick={clearConversation}
          className="h-7 w-7 rounded-md hover:bg-white/5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          aria-label="Clear conversation"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>

        {/* Close panel */}
        <button
          onClick={toggleScingPanel}
          className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
