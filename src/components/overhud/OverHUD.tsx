'use client';

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import OverHUDExplorer from "./OverHUDExplorer";
import { PLATFORM_VERSION } from "@/lib/version";

export default function OverHUD({ open, onToggle }: { open: boolean, onToggle: () => void }) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-[1001] transition-all duration-500 ease-in-out group",
          open ? "right-[420px]" : "right-0"
        )}
      >
        <div className="flex items-center">
            <div className={cn(
                "bg-primary/90 text-black p-2 rounded-l-md border-y border-l border-primary/50 shadow-lg group-hover:bg-primary transition-colors",
                !open && "animate-pulse-gold"
            )}>
                {open ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </div>
            {!open && (
                 <div className="bg-black/80 backdrop-blur-md px-3 py-2 border-y border-primary/20 text-[10px] font-mono tracking-widest text-primary uppercase hidden group-hover:block transition-all">
                    BANE MONITOR v{PLATFORM_VERSION}
                </div>
            )}
        </div>
      </button>

      {/* Main HUD Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen transition-all duration-500 ease-in-out z-[1000] overflow-hidden overhud-panel bg-background/90 border-l border-border/30",
          open ? "w-[420px]" : "w-0"
        )}
      >
        <OverHUDExplorer />
      </div>
    </>
  );
}
