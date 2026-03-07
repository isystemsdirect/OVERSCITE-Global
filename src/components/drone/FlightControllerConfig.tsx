import React from 'react';
import type { FlightConfig, DroneConfig } from '@/lib/drone-types';

interface FlightControllerConfigProps {
  droneId: string;
  currentConfig?: FlightConfig;
  onConfigUpdate?: (config: DroneConfig) => void;
}

export const FlightControllerConfig: React.FC<FlightControllerConfigProps> = ({ currentConfig }) => {
  return (
    <div>
      <h2>Flight Controller Configuration</h2>
      <pre>{JSON.stringify(currentConfig, null, 2)}</pre>
    </div>
  );
};
