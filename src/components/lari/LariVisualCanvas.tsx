'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize2, 
  Crosshair, 
  MoreHorizontal, 
  Download,
  Share2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Layers,
  Grid,
  Sun,
  Moon,
  Camera,
  Settings,
  AlertTriangle,
  Scan,
  Waves
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LariVisualCanvasProps {
  activeMode: string;
}

export default function LariVisualCanvas({ activeMode }: LariVisualCanvasProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const isSonarMode = activeMode === 'sonar';

  return (
    <Card className="flex flex-col h-full border-white/10 bg-black/80 backdrop-blur-xl relative overflow-hidden group">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded-md p-2 border border-white/10 pointer-events-auto flex items-center gap-3">
          <Badge variant="destructive" className="animate-pulse bg-red-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 border-none shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            LIVE FEED
          </Badge>
          <div className="h-3 w-[1px] bg-white/20"></div>
          <span className="text-xs font-mono text-primary flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" />
            TARGET LOCK: ON
          </span>
          <div className="h-3 w-[1px] bg-white/20"></div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {isSonarMode ? 'SONAR: 450kHz • CHIRP' : '1920x1080 • 60FPS'}
          </span>
        </div>

        <div className="flex gap-2 pointer-events-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-white/10 border border-white/5 backdrop-blur-sm rounded-md">
                <Grid className="h-4 w-4 text-white/70" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-white/10 border border-white/5 backdrop-blur-sm rounded-md">
                <Sun className="h-4 w-4 text-white/70" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-white/10 border border-white/5 backdrop-blur-sm rounded-md">
                <Layers className="h-4 w-4 text-white/70" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-white/10 border border-white/5 backdrop-blur-sm rounded-md">
                <Maximize2 className="h-4 w-4 text-white/70" />
            </Button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Placeholder for Video Feed / Canvas */}
        <div className={cn(
            "absolute inset-0 bg-cover bg-center opacity-30 flex items-center justify-center",
            isSonarMode ? "bg-[url('/placeholder-sonar.jpg')]" : "bg-[url('/placeholder-feed.jpg')]"
        )}>
            {isSonarMode ? (
                // Sonar Mapping Viewport
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Concentric Sonar Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[800px] h-[800px] rounded-full border border-primary/10 animate-pulse delay-75"></div>
                        <div className="w-[600px] h-[600px] rounded-full border border-primary/20 animate-pulse delay-150 absolute"></div>
                        <div className="w-[400px] h-[400px] rounded-full border border-primary/30 animate-pulse delay-300 absolute"></div>
                        <div className="w-[200px] h-[200px] rounded-full border border-primary/40 animate-pulse delay-500 absolute"></div>
                    </div>
                    
                    {/* Scanning Sector */}
                    <div className="absolute w-full h-full animate-[spin_4s_linear_infinite] opacity-30">
                         <div className="w-1/2 h-full bg-gradient-to-l from-transparent via-primary/20 to-transparent ml-[50%] skew-x-12 origin-left"></div>
                    </div>
                    
                    <div className="text-center space-y-2 relative z-10">
                        <Waves className="h-16 w-16 mx-auto text-primary animate-pulse" />
                        <p className="text-sm font-mono text-primary font-bold tracking-widest">ACOUSTIC ARRAY ACTIVE</p>
                        <p className="text-xs text-muted-foreground font-mono">ArcHive™ Node Sync: ESTABLISHED</p>
                    </div>
                </div>
            ) : (
                // Standard Camera/Lidar Viewport
                <div className="text-center space-y-2 opacity-50">
                    <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm font-mono text-muted-foreground">NO SIGNAL SOURCE DETECTED</p>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Initialize Sensor</Button>
                </div>
            )}
        </div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
           <div className="relative h-24 w-24 border border-white/30 rounded-full flex items-center justify-center">
               <div className="h-1 w-1 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]"></div>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-white/50"></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1px] h-4 bg-white/50"></div>
               <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-4 bg-white/50"></div>
               <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-[1px] w-4 bg-white/50"></div>
           </div>
        </div>
      </div>

      {/* Bottom Control Strip */}
      <div className="h-16 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center px-4 justify-between shrink-0 z-20">
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                <ZoomOut className="h-3.5 w-3.5" />
                <span className="sr-only">Zoom Out</span>
            </Button>
            <div className="w-24 h-1 bg-white/10 rounded-full relative overflow-hidden group/slider cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-primary group-hover/slider:bg-primary/80 transition-colors"></div>
            </div>
            <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                <ZoomIn className="h-3.5 w-3.5" />
                <span className="sr-only">Zoom In</span>
            </Button>
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
            <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
            </Button>
         </div>

         <div className="flex items-center gap-3">
             <Button variant="secondary" className="h-9 gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-sm">
                 {isSonarMode ? <Waves className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                 {isSonarMode ? 'SONAR SWEEP' : 'CAPTURE FRAME'}
             </Button>
             <Button className="h-9 gap-2 bg-primary/90 hover:bg-primary text-black font-semibold shadow-[0_0_15px_rgba(255,216,77,0.3)] border border-yellow-400/50">
                 <Scan className="h-4 w-4" />
                 Analyze
             </Button>
         </div>
      </div>
    </Card>
  );
}
