/**
 * @classification PANEL
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

import React from 'react';
import { useSimulatedMetric } from '../../../hooks/useSimulatedMetric';

const GaugePanel: React.FC = () => {
  const value = useSimulatedMetric(75, 5);
  const percentage = Math.round(value);

  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          stroke="#ffffff20"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="60"
          cy="60"
        />
        <circle
          stroke="#8884d8"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
          r="45"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="24"
          fontWeight="bold"
          fill="white"
        >
          {`${percentage}%`}
        </text>
      </svg>
    </div>
  );
};

export default GaugePanel;
