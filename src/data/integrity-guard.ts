/**
 * @classification INTEGRITY_GUARD
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Enforces data integrity by validating, scoring, and timestamping all
 * incoming data from the Adapter Layer before it reaches the Normalized
 * Metric Store. Rejects or flags data that fails validation.
 */

import { DataStreamState } from '../types/data-contracts';

const MOCK_SIGNATURE_KEY = 'scing-ultra-grade-key'; // In production, this would be a real secret
const MAX_LATENCY_MS = 2000; // Max acceptable delay
const MAX_AGE_MS = 60000; // Max acceptable data age

// A mock signature verification
const verifySignature = (signature: string): boolean => {
  return signature.startsWith('sig_');
};

export const validateAndScore = <T extends { id: string; timestamp: number; sourceSignature: string }>(data: T[], startTime: number): DataStreamState<T> => {
  const endTime = Date.now();
  const latency = endTime - startTime;

  let confidence: DataStreamState<T>['confidence'] = 'LIVE';
  let validData = [];

  if (latency > MAX_LATENCY_MS) {
    confidence = 'DELAYED';
  }

  for (const item of data) {
    const age = endTime - item.timestamp;
    if (age > MAX_AGE_MS) {
      confidence = 'STALE';
      // In a stricter system, we might filter out stale items
    }
    if (!verifySignature(item.sourceSignature)) {
      // Reject the entire batch if one signature is invalid
      return {
        data: [],
        confidence: 'INVALID',
        lastUpdated: endTime,
        latency,
      };
    }
    validData.push(item);
  }

  return {
    data: validData,
    confidence,
    lastUpdated: endTime,
    latency,
  };
};
