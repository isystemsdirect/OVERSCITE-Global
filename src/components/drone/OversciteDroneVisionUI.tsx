"use client";

import React, { useEffect, useState } from "react";
import { 
  Plane, Activity, Video, Settings, AlertTriangle, Battery, Radar, Wifi, 
  Map, Crosshair, Thermometer, Layers, Zap, Waves, History, Scan, 
  Camera, Eye, ShieldCheck, ShieldAlert, FilePlus, StickyNote, Copy, 
  Trash2, Plus, ZoomIn, ZoomOut, RotateCcw, Grid, Sun, ChevronRight, Maximize2, XCircle, Info
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function OversciteDroneVisionUI() {
  const [activeMode, setActiveMode] = useState('flight');
  const [armed, setArmed] = useState(false);

  const [telemetry, setTelemetry] = useState({
    battery: 92,
    signal: 86,
    sats: 14,
    risk: "Low"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(t => ({
        ...t,
        battery: Math.max(15, t.battery - Math.random() * 0.3),
        signal: Math.max(50, t.signal + (Math.random() - 0.5) * 3),
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-transparent text-white font-sans selection:bg-primary/30">
      <PageHeader 
        title="Drone Vision Command" 
        status="live"
        description="Drone Vision Command provides a high-fidelity, low-latency interface for the teleoperation and automated flight of OVERSCITE aerial capture units. It bridges the gap between the physical field and the digital BFI™ intelligence layer through real-time telemetry and 4K video transmission. Mission controllers can execute precision flight paths while Scing™ monitors biometric and environmental safety vectors. This aerial reconnaissance tool is essential for scaling inspections across vast or inaccessible jurisdictional territories."
        actions={
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 h-10 shadow-xl">
            <div className="hidden md:flex items-center gap-2">
                <Badge variant="outline" className="h-5 gap-1.5 border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[9px] px-1.5 uppercase">
                  <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                  BETAFLIGHT ONLINE
                </Badge>
            </div>
            
            <div className="h-3 w-[1px] bg-white/20 mx-1 hidden md:block" />
            
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-muted-foreground mr-2">
              <span className="flex items-center"><Battery className="h-3 w-3 mr-1 text-green-400" /> {Math.round(telemetry.battery)}%</span>
              <span className="flex items-center"><Radar className="h-3 w-3 mr-1 text-blue-400" /> {telemetry.sats} SAT</span>
              <span className="flex items-center"><Wifi className="h-3 w-3 mr-1 text-primary" /> {Math.round(telemetry.signal)}%</span>
            </div>

            <div className="h-3 w-[1px] bg-white/20 mx-1 hidden md:block" />

            <div className="flex items-center gap-2">
                <span className={cn("text-[9px] font-semibold transition-colors uppercase tracking-wider hidden sm:inline", armed ? "text-red-400" : "text-muted-foreground")}>
                   {armed ? 'ARMED' : 'DISARMED'}
                </span>
                <Switch 
                  checked={armed} 
                  onCheckedChange={setArmed}
                  className="scale-75 data-[state=checked]:bg-red-500" 
                />
            </div>
          </div>
        }
      />

      {/* Operational Mode Tabs - Floating Style */}
      <div className="h-12 px-4 flex items-center shrink-0 overflow-x-auto no-scrollbar justify-between mt-1 mb-1">
        <Tabs value={activeMode} onValueChange={setActiveMode} className="h-full">
          <TabsList className="h-full bg-transparent p-0 gap-2 justify-start min-w-[500px]">
            <TabsTrigger 
              value="flight" 
              className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
            >
              <Plane className="h-3.5 w-3.5 mr-2" />
              Live Flight
            </TabsTrigger>
            <TabsTrigger 
              value="vision" 
              className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
            >
              <Scan className="h-3.5 w-3.5 mr-2" />
              LARI.Vision
            </TabsTrigger>
            <TabsTrigger 
              value="mission" 
              className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
            >
              <Map className="h-3.5 w-3.5 mr-2" />
              Mission Planner
            </TabsTrigger>
            <TabsTrigger 
              value="telemetry" 
              className="h-8 rounded-full border border-white/10 px-4 text-xs font-medium text-muted-foreground data-[state=active]:border-primary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all hover:text-white hover:bg-white/5"
            >
              <Activity className="h-3.5 w-3.5 mr-2" />
              Blackbox / Telemetry
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Command Grid */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0 overflow-hidden w-full relative">
        
        {/* Left Column: Drone Control Stack (20%) */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-2 flex flex-col min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          <DroneControlStack activeMode={activeMode} />
        </div>

        {/* Center Column: Primary Visual Canvas (60%) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col min-h-0 h-full relative">
           <DroneVisualCanvas activeMode={activeMode} />
        </div>

        {/* Right Column: Findings & Evidence Stack (20%) */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col min-h-0 overflow-y-auto pl-1 custom-scrollbar">
          <DroneFindingsPanel activeMode={activeMode} />
        </div>

      </div>

    </div>
  );
}

function DroneControlStack({ activeMode }: { activeMode: string }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Platform Registry Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" />
            Platform Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Aircraft ID</Label>
              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary font-mono">
                OVR-A1-TETRA
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Firmware</Label>
              <span className="text-xs font-mono text-white">Betaflight 4.4.2</span>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Payload</Label>
              <span className="text-xs font-mono text-white">RGB + LiDAR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Envelope Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Safety Envelope
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                 <Label className="text-xs">Geofence Lock</Label>
                 <Switch defaultChecked className="scale-75" />
             </div>
             <div className="flex items-center justify-between">
                 <Label className="text-xs">Collision Avoidance</Label>
                 <Switch defaultChecked className="scale-75" />
             </div>
             
             <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-xs flex justify-between">
                    <span className="text-muted-foreground">Max Altitude Ceiling</span>
                    <span className="text-white font-mono">120m</span>
                </span>
                <Slider defaultValue={[120]} max={400} step={10} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
             </div>

             <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-xs flex justify-between">
                    <span className="text-muted-foreground">Return-to-Home Battery</span>
                    <span className="text-white font-mono">25%</span>
                </span>
                <Slider defaultValue={[25]} max={50} step={5} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3" />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* LARI Processing Panel */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <CardHeader className="py-3 px-4 border-b border-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            LARI.Vision Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Button variant="secondary" className="w-full h-9 text-xs">
            Engage Live Inspection
          </Button>

           <div className="pt-2 border-t border-white/5">
              <Label className="text-xs text-muted-foreground block mb-2">Detection Models</Label>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">
                    Structural Scan
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors border-white/10">
                    Thermal Leak
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors border-white/10">
                    Asset Mapping
                </Badge>
              </div>
           </div>
        </CardContent>
      </Card>
      
      {/* HUD Overlays */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md flex-1">
        <CardHeader className="py-3 px-4 border-b border-white/5">
           <div className="flex items-center justify-between">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              HUD Overlays
            </CardTitle>
            <Switch defaultChecked className="scale-75" />
           </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
           <div className="space-y-2">
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 Artificial Horizon
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 Telemetry Ladders
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
              <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 LARI Bounding Boxes
               </span>
               <Switch defaultChecked className="scale-50" />
             </div>
             <div className="flex items-center justify-between text-xs">
               <span className="flex items-center gap-2">
                 <Eye className="h-3 w-3 text-muted-foreground" /> 
                 Mission Waypoints
               </span>
               <Switch className="scale-50" />
             </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DroneVisualCanvas({ activeMode }: { activeMode: string }) {
  return (
    <Card className="flex flex-col h-full border-white/10 bg-black/80 backdrop-blur-xl relative overflow-hidden group">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded-md p-2 border border-white/10 pointer-events-auto flex items-center gap-3 shadow-lg">
          <Badge variant="destructive" className="animate-pulse bg-red-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 border-none shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            REC
          </Badge>
          <div className="h-3 w-[1px] bg-white/20"></div>
          <span className="text-xs font-mono text-primary flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" />
            TRACKING ACTIVE
          </span>
          <div className="h-3 w-[1px] bg-white/20"></div>
          <span className="text-[10px] text-muted-foreground font-mono">
            4K UHD • 60FPS
          </span>
        </div>

        <div className="flex gap-2 pointer-events-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-white/10 border border-white/5 backdrop-blur-sm rounded-md">
                <Grid className="h-4 w-4 text-white/70" />
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
      <div className="flex-1 relative bg-[#0a0f16] flex items-center justify-center overflow-hidden">
        
        {/* Placeholder Drone Feed Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
        
        {/* Pitch / Artificial Horizon Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60">
            {/* Horizon Line */}
            <div className="w-[60%] border-t border-green-500/70 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
                  <div className="w-8 h-1 bg-green-500/70"></div>
                  <div className="w-2 h-2 rounded-full border border-green-500/70"></div>
                  <div className="w-8 h-1 bg-green-500/70"></div>
               </div>
            </div>
            {/* Pitch Markings */}
            <div className="absolute mt-24 w-32 border-t border-green-500/40 text-[9px] text-green-500/70 font-mono text-right pr-2">+10</div>
            <div className="absolute mb-24 w-32 border-t border-green-500/40 text-[9px] text-green-500/70 font-mono text-right pr-2">-10</div>
        </div>

        {/* Telemetry Ladders */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1/2 w-16 border-r-2 border-white/20 flex flex-col justify-between py-4 text-[10px] font-mono text-white/60 pointer-events-none">
            <span className="text-right pr-2">18m/s</span>
            <span className="text-right pr-2 text-primary">12m/s ▶</span>
            <span className="text-right pr-2">06m/s</span>
        </div>
        
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-1/2 w-16 border-l-2 border-white/20 flex flex-col justify-between py-4 text-[10px] font-mono text-white/60 pointer-events-none">
            <span className="pl-2">150m</span>
            <span className="pl-2 text-primary">◀ 124m</span>
            <span className="pl-2">100m</span>
        </div>

        {/* Center Reticle / LARI Bounding Box */}
        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-[40%] pointer-events-none">
           <div className="w-32 h-32 border-2 border-yellow-400/80 bg-yellow-400/10 rounded-sm relative">
              <span className="absolute -top-5 left-0 text-[10px] font-mono text-yellow-400 bg-black/50 px-1 border border-yellow-400/50">Anomaly: Fissure [94%]</span>
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
                <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-primary group-hover/slider:bg-primary/80 transition-colors"></div>
            </div>
            <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                <ZoomIn className="h-3.5 w-3.5" />
                <span className="sr-only">Zoom In</span>
            </Button>
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
            <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Cam
            </Button>
         </div>

         <div className="flex items-center gap-3">
             <Button variant="secondary" className="h-9 gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-sm">
                 <Camera className="h-4 w-4" />
                 Capture Evidence
             </Button>
             <Button className="h-9 gap-2 bg-primary/90 hover:bg-primary text-black font-semibold shadow-[0_0_15px_rgba(255,216,77,0.3)] border border-yellow-400/50">
                 <Scan className="h-4 w-4" />
                 Analyze Scene
             </Button>
         </div>
      </div>
    </Card>
  );
}

function DroneFindingsPanel({ activeMode }: { activeMode: string }) {
  const mockFindings = [
    {
      id: 1,
      severity: 'High',
      type: 'Structural',
      confidence: 94,
      timestamp: '14:32:05',
      description: 'Major fissure detected on western facade.',
      source: 'LARI.Vision'
    },
    {
      id: 2,
      severity: 'Medium',
      type: 'Airspace',
      confidence: 100,
      timestamp: '14:31:42',
      description: 'Proximity Warning: Approaching Mission Ceiling (120m).',
      source: 'FC Telemetry'
    },
    {
      id: 3,
      severity: 'Medium',
      type: 'Environment',
      confidence: 88,
      timestamp: '14:30:15',
      description: 'Wind shear detected at current altitude. Stability compensation active.',
      source: 'Flight Controller'
    }
  ];

  const mockAuditLogs = [
      { timestamp: "14:34:22", event: "LARI_VISION_ANOMALY_LOGGED", status: "success" },
      { timestamp: "14:34:05", event: "FC_TELEMETRY_SYNC", status: "success" },
      { timestamp: "14:32:05", event: "BETAFLIGHT_PID_ADJUST", status: "warning" },
      { timestamp: "14:31:55", event: "FRAME_CAPTURE_EVIDENCE", status: "success" },
      { timestamp: "14:30:10", event: "ARMING_SEQUENCE_INIT", status: "success" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Findings Stream */}
      <Card className="flex-1 flex flex-col border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Flight Advisory Stream
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/20">
              {mockFindings.length} Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col">
              {mockFindings.map((finding) => (
                <div 
                  key={finding.id} 
                  className="group flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative"
                >
                  <div className={cn(
                    "w-1 h-full absolute left-0 top-0 bottom-0",
                    finding.severity === 'High' ? "bg-red-500" : 
                    finding.severity === 'Medium' ? "bg-yellow-500" : "bg-blue-500"
                  )} />
                  
                  <div className="mt-1">
                     {finding.severity === 'High' ? <XCircle className="h-4 w-4 text-red-500" /> :
                      finding.severity === 'Medium' ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> :
                      <Info className="h-4 w-4 text-blue-500" />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors">
                        {finding.type} Alert
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{finding.timestamp}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {finding.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm bg-white/5 hover:bg-white/10 text-muted-foreground font-normal border border-white/5">
                        {finding.source}
                      </Badge>
                      <Badge variant="secondary" className={cn(
                        "text-[10px] h-4 px-1 rounded-sm font-normal border border-white/5",
                        finding.confidence > 90 ? "bg-green-500/10 text-green-500" : "bg-white/5 text-muted-foreground"
                      )}>
                        {finding.confidence}% Conf.
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Inspector Notes / Evidence Entry */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <Tabs defaultValue="evidence" className="w-full">
            <CardHeader className="py-0 px-0 border-b border-white/5">
                <div className="px-4 py-2 flex items-center justify-between bg-white/5">
                    <TabsList className="h-7 bg-transparent p-0 gap-4">
                        <TabsTrigger value="evidence" className="h-7 px-0 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                            <Copy className="h-3 w-3 mr-1.5" />
                            ArcHive™ Chain
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="h-7 px-0 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                            <StickyNote className="h-3 w-3 mr-1.5" />
                            Notes
                        </TabsTrigger>
                    </TabsList>
                </div>
            </CardHeader>
            
            <CardContent className="p-4">
                <TabsContent value="evidence" className="mt-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5 text-xs">
                            <div className="h-8 w-8 bg-black/40 rounded flex items-center justify-center border border-white/10">
                                <Camera className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">FLIGHT_FRAME_0042.jpg</p>
                                <p className="text-[10px] text-muted-foreground">14:31:55 • Signed & Hashed</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full h-8 text-xs border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40">
                            <Plus className="h-3 w-3 mr-1.5" />
                            Upload Ext. Telemetry
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0 space-y-3">
                    <Textarea 
                        placeholder="Log flight observations..." 
                        className="resize-none min-h-[80px] text-xs bg-black/20 border-white/10 focus-visible:ring-primary/20" 
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Pilot Entry
                        </span>
                        <Button size="sm" className="h-7 text-xs gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10">
                            <FilePlus className="h-3 w-3" />
                            Commit Log
                        </Button>
                    </div>
                </TabsContent>
            </CardContent>
        </Tabs>
      </Card>

      {/* BANE Security Dock */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
         <div className="flex items-center justify-between px-3 py-2 bg-red-500/5 border-b border-red-500/10">
             <span className="text-[10px] font-mono text-red-400 flex items-center gap-1.5">
                 <ShieldAlert className="h-3 w-3" />
                 BANE FLIGHT MONITOR
             </span>
             <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
                <div className="h-1.5 w-1.5 rounded-full bg-red-500/20" />
             </div>
         </div>
         <div className="p-2 space-y-1">
            {mockAuditLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground">
                    <span className="text-white/30">{log.timestamp}</span>
                    <span className={cn(
                        "uppercase", 
                        log.status === 'success' ? "text-green-500/70" : 
                        log.status === 'warning' ? "text-yellow-500/70" : "text-red-500/70"
                    )}>{log.event}</span>
                </div>
            ))}
         </div>
      </Card>

    </div>
  );
}