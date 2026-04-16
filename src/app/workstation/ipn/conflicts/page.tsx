import React from 'react';

export default function IPNConflictsPage() {
    return (
        <div className="p-8 font-mono text-white">
            <h1 className="text-2xl font-bold mb-4">IPN Conflict Posture Monitoring</h1>
            <p className="text-muted-foreground mb-8 text-sm max-w-2xl">
                Phase 2 Conflict pressure detection logs. BANE continuously analyzes dual-NAT, exterior VPN layers, and ISP disruption tracking to defensively govern allowable channels without relaxing core safety logic.
            </p>

            <div className="border border-yellow-500/20 bg-black p-4 rounded-md shadow-[0_0_15px_rgba(234,179,8,0.05)]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-yellow-500 uppercase border-b border-border/20">
                        <tr>
                            <th className="py-2.5">Device ID</th>
                            <th>Conflict Trace</th>
                            <th>Pressure Score</th>
                            <th>Resolved</th>
                        </tr>
                    </thead>
                    <tbody className="text-white/80">
                        {/* Mock Phase 2 Data */}
                        <tr className="border-b border-white/5">
                            <td className="py-2.5">DEV-39B-890</td>
                            <td>Exterior VPN Collision</td>
                            <td className="text-yellow-400">42</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td className="py-2.5">DEV-39B-112</td>
                            <td>Carrier-grade NAT</td>
                            <td className="text-yellow-400">10</td>
                            <td>No</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
