import React from 'react';

export const IPNAnomalyPanel: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2 pb-4 border-b border-orange-500/20">
            <div className="flex justify-between items-center text-xs text-orange-400 px-4 uppercase tracking-widest">
                <span>Anomaly Feed</span>
                <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)] animate-pulse" />
                </div>
            </div>
            <div className="px-4 space-y-1">
                <div className="flex justify-between text-xs text-white/80">
                    <span>Identity Anomaly:</span>
                    <span className="font-mono text-orange-400">HIGH</span>
                </div>
                <div className="text-[10px] text-white/40 pt-1 border-t border-white/5 mt-1">
                    Signature mismatch detected across transit bound.
                </div>
            </div>
        </div>
    );
};
