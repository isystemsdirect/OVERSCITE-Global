/**
 * @classification SHELL_STATE_PROVIDER
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Single source of truth for shell geometry, OverHUD expansion state,
 * and Scing drop-panel state. All shell regions (header, notification bar,
 * main canvas, OverHUD) derive their layout from this context.
 *
 * @architectural_note
 * This provider replaces ad-hoc local state in app-shell.tsx and ensures
 * coherent shell reflow when OverHUD expands or collapses. It does NOT
 * govern Sidebar state (that remains with ShadCN SidebarProvider).
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { WorkSPACE, WorkspaceContextType, WorkspaceStatus } from '@/types/workspace';

// ─── Shell Layout State Contract ─────────────────────────────────────────────

interface ShellLayoutState {
  /** Whether the OverHUD right-side intelligence panel is open */
  isOverHUDOpen: boolean;
  /** Toggle OverHUD open/closed */
  toggleOverHUD: () => void;
  /** Set OverHUD open state explicitly */
  setOverHUDOpen: (open: boolean) => void;

  /** 
   * @deprecated Use ScingPanelProvider.isScingPanelExpanded instead.
   * Whether the Scing drop panel is currently visible 
   */
  isScingDropped: boolean;
  /** 
   * @deprecated Use ScingPanelProvider.toggleScingPanel instead.
   * Toggle Scing drop panel open/closed 
   */
  toggleScingDrop: () => void;
  /** 
   * @deprecated Use ScingPanelProvider.setScingPanelExpanded instead.
   * Set Scing drop panel state explicitly 
   */
  setScingDropped: (dropped: boolean) => void;

  /** Current OverHUD width in pixels (0 when closed, 420 when open) */
  overHUDWidth: number;

  // ─── SCINGULAR Prime Intelligence & App-binding State ──────────────────────────────────────────
  
  /** App-bindings are always active in the OVERSCITE governed command paradigm */
  isAppBindingActive: boolean;
  
  /** The currently active WorkSPACE container ID */
  activeWorkspaceId: string | null;
  /** Change the active WorkSPACE */
  setActiveWorkspaceId: (id: string | null) => void;

  /** The currently active conversational Thread ID within the WorkSPACE */
  activeThreadId: string | null;
  /** Change the active Thread */
  setActiveThreadId: (id: string | null) => void;

  /** Governed list of workspaces */
  workspaces: WorkSPACE[];
  /** Mechanism to dispatch new WorkSPACEs to state (mock phase) */
  addWorkspace: (ws: WorkSPACE) => void;
}

const OVERHUD_WIDTH_OPEN = 420;
const OVERHUD_WIDTH_CLOSED = 0;

// ─── Context ─────────────────────────────────────────────────────────────────

const ShellLayoutContext = createContext<ShellLayoutState | undefined>(undefined);

export function useShellLayout(): ShellLayoutState {
  const context = useContext(ShellLayoutContext);
  if (!context) {
    throw new Error('useShellLayout must be used within a ShellLayoutProvider');
  }
  return context;
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface ShellLayoutProviderProps {
  children: ReactNode;
  /** Initial OverHUD open state (default: false) */
  defaultOverHUDOpen?: boolean;
}

const INITIAL_WORKSPACES: WorkSPACE[] = [
  {
    workspace_id: 'ws_alpha',
    name: 'Global Command Center',
    description: 'Primary global orchestration environment',
    context_type: 'GLOBAL',
    created_at: new Date(),
    updated_at: new Date(),
    owner: 'system',
    linked_entities: [],
    status: 'active',
  },
  {
    workspace_id: 'ws_beta',
    name: 'Inspection OS-G_VER_S1',
    description: 'Active inspection verification workflow',
    context_type: 'INSPECTION',
    context_id: 'insp_1042',
    created_at: new Date(),
    updated_at: new Date(),
    owner: 'system',
    linked_entities: ['insp_1042'],
    status: 'active',
  },
  {
    workspace_id: 'ws_gamma',
    name: 'Strategy & Directives',
    description: 'Executive directive planning container',
    context_type: 'GLOBAL',
    created_at: new Date(),
    updated_at: new Date(),
    owner: 'system',
    linked_entities: [],
    status: 'active',
  },
];

export function ShellLayoutProvider({
  children,
  defaultOverHUDOpen = false,
}: ShellLayoutProviderProps) {
  const [isOverHUDOpen, setOverHUDOpen] = useState(defaultOverHUDOpen);
  const [isScingDropped, setScingDropped] = useState(false);
  
  // SCINGULAR Prime Intelligence Mode Details
  const isAppBindingActive = true; // Governed constraint: App-binding is always active
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>('ws_alpha');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  const [workspaces, setWorkspaces] = useState<WorkSPACE[]>(INITIAL_WORKSPACES);

  const addWorkspace = useCallback((ws: WorkSPACE) => {
    setWorkspaces((prev) => [...prev, ws]);
  }, []);

  const toggleOverHUD = useCallback(() => {
    setOverHUDOpen(prev => !prev);
  }, []);

  const toggleScingDrop = useCallback(() => {
    setScingDropped(prev => !prev);
  }, []);

  const overHUDWidth = isOverHUDOpen ? OVERHUD_WIDTH_OPEN : OVERHUD_WIDTH_CLOSED;

  const value = useMemo<ShellLayoutState>(() => ({
    isOverHUDOpen,
    toggleOverHUD,
    setOverHUDOpen,
    isScingDropped,
    toggleScingDrop,
    setScingDropped,
    overHUDWidth,
    isAppBindingActive,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activeThreadId,
    setActiveThreadId,
    workspaces,
    addWorkspace,
  }), [
    isOverHUDOpen,
    isScingDropped,
    overHUDWidth,
    // isAgentActive removed from dependencies - not found in scope
    activeWorkspaceId,
    activeThreadId,
    workspaces,
    addWorkspace,
    toggleOverHUD,
    toggleScingDrop
  ]);

  return (
    <ShellLayoutContext.Provider value={value}>
      {children}
    </ShellLayoutContext.Provider>
  );
}
