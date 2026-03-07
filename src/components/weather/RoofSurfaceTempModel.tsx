
import { RoofSurfaceTempData } from "@/lib/weather/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSun, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RoofTempProps {
  data: RoofSurfaceTempData | null;
}

export function RoofSurfaceTempModel({ data }: RoofTempProps) {
  if (!data) return null;

  const getRiskColor = () => {
    switch (data.riskLevel) {
      case 'Critical': return 'bg-destructive/10 border-destructive text-destructive';
      case 'Caution': return 'bg-yellow-500/10 border-yellow-500 text-yellow-600';
      default: return 'bg-green-500/10 border-green-500 text-green-600';
    }
  };

  const getIcon = () => {
    if (data.riskLevel === 'Critical') return <AlertTriangle className="h-5 w-5 animate-pulse text-destructive" />;
    if (data.riskLevel === 'Caution') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  };

  return (
    <Card className="h-full border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-2"><ThermometerSun className="h-4 w-4 text-primary" /> Roof Surface Model</span>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger><Info className="h-3 w-3 text-muted-foreground/50 hover:text-foreground transition-colors" /></TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">
                    Estimated surface temperature based on ambient temp, UV index, wind cooling, and {data.material.replace('_', ' ')} absorption.
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg flex items-center justify-between border ${getRiskColor()} bg-background/50`}>
            <div className="flex items-center gap-3">
                {getIcon()}
                <div>
                    <div className="text-3xl font-bold tracking-tight">{data.surfaceTemp}°F</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">{data.riskLevel}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[10px] uppercase opacity-70 mb-1 font-semibold">Ambient Base</div>
                <div className="font-mono text-lg font-medium">{data.ambientTemp}°</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center justify-center border border-dashed border-border/50">
                <span className="text-muted-foreground mb-1">Solar Gain Delta</span>
                <span className="font-bold text-lg text-primary">+{data.delta}°</span>
            </div>
            <div className="bg-muted/30 p-2 rounded flex flex-col items-center justify-center border border-dashed border-border/50">
                <span className="text-muted-foreground mb-1">Material Type</span>
                <span className="font-bold text-center leading-tight capitalize">{data.material.replace('_', ' ')}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
