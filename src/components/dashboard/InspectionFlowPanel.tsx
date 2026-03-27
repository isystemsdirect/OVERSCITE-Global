"use client";

import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import { ClipboardList } from 'lucide-react';
import { getInspections } from '@/lib/services/canonical-provider';
import { Inspection } from '@/lib/types';

const InspectionFlowPanel = () => {
  const [stats, setStats] = useState({ upcoming: 0, inProgress: 0, pending: 0 });

  useEffect(() => {
    async function load() {
      const inspections = await getInspections();
      setStats({
        upcoming: inspections.filter(i => i.status === 'Draft').length,
        inProgress: inspections.filter(i => i.status === 'In Progress').length,
        pending: inspections.filter(i => i.status === 'Final').length,
      });
    }
    load();
  }, []);

  return (
    <DashboardCard 
      title="Inspection Flow"
      headerContent={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-4 justify-center py-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Upcoming inspections</span>
          <span className="font-semibold">{stats.upcoming}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">In-progress jobs</span>
          <span className="font-semibold text-blue-500">{stats.inProgress}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Pending reports</span>
          <span className="font-semibold text-amber-500">{stats.pending}</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default InspectionFlowPanel;
