import { Metadata } from 'next';
import { RecognitionGovernanceDashboard } from '@/components/archive/recognition-governance-dashboard';

export const metadata: Metadata = {
  title: 'Recognition Governance | ArcHive™',
  description: 'Manage taxonomy, thresholds, and routing policies for the OVERSCITE recognition stack.',
};

export default function RecognitionGovernancePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex max-w-7xl mx-auto w-full">
        <RecognitionGovernanceDashboard />
      </div>
    </div>
  );
}
