
import React from 'react';
import DashboardCard from './DashboardCard';
import { Newspaper } from 'lucide-react';

const IndustryNewsPanel = () => {
  return (
    <DashboardCard 
      title="Inspection Industry News"
      headerContent={<Newspaper className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>RSS/news feed aggregation</p>
        <p>Inspection industry updates</p>
        <p>Regulatory / standards watch</p>
      </div>
    </DashboardCard>
  );
};

export default IndustryNewsPanel;
