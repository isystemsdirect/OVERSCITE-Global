/**
 * @classification HOOK
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Generates a deterministic, volatile metric for TEST mode.
 * Provides a clean, reusable data stream for panel development and
 * stress testing, active only when NEXT_PUBLIC_SYSTEM_MODE is 'TEST'.
 */

import { useState, useEffect } from 'react';

const isTestMode = process.env.NEXT_PUBLIC_SYSTEM_MODE === 'TEST';

let seed = 1; // Simple seed for deterministic chaos
const deterministicRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const useSimulatedMetric = (initialValue: number, volatility: number) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (!isTestMode) return;

    const interval = setInterval(() => {
      setValue(prev => {
        const change = (deterministicRandom() - 0.5) * volatility;
        let newValue = prev + change;
        // Clamp the value between 0 and 100
        newValue = Math.max(0, Math.min(100, newValue));
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [volatility]);

  return value;
};
