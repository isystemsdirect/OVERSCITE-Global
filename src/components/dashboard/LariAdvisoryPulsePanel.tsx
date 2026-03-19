
import React from 'react';
import DashboardCard from './DashboardCard';
import { Activity } from 'lucide-react';

const LariAdvisoryPulsePanel = () => {
  return (
    <DashboardCard 
      title="LARI Advisory Pulse"
      headerContent={<Activity className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>Top active advisories</p>
        <p>Confidence indicators</p>
        <p>Sensor modality tags</p>
      </div>
    </DashboardCard>
  );
};

export default LariAdvisoryPulsePanel;
