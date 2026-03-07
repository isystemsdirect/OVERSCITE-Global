'use client';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Activity, Zap } from 'lucide-react';
import { CANON } from '@/core/canon/terminology';

interface LARIAutonomousControlProps {
  droneId: string;
  aiStatus: 'active' | 'standby' | 'disabled';
  onAIToggle: (enabled: boolean) => void;
}

export function LARIAutonomousControl({ droneId, aiStatus, onAIToggle }: LARIAutonomousControlProps) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">LARI {CANON.BFI} Control</h3>
        </div>
        <Badge variant={aiStatus === 'active' ? 'default' : 'secondary'}>
          {aiStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div>
            <h4 className="font-medium text-white">Advisory Mode</h4>
            <p className="text-sm text-gray-400">Enable LARI {CANON.BFI} to advise the drone pilot.</p>
        </div>
        <Switch 
            checked={aiStatus === 'active'}
            onCheckedChange={onAIToggle}
        />
      </div>

      {aiStatus === 'active' && (
        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-md animate-pulse">
          <div className="flex items-center gap-2 text-purple-300">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-mono">Analyzing telemetry stream...</span>
          </div>
          <div className="mt-2 text-xs text-purple-400/70 font-mono">
             &gt; OPTIMAL FLIGHT PATH CALCULATED<br/>
             &gt; WIND SHEAR DETECTED (LEVEL 2)<br/>
             &gt; BATTERY OPTIMIZATION ACTIVE
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-white/10">
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-white transition-colors flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Start Advisory Scan</span>
        </button>
      </div>
    </div>
  );
}
