
import React from 'react';
import DashboardCard from './DashboardCard';
import { ClipboardList } from 'lucide-react';

const InspectionFlowPanel = () => {
  return (
    <DashboardCard 
      title="Inspection Flow"
      headerContent={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>Upcoming inspections</p>
        <p>In-progress jobs</p>
        <p>Pending reports</p>
      </div>
    </DashboardCard>
  );
};

export default InspectionFlowPanel;
