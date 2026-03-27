'use client';

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { OverHUDContextProvider } from "./context/OverHUDContextProvider";
import OverHUDTabs from "./OverHUDTabs";
import { PLATFORM_VERSION } from "@/lib/version";

export default function OverHUD({ open, onToggle }: { open: boolean, onToggle: () => void }) {
  return (
    <OverHUDContextProvider>
      <div
        className={cn(
          "h-full flex-shrink-0 relative transition-all duration-500 ease-in-out flex items-center overflow-visible z-[1001] overhud-panel bg-black/30 backdrop-blur-xl border-l border-border/30",
          open ? "w-[420px]" : "w-0"
        )}
      >
        {/* Toggle Button — vertically centered, 45% shorter, 2/3 width */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-[1002] transition-all duration-500 ease-in-out group",
            open ? "left-[-10px]" : "left-[-12px]"
          )}
          aria-label="Toggle OverHUD"
        >
          <div className={cn(
            "relative flex items-center justify-center h-32 w-[10px] bg-[#FFD84D] rounded-l-lg border-y border-l border-white/30 shadow-[0_0_20px_rgba(255,216,77,0.4)] group-hover:bg-[#ffeb3b] transition-all duration-300",
            !open && "animate-pulse-gold h-36 w-[12px]"
          )}>
            <div className="transform -rotate-90 whitespace-nowrap flex items-center gap-1">
              <span className="text-[9px] font-black tracking-[0.2em] flex items-center">
                <span className="text-[#D32F2F]">OVER</span>
                <span className="text-black ml-0.5">HUD</span>
              </span>
              {open ? <ChevronRight size={10} className="text-black" /> : <ChevronLeft size={10} className="text-black" />}
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
