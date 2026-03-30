/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * Multimodal input surface for the Scing Panel. Supports text, voice, and
 * multimodal triggers (file, image). Routes input through dual-mode logic:
 *   - Conversational: natural responses via Scing conversation engine
 *   - Operational: execution-gated actions via BANE
 *
 * @role_lock
 * This component serves conversation + command entry only.
 * Must NOT render monitoring content, alert feeds, or system status.
 */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, Paperclip, ImagePlus, Mic, Volume2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScingPanel } from '@/lib/scing/scing-panel-state';
import { routeCommandIntent } from '@/lib/scing/command-intent-router';
import { evaluateBANEExecutionGate } from '@/lib/bane/scing-execution-gate';
import {
  ConversationEntry,
  generateConversationalResponse,
  shouldRouteOperational,
} from '@/lib/scing/scing-conversation-engine';

const promptSchema = z.object({
  query: z.string().min(1, 'Enter a message or command.'),
});

export function ScingPromptInput() {
  const { toast } = useToast();
  const {
    isHandsFreeEnabled, setHandsFreeEnabled,
    setScingPanelActive,
    setDetectedExecutionTrigger,
    scingMode, setScingMode,
    conversationHistory,
    addConversationEntry,
    isScingThinking, setScingThinking,
  } = useScingPanel();

  const [panelMode, setPanelMode] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [isGovernedAutonomy, setIsGovernedAutonomy] = useState(false);
  const recognitionRef = useRef<any>(null);

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: { query: '' },
  });

  // Watch input value to toggle Active Trim signal
  const activeValue = form.watch('query');
  useEffect(() => {
    setScingPanelActive(
      activeValue.length > 0 ||
      panelMode === 'listening' ||
      panelMode === 'processing' ||
      isHandsFreeEnabled
    );
  }, [activeValue, panelMode, isHandsFreeEnabled, setScingPanelActive]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          form.setValue('query', transcript);
          handleSubmit({ query: transcript });
        }
      };

      recognitionRef.current.onerror = () => setPanelMode('idle');
      recognitionRef.current.onend = () => {
        if (panelMode === 'listening') setPanelMode('idle');
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(values: z.infer<typeof promptSchema>) {
    const userInput = values.query.trim();
    form.reset();
    setPanelMode('processing');
    setScingThinking(true);

    // Add user entry to conversation
    const userEntry: ConversationEntry = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: new Date(),
      mode: scingMode,
    };
    addConversationEntry(userEntry);

    // ─── Dual-Mode Routing ───
    const isOperational = shouldRouteOperational(userInput);

    if (isOperational) {
      // Operational Path: Route through intent parser + BANE gate
      setScingMode('operational');
      const intent = routeCommandIntent(userInput);
      setDetectedExecutionTrigger(intent.trigger_audit.word || null);
      const gateDecision = evaluateBANEExecutionGate(intent);

      setTimeout(() => {
        let responseContent: string;

        if (!gateDecision.permitted) {
          responseContent = gateDecision.reason ||
            `I can't execute that without an approved trigger word. The action was classified as ${intent.inferred_tier}. Try rephrasing with an explicit execution command.`;
          toast({
            variant: 'destructive',
            title: 'Execution Blocked',
            description: gateDecision.reason,
          });
        } else {
          responseContent = intent.inferred_tier === 'TIER_3_EXECUTION'
            ? `Got it — executing with trigger '${intent.trigger_audit.word}'. Processing now...`
            : `Understood. I've staged that as ${intent.inferred_tier.replace(/_/g, ' ').toLowerCase()}. Ready when you are.`;
        }

        const scingEntry: ConversationEntry = {
          id: `scing-${Date.now()}`,
          role: 'scing',
          content: responseContent,
          timestamp: new Date(),
          mode: 'operational',
        };
        addConversationEntry(scingEntry);
        setPanelMode('idle');
        setScingThinking(false);
      }, 800);

    } else {
      // Conversational Path: Natural language response
      setScingMode('conversational');

      setTimeout(() => {
        const response = generateConversationalResponse(userInput, {
          entries: conversationHistory,
          currentRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
          sessionStartedAt: conversationHistory[0]?.timestamp || new Date(),
        });

        const scingEntry: ConversationEntry = {
          id: `scing-${Date.now()}`,
          role: 'scing',
          content: response.content,
          timestamp: new Date(),
          mode: 'conversational',
        };
        addConversationEntry(scingEntry);
        setPanelMode('idle');
        setScingThinking(false);
      }, 600 + Math.random() * 600); // Natural-feeling response latency
    }
  }

  function handleMicClick() {
    if (!recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Not Supported' });
      return;
    }
    if (panelMode === 'listening') {
      recognitionRef.current.stop();
      setPanelMode('idle');
    } else {
      try {
        recognitionRef.current.start();
        setPanelMode('listening');
      } catch {
        setPanelMode('idle');
      }
    }
  }

  return (
    <div className="border-t border-border/10 px-4 py-3 space-y-2 bg-black/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Talk to Scing..."
                    className="rounded-lg border-border/20 bg-black/30 w-full focus-visible:ring-primary/40 focus:border-primary/40 text-sm placeholder:text-muted-foreground/40"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={panelMode !== 'idle'}
            className="rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/20 text-primary h-10 w-10 shrink-0"
          >
            {panelMode === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </Form>

      {/* Multimodal Action Bar */}
      <div className="flex items-center gap-1 justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-muted-foreground" onClick={() => toast({ title: 'Pending' })}>
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-muted-foreground" onClick={() => toast({ title: 'Pending' })}>
            <ImagePlus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg hover:bg-white/5", panelMode === 'listening' ? "text-red-400 animate-pulse bg-red-400/10" : "text-muted-foreground")} onClick={handleMicClick}>
            <Mic className="h-3.5 w-3.5" />
          </Button>

          <div className="w-px h-4 bg-border/20 mx-1" />

          <Button variant="ghost" size="sm" className={cn("h-8 rounded-lg text-[10px] uppercase gap-1.5", isHandsFreeEnabled ? "text-primary bg-primary/10 border border-primary/20" : "text-muted-foreground")} onClick={() => setHandsFreeEnabled(!isHandsFreeEnabled)}>
            <Volume2 className="h-3 w-3" />
            <span className="hidden sm:inline">Hands-Free</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Indicator */}
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all",
            scingMode === 'conversational'
              ? "text-sky-400/70 bg-sky-400/5 border border-sky-400/10"
              : "text-amber-400/70 bg-amber-400/5 border border-amber-400/10"
          )}>
            {scingMode === 'conversational'
              ? <><Sparkles className="h-2.5 w-2.5" /> Chat</>
              : <><Zap className="h-2.5 w-2.5" /> Ops</>
            }
          </div>

          <Button variant="ghost" size="sm" className={cn("h-8 rounded-lg text-[10px] uppercase gap-1.5", isGovernedAutonomy ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-muted-foreground")} onClick={() => setIsGovernedAutonomy(!isGovernedAutonomy)}>
            <ShieldCheck className="h-3 w-3" />
            <span className="hidden sm:inline">Governed</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
