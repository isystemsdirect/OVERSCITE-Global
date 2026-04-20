/**
 * DocuSCRIBE™ — Document Canvas
 *
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P1_FOUNDATION
 *
 * Central editing/viewing surface. Enforces authority class restrictions:
 * - draft_editable: full edit
 * - partial_edit: editable with locked-region visual indicator
 * - immutable_view_only: read-only display
 * - protected_log_view_only: read-only, never editable
 * - finalized_fork_only: read-only (placeholder — fork creates new draft)
 *
 * Design: Crisp text, high contrast, no glass/blur overlays on canvas.
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  Hash, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useDocuScribe } from '@/lib/docuscribe/context';
import { cn } from '@/lib/utils';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { AuthoringToolbar } from './AuthoringToolbar';
import { PageRenderer } from './PageRenderer';
import { HorizontalRuler } from './HorizontalRuler';
import { canEdit } from '@/lib/docuscribe/types';
import { DocumentOutline } from './DocumentOutline';
import { GovernancePanel } from './GovernancePanel';
import { ShareDialog } from './ShareDialog';

interface DocumentCanvasProps {
  document: DocuScribeDocument;
  onOpenFormulas: () => void;
  onOpenElements: () => void;
  onOpenExport: () => void;
}

export function DocumentCanvas({ 
  document, 
  onOpenFormulas,
  onOpenElements,
  onOpenExport
}: DocumentCanvasProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showGovernance, setShowGovernance] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [isConstrained, setIsConstrained] = useState(false);
  
  const { executeScingAction } = useDocuScribe();
  const deskRef = useRef<HTMLDivElement>(null);
  const editable = canEdit(document.authority_class);

  // Layout Excellence: Viewport Rescue Monitoring
  useEffect(() => {
    const checkConstraints = () => {
      const constrained = window.innerWidth < 1100; // Calibrated threshold for 816px + 280px sidebar
      setIsConstrained(constrained);
      // In rescue mode, we might want to force certain collapses,
      // but for now we let the layout yield.
    };
    
    checkConstraints();
    window.addEventListener('resize', checkConstraints);
    return () => window.removeEventListener('resize', checkConstraints);
  }, []);

  // Execute rich text commands
  const handleCommand = (command: string, value?: string) => {
    if (!editable || isPreview) return;
    window.document.execCommand(command, false, value);
  };

  const handleNavigate = (pageIndex: number, elementId: string) => {
    const selector = `[data-page="${pageIndex + 1}"]`;
    const target = deskRef.current?.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Standardized Excellence Timing
  const TRANSITION_BASE = "transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]";

  return (
    <div className={cn(
      "flex h-full relative overflow-hidden overflow-x-hidden", 
      TRANSITION_BASE,
      isPreview ? "bg-zinc-300" : "bg-black/60"
    )}>
      {/* ─── Background Suppression Layer (Ambient Shield) ─── */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
      {/* ─── Global Layout: Intelligence Rails ─── */}
      
      {/* Prime Dominance: Main Workstation Desk */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative h-full",
        TRANSITION_BASE
      )}>
        {/* ─── Toolbar & Toggles ─── */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
             {!isPreview && (
               <button 
                 onClick={() => setShowGovernance(!showGovernance)}
                 className={cn(
                  "p-2 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-zinc-300 hover:text-white shadow-2xl",
                  TRANSITION_BASE
                 )}
                 title="Toggle Structure Navigation"
               >
                 <Hash className="w-4 h-4" />
               </button>
             )}
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className={cn(
                "p-2 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 text-zinc-300 hover:text-white shadow-2xl",
                TRANSITION_BASE
              )}
              title={isPreview ? "Exit Preview" : "Print Preview"}
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {!isPreview && (
              <button 
                onClick={() => setShowGovernance(!showGovernance)}
                className={cn(
                  "p-2 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-zinc-300 hover:text-white shadow-2xl",
                  TRANSITION_BASE
                )}
                title="Toggle OverHUD Support"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ─── The Desk (Dynamic Center Execution) ─── */}
        <div 
          ref={deskRef}
          className={cn(
            "flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide docuscribe-desk pb-24 scroll-smooth flex flex-col items-center",
            TRANSITION_BASE,
            isPreview && "pt-12"
          )}
        >
          {/* Internal Wrapper to Center Page without Shrinking */}
          <div className={cn("w-full flex-none flex flex-col items-center", TRANSITION_BASE)}>
            {/* Horizontal Ruler (Locked to Page Wide Authority) */}
            {!isPreview && <HorizontalRuler />}

            <div className={cn(
              "max-w-[816px] w-full flex flex-col gap-0 items-center justify-center",
              TRANSITION_BASE,
              !isPreview && "pt-12"
            )}>
              {/* ─── Attached Authoring Toolbar ─── */}
              {!isPreview && (
                <AuthoringToolbar 
                  onCommand={handleCommand}
                  onOpenFormulas={onOpenFormulas}
                  onOpenElements={onOpenElements}
                  onOpenExport={onOpenExport}
                  onOpenShare={() => setShareOpen(true)}
                />
              )}
              
              <div className={cn("w-full flex justify-center", TRANSITION_BASE)}>
                <PageRenderer
                  document={document}
                  readOnly={!editable || isPreview}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT RAIL: Governance / OverHUD (Yield & Rescue Posture) */}
      {!isPreview && (
        <div className={cn(
          "h-full border-l border-white/5 overflow-hidden flex-none z-40",
          TRANSITION_BASE,
          showGovernance ? "w-80" : "w-0",
          // Rescue Posture: When constrained and panel is open, use overlay logic
          (isConstrained && showGovernance) && "fixed top-0 right-0 h-full bg-zinc-900 border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
        )}>
          <GovernancePanel 
            document={document} 
            onNavigate={handleNavigate}
          />
          
          {/* Rescue Handle (Manual Close in Overlay Mode) */}
          {(isConstrained && showGovernance) && (
            <button 
              onClick={() => setShowGovernance(false)}
              className="absolute top-1/2 -left-3 w-3 h-12 bg-primary/40 rounded-l flex items-center justify-center text-black hover:bg-primary transition-all"
            >
              <div className="w-1 h-4 bg-black/60 rounded-full" />
            </button>
          )}
        </div>
      )}

      {/* Distribution Modal */}
      <ShareDialog 
        open={shareOpen} 
        onOpenChange={setShareOpen} 
      />
    </div>
  );
}

