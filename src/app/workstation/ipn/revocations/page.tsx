import React from 'react';

export default function IPNRevocationsPage() {
    return (
        <div className="p-8 font-mono text-white">
            <h1 className="text-2xl font-bold mb-4">IPN Security Revocations</h1>
            <p className="text-muted-foreground mb-8 text-sm max-w-2xl">
                Immutable ledger of session and device evictions. Emergency kill commands executed via Global Revoke or Scing bounds are recorded permanently by BANE.
            </p>

            <div className="border border-white/10 bg-black p-4 rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase border-b border-white/10">
                        <tr>
                            <th className="py-2.5">Target</th>
                            <th>Type</th>
                            <th>Operator ArcID</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody className="text-white/80 text-xs">
                        <tr className="border-b border-white/5 opacity-80">
                            <td className="py-2.5">SESS-8924A</td>
                            <td>SESSION</td>
                            <td>arc_u1295b</td>
                            <td>Operator Expired</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
