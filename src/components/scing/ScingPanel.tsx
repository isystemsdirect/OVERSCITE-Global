'use client';

import React, { useRef, useEffect } from 'react';
import { useScingPanel } from '@/lib/scing/scing-panel-state';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Bot, Sparkles } from 'lucide-react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { ActiveThreadsList } from './ActiveThreadsList';
import { ScingHeader } from './ScingHeader';
import { ScingPromptInput } from './ScingPromptInput';

/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * The Singular Scing Panel — a live assistant interaction surface supporting
 * both natural conversation and command mediation. Scing is the human-facing
 * conversational presence of the SCINGULAR system.
 *
 * The header bar sits in-flow within the TopCommandBar. When expanded, the
 * content drops down as an absolute-positioned panel beneath the bar,
 * escaping the parent overflow constraints.
 *
 * @role_lock
 * ALLOWED: Casual conversation, context-aware dialogue, memory-aware responses,
 * multi-turn reasoning, assistant presence behavior, suggestions, insights,
 * task execution requests, workflow assistance, command routing, action confirmation.
 *
 * PROHIBITED: BANE alert feeds, security threat cards, system integrity dashboards,
 * passive monitoring panels, defender/event streams, repo/system status stacks.
 * Those belong in OverHUD (governance/awareness surface).
 */
export function ScingPanel() {
  const {
    isScingPanelExpanded,
    toggleScingPanel,
    isScingPanelActive,
    conversationHistory,
    isScingThinking,
    scingMode,
  } = useScingPanel();

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory, isScingThinking]);

  // Click-outside close
  useEffect(() => {
    if (!isScingPanelExpanded) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('#scing-unified-panel') || target.closest('#scing-bar-trigger')) {
        return;
      }
      toggleScingPanel();
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        toggleScingPanel();
      }
    }
    
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 10);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isScingPanelExpanded, toggleScingPanel]);

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50 flex flex-col items-center">
      {/* ─── The Scing Bar (Always Visible, In-Flow) ─── */}
      <button
        id="scing-bar-trigger"
        onClick={toggleScingPanel}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-300",
          "scing-panel-root",
          isScingPanelActive && "scing-panel-active",
          isScingPanelExpanded
            ? "bg-primary/10 border border-primary/30 shadow-[0_0_20px_rgba(245,194,66,0.12)]"
            : "bg-background/30 border border-border/30 hover:bg-background/50 hover:border-primary/20"
        )}
        style={{
          boxShadow: isScingPanelExpanded
            ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 16px rgba(245, 194, 66, 0.1)'
            : '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}
        aria-expanded={isScingPanelExpanded}
        aria-haspopup="dialog"
      >
        {/* Logo */}
        <div className="shrink-0 w-6 h-6 relative">
          <Image
            src="/Scing_ButtonIcon_White.svg"
            alt="Scing"
            width={24}
            height={24}
            className={cn(
              "w-full h-full object-contain transition-all duration-300",
              isScingPanelExpanded && "drop-shadow-[0_0_8px_rgba(245,194,66,0.6)]"
            )}
          />
        </div>

        <span className={cn(
          "text-sm font-bold tracking-[0.15em] uppercase transition-colors duration-300",
          (isScingPanelExpanded || isScingPanelActive) ? "text-primary" : "text-muted-foreground"
        )}>
          SCING
        </span>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center" onClick={e => e.stopPropagation()}>
          <WorkspaceSelector />
        </div>

        <div className="flex-1" />

        {/* Right Chevron & Status */}
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-300",
          isScingPanelExpanded ? "text-primary/70" : "text-muted-foreground/50"
        )}>
          <span className="hidden sm:inline">
            {isScingPanelExpanded ? 'Engaged' : 'Ready'}
          </span>
          {isScingPanelExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* ─── The Drop Panel (Absolute, Drops Below Bar) ─── */}
      <AnimatePresence initial={false}>
        {isScingPanelExpanded && (
            <motion.div
            id="scing-unified-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "flex flex-col",
              "rounded-xl border border-border/30",
              "bg-background/80 backdrop-blur-md",
              "shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]",
              "overflow-hidden"
            )}
            style={{ 
              transformOrigin: 'top center',
              maxHeight: 'calc(100vh - 100px)',
            }}
          >
            <ScingHeader />
            
            <div className="flex flex-1 min-h-[40vh] max-h-[60vh] overflow-hidden">
              <ActiveThreadsList />

              <div className="flex flex-col flex-1 min-w-0 bg-black/10">
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {conversationHistory.map(entry => (
                    <div key={entry.id} className={cn("flex gap-3", entry.role === 'user' ? "justify-end" : "justify-start")}>
                      {entry.role === 'scing' && (
                        <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                          {entry.mode === 'operational'
                            ? <Bot className="h-3.5 w-3.5 text-primary" />
                            : <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                          }
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed",
                        entry.role === 'scing'
                          ? "bg-white/5 border border-white/10 text-white/90"
                          : "bg-primary/10 border border-primary/20 text-white"
                      )}>
                        {entry.content}
                        <div className={cn(
                          "text-[9px] font-mono mt-1.5 uppercase tracking-wider",
                          entry.role === 'scing' ? "text-muted-foreground/40" : "text-primary/40"
                        )}>
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {isScingThinking && (
                    <div className="flex gap-3 justify-start">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                        <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                
                <ScingPromptInput />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
