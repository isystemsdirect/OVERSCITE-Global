/**
 * @classification PANEL
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulatedMetric } from '../../../hooks/useSimulatedMetric';

interface TimeSeriesData {
  time: string;
  value: number;
}

const TimeSeriesPanel: React.FC = () => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const currentValue = useSimulatedMetric(50, 10);

  useEffect(() => {
    const now = new Date();
    const newEntry = {
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      value: currentValue,
    };

    setData(prevData => {
      const updatedData = [...prevData, newEntry];
      // Keep the dataset to a maximum of 30 points
      return updatedData.length > 30 ? updatedData.slice(updatedData.length - 30) : updatedData;
    });
  }, [currentValue]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
        <XAxis dataKey="time" stroke="#ffffff80" fontSize={12} />
        <YAxis stroke="#ffffff80" fontSize={12} domain={[0, 100]}/>
        <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}/>
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} isAnimationActive={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesPanel;
