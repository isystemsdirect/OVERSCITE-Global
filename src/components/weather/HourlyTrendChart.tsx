
import { UnifiedForecastModel } from "@/lib/weather/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Clock } from "lucide-react";

interface HourlyTrendChartProps {
  weather: UnifiedForecastModel | null;
}

export function HourlyTrendChart({ weather }: HourlyTrendChartProps) {
  if (!weather || !weather.hourly) return null;

  const data = weather.hourly.slice(0, 12).map((h) => ({
    time: new Date(h.dt * 1000).getHours() + ':00',
    temp: Math.round(h.temp),
    precip: Math.round(h.pop * 100)
  }));

  return (
    <Card className="h-full border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10 shrink-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            12-Hour Forecast Trend
        </CardTitle>
        <div className="flex items-center gap-4 text-[10px] font-mono font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border/50 shadow-sm uppercase tracking-wide">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-400 rounded-full shadow-sm" />Temp (°F)</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm" />Precip (%)</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4 relative">
        <div className="absolute inset-x-4 inset-y-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
              fontWeight={500}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#f97316" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              unit="°" 
              width={35}
              fontWeight={600}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#3b82f6" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              unit="%" 
              width={35}
              fontWeight={600}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(9, 9, 11, 0.8)', 
                borderColor: 'rgba(39, 39, 42, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '0.5rem 1rem'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              yAxisId="left" 
              animationDuration={1500}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="precip" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrecip)" 
              yAxisId="right" 
              animationDuration={1500}
              animationBegin={300}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
