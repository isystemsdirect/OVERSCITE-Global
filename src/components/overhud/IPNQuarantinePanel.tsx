import React from 'react';

export const IPNQuarantinePanel: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 pb-4 border-b border-red-500/20">
      <div className="flex justify-between items-center text-xs text-red-500/80 px-4 uppercase tracking-widest font-semibold">
        <span>Containment Grid</span>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
          <span>Locked</span>
        </div>
      </div>
      <div className="px-4 space-y-1">
        <div className="flex justify-between text-xs text-white/80">
          <span className="text-red-400">Quarantined Nodes:</span>
          <span className="font-mono font-bold text-red-500">1</span>
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>Last Containment:</span>
          <span className="font-mono">11m ago</span>
        </div>
        <div className="text-[10px] text-red-500/60 pt-1 uppercase">
          Review Required To Restore Transit
        </div>
      </div>
    </div>
  );
};
