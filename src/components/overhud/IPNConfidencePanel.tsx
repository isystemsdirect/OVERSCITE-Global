import React from 'react';

export const IPNConfidencePanel: React.FC = () => {
    return (
        <div className="bg-black/50 p-2 rounded mx-4 mb-2 border border-white/5 flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">LARI Confidence Bound</span>
                <span className="text-[10px] font-mono text-blue-400">85%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <span className="text-[9px] text-white/40 mt-1">Evidence Reference: ipn_telemetry_ref_812</span>
        </div>
    );
};
