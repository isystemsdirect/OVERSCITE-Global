
import { UnifiedForecastModel } from "@/lib/weather/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Wind, Droplets, Sun, Cloud, Eye, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CurrentConditionsProps {
  weather: UnifiedForecastModel | null;
}

export function CurrentConditionsPanel({ weather }: CurrentConditionsProps) {
  if (!weather) return null;

  const current = weather.current;

  return (
    <Card className="h-full border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary" /> Current Conditions</span>
          <Badge variant="outline" className="text-[10px] font-mono tracking-wider uppercase bg-background/50">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-5xl font-extrabold tracking-tighter text-foreground">{Math.round(current.temp)}°</span>
                <span className="text-sm font-medium text-muted-foreground capitalize flex items-center gap-1 mt-1">
                    {current.weather[0].description}
                </span>
            </div>
            <div className="text-right space-y-1">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Feels Like</div>
                <div className="text-xl font-bold">{Math.round(current.feels_like)}°</div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Wind className="h-3 w-3" /> Wind</span>
            <span className="font-semibold text-foreground">{current.wind_speed} <span className="text-[10px] text-muted-foreground">mph</span></span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Droplets className="h-3 w-3" /> Humidity</span>
            <span className="font-semibold text-foreground">{current.humidity}%</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Sun className="h-3 w-3" /> UV Index</span>
            <span className={`font-semibold ${current.uvi > 7 ? 'text-destructive' : 'text-foreground'}`}>{current.uvi}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Eye className="h-3 w-3" /> Visibility</span>
            <span className="font-semibold text-foreground">{(current.visibility / 1609).toFixed(1)} <span className="text-[10px] text-muted-foreground">mi</span></span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><Cloud className="h-3 w-3" /> Cloud Cover</span>
            <span className="font-semibold text-foreground">{current.clouds}%</span>
          </div>
           <div className="flex justify-between items-center border-b border-dashed border-border/50 pb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium"><ArrowDown className="h-3 w-3" /> Pressure</span>
            <span className="font-semibold text-foreground">{current.pressure} <span className="text-[10px] text-muted-foreground">hPa</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
