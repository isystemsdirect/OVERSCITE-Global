import React from 'react';
import type { FlightController, DroneConfiguration } from '@/lib/drone-types';

interface FlightControllerConfigProps {
  droneId: string;
  config: FlightController;
  onChange: (fc: FlightController) => void;
}

export const FlightControllerConfig: React.FC<FlightControllerConfigProps> = ({ config }) => {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
      <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Flight Controller Configuration</h2>
      <pre className="text-[10px] text-gray-500">{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
};
