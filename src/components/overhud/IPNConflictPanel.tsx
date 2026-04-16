import React from 'react';

export const IPNConflictPanel: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 pb-4 border-b border-white/10">
      <div className="flex justify-between items-center text-xs text-white/50 px-4 uppercase tracking-widest">
        <span>Conflict Pressure</span>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)] animate-pulse" />
          <span>Active</span>
        </div>
      </div>
      <div className="px-4 space-y-1">
        <div className="flex justify-between text-xs text-white/80">
          <span>Global Pressure Score:</span>
          <span className="font-mono text-yellow-400">42 / 100</span>
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>Active Events:</span>
          <span className="font-mono">2</span>
        </div>
        <div className="text-[10px] text-white/40 pt-1">
          BANE Recommendation: <span className="text-yellow-400">CONTROLLED</span>
        </div>
      </div>
    </div>
  );
};
