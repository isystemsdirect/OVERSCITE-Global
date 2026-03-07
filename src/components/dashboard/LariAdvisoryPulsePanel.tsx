
import React from 'react';
import DashboardCard from './DashboardCard';

const LariAdvisoryPulsePanel = () => {
  return (
    <DashboardCard title="LARI Advisory Pulse">
      <div className="text-gray-300">
        <p>Top active advisories</p>
        <p>Confidence indicators</p>
        <p>Sensor modality tags</p>
      </div>
    </DashboardCard>
  );
};

export default LariAdvisoryPulsePanel;
