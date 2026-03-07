import React from 'react';
import type { ComplianceStatus } from '@/lib/drone-types';

interface FAACompliancePanelProps {
  droneId: string;
  complianceStatus?: ComplianceStatus;
}

export const FAACompliancePanel: React.FC<FAACompliancePanelProps> = ({ complianceStatus }) => {
  return (
    <div>
      <h2>FAA Compliance</h2>
      <pre>{JSON.stringify(complianceStatus, null, 2)}</pre>
    </div>
  );
};
