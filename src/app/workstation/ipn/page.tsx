'use client';

import { Activity, ShieldAlert, Book, Network, TabletSmartphone } from 'lucide-react';
import Link from 'next/link';
import { PLATFORM_VERSION } from '@/lib/version';

export default function IPNDashboardPage() {
    return (
        <div className="flex flex-col gap-6 font-mono h-full overflow-y-auto w-full p-4 md:p-8">
            <header className="flex justify-between items-end border-b border-white/10 pb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black uppercase text-white tracking-widest flex items-center gap-2">
                        <Activity className="text-primary" /> LARI-IPN Core
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Governed Relay MVP v{PLATFORM_VERSION}</p>
                </div>
                <div className="text-xs bg-primary/20 text-primary px-3 py-1 rounded font-bold">
                    POSTURE: AGGRESSIVE
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard href="/workstation/ipn/sessions" icon={<Network size={24} />} title="Active Sessions" value="0" label="BANE Authorized" />
                <DashboardCard href="/workstation/ipn/devices" icon={<TabletSmartphone size={24} />} title="Registered Devices" value="0" label="Verified Peers" />
                <DashboardCard href="/workstation/ipn/policies" icon={<Book size={24} />} title="Policy Pack" value="v1.0.00" label="BIPN-PACK" />
                <DashboardCard href="/workstation/ipn/audit" icon={<ShieldAlert size={24} />} title="Audit Lineage" value="IMMUTABLE" label="Hash Chain Intact" />
            </div>

            <section className="bg-black/60 border border-white/10 rounded-md p-4 mt-8 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-white uppercase border-b border-white/10 pb-2">Phase 1 Infrastructure Readout</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                    <li><span className="text-white">Identity Binding:</span> ARC-SCINGULAR Enforced</li>
                    <li><span className="text-white">Relay Type:</span> Governed Proxy (Non-Autonomous Mesh)</li>
                    <li><span className="text-white">Zero-Trust:</span> BANE Explicit Grant Required</li>
                    <li><span className="text-white">Replay Resistance:</span> Enforced</li>
                </ul>
            </section>
        </div>
    );
}

function DashboardCard({ href, icon, title, value, label }: { href: string, icon: React.ReactNode, title: string, value: string, label: string }) {
    return (
        <Link href={href} className="bg-black/40 border border-white/10 p-6 rounded flex flex-col justify-between hover:bg-black/60 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
                 <span className="text-muted-foreground">{icon}</span>
                 <h2 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h2>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{value}</span>
                <span className="text-[10px] text-primary uppercase">{label}</span>
            </div>
        </Link>
    );
}
