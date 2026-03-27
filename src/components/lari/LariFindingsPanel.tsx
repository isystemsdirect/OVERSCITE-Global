'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle, 
  ChevronRight, 
  ArrowUpRight, 
  Trash2,
  FilePlus,
  StickyNote,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  Copy,
  Plus,
  Camera,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LariFindingsPanelProps {
  activeMode: string;
}

const mockFindings = [
  {
    id: 1,
    severity: 'High',
    type: 'Structural',
    confidence: 94,
    timestamp: '14:32:05',
    description: 'Major fissure detected in support column C4.',
    source: 'LiDAR'
  },
  {
    id: 2,
    severity: 'Medium',
    type: 'Moisture',
    confidence: 88,
    timestamp: '14:31:42',
    description: 'Elevated moisture levels in drywall section.',
    source: 'Thermal'
  },
  {
    id: 3,
    severity: 'Low',
    type: 'Cosmetic',
    confidence: 76,
    timestamp: '14:30:15',
    description: 'Surface abrasion on finish layer.',
    source: 'Visual'
  },
  {
    id: 4,
    severity: 'High',
    type: 'Subgrade',
    confidence: 91,
    timestamp: '14:34:22',
    description: 'Acoustic anomaly detected at -2.4m depth. Potential void or pipe collapse.',
    source: 'SONAR'
  }
];

const mockAuditLogs = [
    { timestamp: "14:34:22", event: "LARI_ECHO_ANOMALY_DETECTED", status: "error" },
    { timestamp: "14:34:05", event: "ARCHIVE_NODE_LATTICE_SYNC", status: "success" },
    { timestamp: "14:32:05", event: "LARI_INFERENCE_COMPLETE", status: "success" },
    { timestamp: "14:31:55", event: "SENSOR_CAPTURE_TRIGGER", status: "success" },
    { timestamp: "14:31:42", event: "THERMAL_Threshold_ALERT", status: "warning" },
    { timestamp: "14:30:10", event: "USER_AUTH_CHECK", status: "success" },
];

export default function LariFindingsPanel({ activeMode }: LariFindingsPanelProps) {
  const isSonarMode = activeMode === 'sonar';
  const displayFindings = isSonarMode ? mockFindings.filter(f => f.source === 'SONAR' || f.source === 'LiDAR') : mockFindings;

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Findings Stream */}
      <Card className="flex-1 flex flex-col border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              LARI Advisory Stream
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/20">
              {displayFindings.length} Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col">
              {displayFindings.map((finding) => (
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
                    {finding.source === 'SONAR' ? <Waves className="h-4 w-4 text-primary animate-pulse" /> : 
                     finding.severity === 'High' ? <XCircle className="h-4 w-4 text-red-500" /> :
                     finding.severity === 'Medium' ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> :
                     <Info className="h-4 w-4 text-blue-500" />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors">
                        {finding.type} Anomaly
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
                  
                  <Button variant="ghost" size="icon" className="h-6 w-6 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Inspector Notes / Evidence Entry */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-md">
        <Tabs defaultValue="notes" className="w-full">
            <CardHeader className="py-0 px-0 border-b border-white/5">
                <div className="px-4 py-2 flex items-center justify-between bg-white/5">
                    <TabsList className="h-7 bg-transparent p-0 gap-4">
                        <TabsTrigger value="notes" className="h-7 px-0 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                            <StickyNote className="h-3 w-3 mr-1.5" />
                            Notes
                        </TabsTrigger>
                        <TabsTrigger value="evidence" className="h-7 px-0 text-xs font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                            <Copy className="h-3 w-3 mr-1.5" />
                            Evidence Chain
                        </TabsTrigger>
                    </TabsList>
                </div>
            </CardHeader>
            
            <CardContent className="p-4">
                <TabsContent value="notes" className="mt-0 space-y-3">
                    <Textarea 
                        placeholder={isSonarMode ? "Record acoustic observations..." : "Enter manual observations here..."} 
                        className="resize-none min-h-[80px] text-xs bg-black/20 border-white/10 focus-visible:ring-primary/20" 
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Inspector Entry
                        </span>
                        <Button size="sm" className="h-7 text-xs gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10">
                            <FilePlus className="h-3 w-3" />
                            Insert to Report
                        </Button>
                    </div>
                </TabsContent>
                
                <TabsContent value="evidence" className="mt-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5 text-xs">
                            <div className="h-8 w-8 bg-black/40 rounded flex items-center justify-center border border-white/10">
                                {isSonarMode ? <Waves className="h-4 w-4 text-primary" /> : <Camera className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{isSonarMode ? 'SONAR_SCAN_LATTICE_001.dat' : 'IMG_20260304_001.jpg'}</p>
                                <p className="text-[10px] text-muted-foreground">14:34:22 • {isSonarMode ? '14.2MB' : '2.4MB'}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full h-8 text-xs border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40">
                            <Plus className="h-3 w-3 mr-1.5" />
                            Add External Evidence
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
                 BANE INTEGRITY MONITOR
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
