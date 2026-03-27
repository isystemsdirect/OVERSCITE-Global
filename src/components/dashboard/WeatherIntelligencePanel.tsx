
import React from 'react';
import DashboardCard from './DashboardCard';
import { CloudRain } from 'lucide-react';

const WeatherIntelligencePanel = () => {
  return (
    <DashboardCard 
      title="Weather Intelligence"
      headerContent={<CloudRain className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>Live weather data</p>
        <p>Severe weather alerts</p>
        <p>Inspection safety cues</p>
      </div>
    </DashboardCard>
  );
};

export default WeatherIntelligencePanel;
