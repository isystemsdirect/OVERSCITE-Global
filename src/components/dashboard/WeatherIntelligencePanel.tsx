
import React from 'react';
import DashboardCard from './DashboardCard';

const WeatherIntelligencePanel = () => {
  return (
    <DashboardCard title="Weather Intelligence">
      <div className="text-gray-300">
        <p>Live weather data</p>
        <p>Severe weather alerts</p>
        <p>Inspection safety cues</p>
      </div>
    </DashboardCard>
  );
};

export default WeatherIntelligencePanel;
