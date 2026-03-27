
import React from 'react';
import DashboardCard from './DashboardCard';
import { Users } from 'lucide-react';

const TeamReadinessPanel = () => {
  return (
    <DashboardCard 
      title="Team Readiness"
      headerContent={<Users className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>Inspectors online</p>
        <p>Assigned / available</p>
        <p>Readiness indicators</p>
      </div>
    </DashboardCard>
  );
};

export default TeamReadinessPanel;
