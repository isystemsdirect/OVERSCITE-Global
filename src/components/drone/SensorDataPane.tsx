import React from 'react';
import type { SensorData } from '@/lib/drone-types';

interface SensorDataPaneProps {
  sensorData: SensorData;
  droneId: string;
  onSensorToggle: (sensorId: string, enabled: boolean) => void;
}

export const SensorDataPane: React.FC<SensorDataPaneProps> = ({ sensorData }) => {
  return (
    <div>
      <h2>Sensor Data</h2>
      <pre>{JSON.stringify(sensorData, null, 2)}</pre>
    </div>
  );
};
