
import { InspectionRiskScore } from "@/lib/weather/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface IRIPanelProps {
  score: InspectionRiskScore | null;
}

export function InspectionRiskPanel({ score }: IRIPanelProps) {
  if (!score) return null;

  const getIcon = () => {
    if (score.band === 'Critical' || score.band === 'High') return <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />;
    return <ShieldCheck className="h-5 w-5 text-primary" />;
  };

  const getScoreColor = () => {
    if (score.score > 75) return 'bg-destructive';
    if (score.score > 50) return 'bg-orange-500';
    if (score.score > 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="h-full border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${getScoreColor()}`} />
      <CardHeader className="pb-2 pl-6">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Inspection Risk Index (IRI)</span>
          {getIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-6 space-y-4">
        <div className="flex items-end justify-between">
            <span className={`text-4xl font-bold ${score.color}`}>{score.score}</span>
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-muted/50 ${score.color}`}>{score.band} RISK</span>
        </div>
        
        <Progress value={score.score} className={`h-2`} />
        
        {score.topFactors && score.topFactors.length > 0 && (
             <div className="text-xs text-muted-foreground mt-2">
                 <span className="font-semibold">Top Factors:</span> {score.topFactors.join(', ')}
             </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2">
            <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
                <span>Wind Gust</span> 
                <span className="font-semibold text-foreground">{score.factors.wind.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
                <span>Precip Prob</span> 
                <span className="font-semibold text-foreground">{score.factors.precip.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
                <span>Heat Index</span> 
                <span className="font-semibold text-foreground">{score.factors.heatIndex.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
                <span>Lightning</span> 
                <span className="font-semibold text-foreground">{score.factors.lightning}km</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
