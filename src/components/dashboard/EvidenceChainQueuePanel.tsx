
import React from 'react';
import DashboardCard from './DashboardCard';

const EvidenceChainQueuePanel = () => {
  return (
    <DashboardCard title="Evidence Chain Queue">
      <div className="text-gray-300">
        <p>Pending evidence</p>
        <p>Chain-of-custody issues</p>
        <p>Ready-for-report items</p>
      </div>
    </DashboardCard>
  );
};

export default EvidenceChainQueuePanel;
