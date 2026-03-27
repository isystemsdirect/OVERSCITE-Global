
import React from 'react';
import DashboardCard from './DashboardCard';
import { Database } from 'lucide-react';

const EvidenceChainQueuePanel = () => {
  return (
    <DashboardCard 
      title="Evidence Chain Queue"
      headerContent={<Database className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col h-full gap-2 justify-center text-sm text-muted-foreground">
        <p>Pending evidence</p>
        <p>Chain-of-custody issues</p>
        <p>Ready-for-report items</p>
      </div>
    </DashboardCard>
  );
};

export default EvidenceChainQueuePanel;
