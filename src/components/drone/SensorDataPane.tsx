import { SensorArray } from '@/lib/drone-types';

interface SensorDataPaneProps {
  sensorData: SensorArray;
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
