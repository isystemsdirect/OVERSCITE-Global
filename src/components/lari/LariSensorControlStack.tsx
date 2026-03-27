'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  Upload, 
  Scan, 
  Thermometer, 
  Aperture,
  Zap,
  Activity,
  Layers,
  Eye,
  Waves,
  Rss
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LariSensorControlStackProps {
  activeMode: string;
}

export default function LariSensorControlStack({ activeMode }: LariSensorControlStackProps) {
  const isSonarMode = activeMode === 'sonar';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Sensor Sources Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Sensor Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Active Source</Label>
              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary uppercase">
                {isSonarMode ? 'ArcHive™ Node' : 'LIVE'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={activeMode === 'live' ? 'outline' : 'ghost'} 
                size="sm" 
                className={cn(
                    "h-20 flex flex-col gap-2 border border-white/5",
                    activeMode === 'live' ? "border-primary/20 bg-primary/5 text-primary" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <Camera className={cn("h-5 w-5", activeMode === 'live' && "text-primary")} />
                <span className="text-xs">Camera</span>
              </Button>
              <Button 
                variant={activeMode === 'still' ? 'outline' : 'ghost'} 
                size="sm" 
                className={cn(
                    "h-20 flex flex-col gap-2 border border-white/5",
                    activeMode === 'still' ? "border-primary/20 bg-primary/5 text-primary" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <Upload className={cn("h-5 w-5", activeMode === 'still' && "text-primary")} />
                <span className="text-xs">Upload</span>
              </Button>
              <Button 
                variant={activeMode === 'lidar' ? 'outline' : 'ghost'} 
                size="sm" 
                className={cn(
                    "h-20 flex flex-col gap-2 border border-white/5",
                    activeMode === 'lidar' ? "border-primary/20 bg-primary/5 text-primary" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <Scan className={cn("h-5 w-5", activeMode === 'lidar' && "text-primary")} />
                <span className="text-xs">LiDAR</span>
              </Button>
              <Button 
                variant={activeMode === 'sonar' ? 'outline' : 'ghost'} 
                size="sm" 
                className={cn(
                    "h-20 flex flex-col gap-2 border border-white/5",
                    activeMode === 'sonar' ? "border-primary/20 bg-primary/5 text-primary" : "bg-white/5 hover:bg-white/10"
                )}
              >
                <Waves className={cn("h-5 w-5", activeMode === 'sonar' && "text-primary")} />
                <span className="text-xs">SONAR</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <Label className="text-xs text-muted-foreground">
                {isSonarMode ? 'ArcHive™ Node Settings' : 'Camera Settings'}
            </Label>
            
            {isSonarMode ? (
                <>
                    <div className="flex items-center justify-between">
                        <span className="text-xs">Node Sync</span>
                        <Switch defaultChecked className="scale-75" />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-xs flex justify-between">
                            <span>Frequency Band</span>
                            <span className="text-muted-foreground">450kHz</span>
                        </span>
                        <Slider defaultValue={[45]} max={100} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <span className="text-xs">Torch</span>
                        <Switch className="scale-75" />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-xs flex justify-between">
                            <span>Zoom</span>
                            <span className="text-muted-foreground">1.0x</span>
                        </span>
                        <Slider defaultValue={[1]} max={10} step={0.1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
                    </div>
                </>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Capture Controls Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Aperture className="h-4 w-4 text-primary" />
            {isSonarMode ? 'Sweep Control' : 'Capture Control'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Button className={cn(
              "w-full h-12 text-sm font-semibold transition-all",
              isSonarMode 
                ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:border-primary/50" 
                : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
          )}>
            <div className={cn(
                "h-3 w-3 rounded-full mr-2 animate-pulse",
                isSonarMode ? "bg-primary" : "bg-red-500"
            )} />
            {isSonarMode ? 'SONAR SWEEP' : 'CAPTURE FRAME'}
          </Button>

          <div className="space-y-3">
             {isSonarMode ? (
                 <>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Subgrade Mode</Label>
                        <Switch defaultChecked className="scale-75" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Sweep Radius</Label>
                        <span className="text-[10px] font-mono text-muted-foreground">25m</span>
                    </div>
                 </>
             ) : (
                 <>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Burst Mode</Label>
                        <Switch className="scale-75" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Watermark</Label>
                        <Switch defaultChecked className="scale-75" />
                    </div>
                 </>
             )}
             <div className="flex items-center justify-between">
               <Label className="text-xs">Auto-Save</Label>
               <Switch defaultChecked className="scale-75" />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Controls Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            LARI {isSonarMode ? 'ECHO' : 'Processing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Button variant="secondary" className="w-full h-9 text-xs">
            {isSonarMode ? 'Process Acoustic Frame' : 'Run Analysis'}
          </Button>

           <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-xs flex justify-between">
                <span>{isSonarMode ? 'Pulse Power' : 'Sensitivity'}</span>
                <span className="text-muted-foreground">{isSonarMode ? '8.2kW' : 'Med'}</span>
              </span>
              <Slider defaultValue={[isSonarMode ? 82 : 50]} max={100} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
            </div>
          </div>

           <div className="pt-2 border-t border-white/5">
              <Label className="text-xs text-muted-foreground block mb-2">Model Profile</Label>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">
                    {isSonarMode ? 'Volumetric' : 'Structural'}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors border-white/10">
                    {isSonarMode ? 'Subsurface' : 'Roofing'}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors border-white/10">
                    {isSonarMode ? 'Void-Detect' : 'Moisture'}
                </Badge>
              </div>
           </div>
        </CardContent>
      </Card>
      
      {/* Overlay Controls Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md flex-1">
        <CardHeader className="py-3 px-4 border-b border-white/5">
           <div className="flex items-center justify-between">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Overlays
            </CardTitle>
            <Switch defaultChecked className="scale-75" />
           </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
           <div className="space-y-2">
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 {isSonarMode ? 'Density Map' : 'Bounding Boxes'}
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 {isSonarMode ? 'Anomaly ID' : 'Crack Trace'}
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
              <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 {isSonarMode ? 'Echo Pattern' : 'Heatmap'}
               </span>
               <Switch className="scale-50" />
             </div>
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 Measurements
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
           </div>
           
           <div className="pt-2">
             <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Opacity</span>
              <Slider defaultValue={[80]} max={100} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
            </div>
           </div>
        </CardContent>
      </Card>

    </div>
  );
}
