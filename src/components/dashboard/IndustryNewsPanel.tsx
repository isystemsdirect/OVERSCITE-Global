
import React from 'react';
import DashboardCard from './DashboardCard';

const IndustryNewsPanel = () => {
  return (
    <DashboardCard title="Inspection Industry News">
      <div className="text-gray-300">
        <p>RSS/news feed aggregation</p>
        <p>Inspection industry updates</p>
        <p>Regulatory / standards watch</p>
      </div>
    </DashboardCard>
  );
};

export default IndustryNewsPanel;
