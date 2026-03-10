'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings2, 
  Activity, 
  Eye, 
  Zap, 
  FileText,
  Thermometer,
  Layers,
  History,
  Scan,
  MoreVertical,
  Waves
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import LariSensorControlStack from '@/components/lari/LariSensorControlStack';
import LariVisualCanvas from '@/components/lari/LariVisualCanvas';
import LariFindingsPanel from '@/components/lari/LariFindingsPanel';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function LariVisionCommandPage() {
  const [activeMode, setActiveMode] = useState('live');
  const [evidenceMode, setEvidenceMode] = useState(false);

  // AppShell removed to prevent nested layout duplication. 
  // RootLayout already provides the application shell.
  
  return (
      <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-transparent text-white font-sans selection:bg-primary/30">
        
        {/* Operational Mode Tabs - Floating Style */}
        <div className="h-12 px-4 flex items-center shrink-0 overflow-x-auto no-scrollbar justify-between mt-1 mb-1">
          <Tabs value={activeMode} onValueChange={setActiveMode} className="h-full">
            <TabsList className="h-full bg-transparent p-0 gap-2 justify-start min-w-[500px]">
              <TabsTrigger 
                value="live" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <Activity className="h-3.5 w-3.5 mr-2" />
                Live Capture
              </TabsTrigger>
              <TabsTrigger 
                value="still" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <FileText className="h-3.5 w-3.5 mr-2" />
                Still Image
              </TabsTrigger>
              <TabsTrigger 
                value="lidar" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <Scan className="h-3.5 w-3.5 mr-2" />
                3D / LiDAR
              </TabsTrigger>
              <TabsTrigger 
                value="sonar" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <Waves className="h-3.5 w-3.5 mr-2" />
                SONAR Mapping
              </TabsTrigger>
              <TabsTrigger 
                value="thermal" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <Thermometer className="h-3.5 w-3.5 mr-2" />
                Thermal
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
              >
                <History className="h-3.5 w-3.5 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Compact Header Controls - Floating */}
          <div className="flex items-center gap-3 ml-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
             <div className="hidden md:flex items-center gap-2">
                 <Badge variant="outline" className="h-5 gap-1.5 border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[9px] px-1.5">
                   <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                   LARI ONLINE
                 </Badge>
             </div>
             <div className="h-3 w-[1px] bg-white/20 mx-1 hidden md:block" />
             <div className="flex items-center gap-2">
                <span className={cn("text-[9px] font-semibold transition-colors uppercase tracking-wider hidden sm:inline", evidenceMode ? "text-red-400" : "text-muted-foreground")}>
                   Lock
                </span>
                <Switch 
                  checked={evidenceMode} 
                  onCheckedChange={setEvidenceMode}
                  className="scale-75 data-[state=checked]:bg-red-500" 
                />
             </div>
          </div>
        </div>

        {/* Main Command Grid */}
        <div className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0 overflow-hidden w-full relative">
          
          {/* Left Column: Sensor Control Stack (20%) */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2 flex flex-col min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            <LariSensorControlStack activeMode={activeMode} />
          </div>

          {/* Center Column: Primary Visual Canvas (60%) */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col min-h-0 h-full relative">
             <LariVisualCanvas activeMode={activeMode} />
          </div>

          {/* Right Column: Findings & Evidence Stack (20%) */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col min-h-0 overflow-y-auto pl-1 custom-scrollbar">
            <LariFindingsPanel activeMode={activeMode} />
          </div>

        </div>

      </div>
  );
}
