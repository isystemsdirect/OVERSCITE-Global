
import { LariGuangelStatus } from "@/lib/weather/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

interface GuangelStripProps {
  status: LariGuangelStatus;
}

export function GuangelSafetyStrip({ status }: GuangelStripProps) {
  const getStatusColor = () => {
    switch (status.status) {
      case 'Intervention': return 'bg-destructive/10 text-destructive border-l-4 border-destructive';
      case 'Warning': return 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500';
      case 'Active': return 'bg-green-500/10 text-green-600 border-l-4 border-green-500';
      default: return 'bg-muted text-muted-foreground border-l-4 border-muted';
    }
  };

  const getIcon = () => {
    switch (status.status) {
      case 'Intervention': return <ShieldAlert className="h-6 w-6 animate-pulse text-destructive" />;
      case 'Warning': return <ShieldAlert className="h-6 w-6 text-orange-500 animate-bounce" />;
      case 'Active': return <ShieldCheck className="h-6 w-6 text-green-600" />;
      default: return <HeartPulse className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <Card className={`border-none shadow-sm hover:shadow-md transition-all ${getStatusColor()}`}>
      <CardContent className="flex items-center justify-between py-4 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        <div className="flex items-center gap-4 z-10">
          <div className="bg-background/80 p-2 rounded-full shadow-sm">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                LARI-GUANGEL™ Monitor
                <span className="text-[10px] bg-background/50 px-1.5 py-0.5 rounded-sm font-mono border border-current/20">LIVE</span>
            </h4>
            <p className="text-xs font-medium opacity-90 mt-0.5">{status.message}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 z-10">
            <div className="flex items-center gap-2 bg-background/50 px-2 py-1 rounded-md border border-current/10 shadow-sm">
                <Activity className="h-3 w-3" />
                <span className="text-xs font-mono font-bold">{status.kineticStatus.toUpperCase()}</span>
            </div>
            <span className="text-[10px] opacity-70 font-mono tracking-tighter">UPDATED: {new Date(status.lastCheck).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
