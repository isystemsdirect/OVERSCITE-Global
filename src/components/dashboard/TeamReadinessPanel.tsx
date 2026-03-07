
import React from 'react';
import DashboardCard from './DashboardCard';

const TeamReadinessPanel = () => {
  return (
    <DashboardCard title="Team Readiness">
      <div className="text-gray-300">
        <p>Inspectors online</p>
        <p>Assigned / available</p>
        <p>Readiness indicators</p>
      </div>
    </DashboardCard>
  );
};

export default TeamReadinessPanel;
