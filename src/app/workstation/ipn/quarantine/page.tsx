import React from 'react';

export default function IPNQuarantinePage() {
    return (
        <div className="p-8 font-mono text-white">
            <h1 className="text-2xl font-bold mb-4 text-red-500 tracking-tight">IPN Quarantine Active Containment</h1>
            <p className="text-muted-foreground mb-8 text-sm max-w-2xl">
                Phase 2 Global containment tracker. Devices demonstrating signature failure, cumulative execution drops, or critical posture disruption are placed into diagnostic-only routing bounds. BANE authorization is required to release.
            </p>

            <div className="border border-red-500/20 bg-black p-4 rounded-md shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-red-500 uppercase border-b border-red-500/20">
                        <tr>
                            <th className="py-2.5">Device / Scope</th>
                            <th>Containment Rule</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-white/80">
                        <tr className="border-b border-white/5 bg-red-900/10">
                            <td className="py-2.5 font-bold">DEV-7X-Q01</td>
                            <td>BANE_REJECTION_LIMIT</td>
                            <td>11m ago</td>
                            <td><button className="bg-red-950 text-red-400 border border-red-900 px-3 py-1 rounded text-xs hover:bg-red-800 transition-colors cursor-not-allowed">REQUEST RELEASE</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
