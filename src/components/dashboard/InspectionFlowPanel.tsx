
import React from 'react';
import DashboardCard from './DashboardCard';

const InspectionFlowPanel = () => {
  return (
    <DashboardCard title="Inspection Flow">
      <div className="text-gray-300">
        <p>Upcoming inspections</p>
        <p>In-progress jobs</p>
        <p>Pending reports</p>
      </div>
    </DashboardCard>
  );
};

export default InspectionFlowPanel;
