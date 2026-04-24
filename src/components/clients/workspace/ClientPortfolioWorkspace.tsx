'use client';

import React from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Search,
  Filter,
  Maximize2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StandardGeospatialViewport } from '@/components/maps/StandardGeospatialViewport';

interface ClientPortfolioWorkspaceProps {
  clientId: string;
  properties: any[];
}

export function ClientPortfolioWorkspace({ 
  clientId, 
  properties 
}: ClientPortfolioWorkspaceProps) {
  // In a real implementation, this would handle multi-marker logic.
  // For v1, we focus on the search and filtering UI around the primary viewport.
  
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-40" />
            <Input 
              placeholder="Search assets by address..." 
              className="pl-9 h-9 bg-card/40 border-border/40 rounded-lg text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs border-border/40 bg-card/20 hover:bg-card/40">
            <Filter className="h-3.5 w-3.5" />
            Filtering
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {properties.length} Entities Grounded
          </Badge>
          <Button size="icon" variant="ghost" className="h-9 w-9 opacity-40 hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 min-h-[500px] bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-2xl overflow-hidden relative">
        <StandardGeospatialViewport 
          address={properties[0]?.address || properties[0]?.propertyAddress || "Los Angeles, CA"}
        />
        
        {/* Geographic Context Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <div className="p-3 bg-background/80 backdrop-blur-md border border-border/40 rounded-xl shadow-xl pointer-events-auto">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Map Layers</span>
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="text-[9px] h-4 justify-start bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors">Property Boundaries (Active)</Badge>
              <Badge variant="secondary" className="text-[9px] h-4 justify-start opacity-40 cursor-not-allowed">Zoning Overlays (Restricted)</Badge>
              <Badge variant="secondary" className="text-[9px] h-4 justify-start opacity-40 cursor-not-allowed">Infrastructure (Restricted)</Badge>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 pointer-events-none">
           <div className="p-3 bg-background/80 backdrop-blur-md border border-border/40 rounded-xl shadow-xl pointer-events-auto flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Portfolio Status</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  All Sites Observable
                </span>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
}
