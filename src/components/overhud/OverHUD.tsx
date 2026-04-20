'use client';

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { OverHUDContextProvider } from "./context/OverHUDContextProvider";
import OverHUDTabs from "./OverHUDTabs";
import { useShellLayout } from '@/lib/layout/shell-layout-state';

/**
 * @classification UI_COMPONENT
 * @authority Director
 * @status RECALIBRATED_P1
 * @version 2.1.0
 *
 * @purpose
 * Recalibrated OverHUD following Prime Dominance Protocol.
 * Supports 3-state behavior:
 * 1. Inline: Flex sibling (viewport >= 1400px)
 * 2. Overlay: Floating layer (viewport < 1400px)
 * 3. Icon/Compressed: (Visual yield)
 */
export default function OverHUD() {
  const { isOverHUDOpen, toggleOverHUD } = useShellLayout();
  const [isOverlayMode, setIsOverlayMode] = useState(false);

  // ─── Viewport Yield Logic ──────────────────────────────────────────
  useEffect(() => {
    const checkViewport = () => {
      setIsOverlayMode(window.innerWidth < 1400);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <OverHUDContextProvider>
      <div
        className={cn(
          "h-screen transition-all duration-500 ease-in-out flex items-center overflow-visible z-[1001] overhud-panel",
          // Layout Mode Logic
          isOverlayMode ? "fixed right-0 top-0 shadow-2xl" : "relative flex-shrink-0",
          // Expansion Logic
          isOverHUDOpen ? "w-[420px]" : "w-0",
          // Visual tweaks for overlay
          isOverlayMode && isOverHUDOpen ? "bg-black/60 backdrop-blur-xl border-l border-white/10" : "bg-transparent"
        )}
      >
        {/* Toggle Button — vertically centered, gold tab */}
        <button
          onClick={toggleOverHUD}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-[1002] transition-all duration-500 ease-in-out group",
            isOverHUDOpen ? "left-[-10px]" : "left-[-12px]"
          )}
          aria-label="Toggle OverHUD"
        >
          <div className={cn(
            "relative flex items-center justify-center h-32 w-[10px] bg-[#FFD84D] rounded-l-lg border-y border-l border-white/30 shadow-[0_0_20px_rgba(255,216,77,0.4)] group-hover:bg-[#ffeb3b] transition-all duration-300",
            !isOverHUDOpen && "animate-pulse-gold h-36 w-[12px]"
          )}>
            <div className="transform -rotate-90 whitespace-nowrap flex items-center gap-1">
              <span className="text-[9px] font-black tracking-[0.2em] flex items-center">
                <span className="text-[#D32F2F]">OVER</span>
                <span className="text-black ml-0.5">HUD</span>
              </span>
              {isOverHUDOpen ? <ChevronRight size={10} className="text-black" /> : <ChevronLeft size={10} className="text-black" />}
            </div>

            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-l-lg pointer-events-none" />
          </div>
        </button>

        {/* Content Area */}
        <div className="flex-1 h-full overflow-y-auto w-[420px]">
          <OverHUDTabs />
        </div>
      </div>
    </OverHUDContextProvider>
  );
}

