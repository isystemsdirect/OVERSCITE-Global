/**
 * @classification ROUTE
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

'use client';

import PanelEngine from '@/components/panel-engine/PanelEngine';
import Sidebar from '@/components/Sidebar';
import OverHUD from '@/components/OverHUD';

import { PageHeader } from '@/components/layout/PageHeader';

export default function DynamicDashPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Dynamic Orchestration Dashboard" 
        subtitle="Governance-first experimental workspace for real-time panel orchestration."
        status="experimental"
      />
      <div className="flex-1 min-h-0 relative mt-4">
        <PanelEngine />
      </div>
    </div>
  );
}
