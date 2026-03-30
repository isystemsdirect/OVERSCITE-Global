"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ConversationEntry, generateGreeting } from './scing-conversation-engine';

/**
 * @classification STATE_MANAGEMENT
 * @authority Director
 * @status IMPLEMENTED
 * @version 2.0.0
 *
 * @purpose
 * Context provider for the Scing Panel, managing expansion state,
 * conversational history, interaction mode, and execution governance state.
 *
 * @version_note
 * V2: Extended to support full conversational presence — session-scoped
 * conversation history, mode switching, and thinking state for response
 * generation indicators.
 */

export type ScingMode = 'conversational' | 'operational';

interface ScingPanelState {
  // ─── Panel Chrome ───
  isScingPanelExpanded: boolean;
  setScingPanelExpanded: (expanded: boolean) => void;
  toggleScingPanel: () => void;

  isScingPanelActive: boolean;
  setScingPanelActive: (active: boolean) => void;

  // ─── Conversational State (V2) ───
  scingMode: ScingMode;
  setScingMode: (mode: ScingMode) => void;

  conversationHistory: ConversationEntry[];
  addConversationEntry: (entry: ConversationEntry) => void;
  clearConversation: () => void;

  isScingThinking: boolean;
  setScingThinking: (thinking: boolean) => void;

  // ─── Voice & Multimodal ───
  isHandsFreeEnabled: boolean;
  setHandsFreeEnabled: (enabled: boolean) => void;

  // ─── Execution Governance ───
  detectedExecutionTrigger: string | null;
  setDetectedExecutionTrigger: (trigger: string | null) => void;

  pendingExecutionIntent: any | null;
  setPendingExecutionIntent: (intent: any | null) => void;
}

const ScingPanelStateContext = createContext<ScingPanelState | undefined>(undefined);

export function useScingPanel() {
  const context = useContext(ScingPanelStateContext);
  if (!context) {
    throw new Error('useScingPanel must be used within a ScingPanelProvider');
  }
  return context;
}

export function ScingPanelProvider({ children }: { children: ReactNode }) {
  const [isScingPanelExpanded, setScingPanelExpanded] = useState(false);
  const [isScingPanelActive, setScingPanelActive] = useState(false);

  // Conversational state (V2)
  const [scingMode, setScingMode] = useState<ScingMode>('conversational');
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>(() => [
    generateGreeting(),
  ]);
  const [isScingThinking, setScingThinking] = useState(false);

  // Voice & multimodal
  const [isHandsFreeEnabled, setHandsFreeEnabled] = useState(false);

  // Execution governance
  const [detectedExecutionTrigger, setDetectedExecutionTrigger] = useState<string | null>(null);
  const [pendingExecutionIntent, setPendingExecutionIntent] = useState<any | null>(null);

  const toggleScingPanel = useCallback(() => {
    setScingPanelExpanded(prev => !prev);
  }, []);

  const addConversationEntry = useCallback((entry: ConversationEntry) => {
    setConversationHistory(prev => [...prev, entry]);
  }, []);

  const clearConversation = useCallback(() => {
    setConversationHistory([generateGreeting()]);
    setScingMode('conversational');
  }, []);

  return (
    <ScingPanelStateContext.Provider
      value={{
        isScingPanelExpanded,
        setScingPanelExpanded,
        toggleScingPanel,
        isScingPanelActive,
        setScingPanelActive,
        scingMode,
        setScingMode,
        conversationHistory,
        addConversationEntry,
        clearConversation,
        isScingThinking,
        setScingThinking,
        isHandsFreeEnabled,
        setHandsFreeEnabled,
        detectedExecutionTrigger,
        setDetectedExecutionTrigger,
        pendingExecutionIntent,
        setPendingExecutionIntent,
      }}
    >
      {children}
    </ScingPanelStateContext.Provider>
  );
}
