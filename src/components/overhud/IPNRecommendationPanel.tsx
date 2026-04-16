import React from 'react';

export const IPNRecommendationPanel: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2 pb-4 border-b border-white/10 mt-2">
            <div className="flex justify-between items-center text-xs text-blue-400 px-4 uppercase tracking-widest font-semibold">
                <span>LARI Advisory Actions</span>
                <div className="flex items-center space-x-1">
                    <span className="bg-blue-900 text-blue-200 px-1 rounded text-[10px]">ADVISORY ONLY</span>
                </div>
            </div>
            <div className="px-4 space-y-2">
                {/* Mock Recommendation */}
                <div className="bg-blue-950/30 border border-blue-500/20 p-2 rounded">
                    <div className="flex justify-between items-start text-xs">
                        <span className="text-white/80 font-bold">ROUTE_CLASS Shift</span>
                        <span className="text-blue-400 text-[10px]">UNDER_REVIEW</span>
                    </div>
                    <p className="text-[10px] text-white/60 mt-1">
                        Transit latency anomalous. Recommend shifting route-class to CONSTRAINED RELAY.
                    </p>
                    <div className="flex gap-2 mt-2 flex-col">
                        <div className="flex gap-2">
                             <button className="text-[9px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded hover:bg-blue-600/40">ACCEPT (ADVISORY ONLY)</button>
                             <button className="text-[9px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded hover:bg-red-600/40">REJECT_BY_HUMAN</button>
                        </div>
                        <button className="text-[9px] bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded hover:bg-yellow-600/40 w-fit">ESCALATE_TO_ARCHIVE</button>
                        <button className="text-[9px] bg-green-900/40 text-green-500 border border-green-500/30 px-2 py-0.5 rounded hover:bg-green-800/40 w-fit">EXECUTE IF SEPARATELY AUTHORIZED</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
