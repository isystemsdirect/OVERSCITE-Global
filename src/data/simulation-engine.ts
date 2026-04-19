/**
 * @classification SIMULATION_ENGINE
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Generates deterministic, high-fidelity data streams for TEST mode.
 * Simulates a range of operational conditions to ensure instrument resilience
 * and accurate behavior under stress.
 */

import { 
  NormalizedWeatherAlert, 
  NormalizedGeospatialAsset, 
  NormalizedDispatchEvent 
} from '../types/data-contracts';

// A simple seedable PRNG for deterministic results.
let seed = 1337;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const createSignature = (id: string) => `sig_${id.slice(0, 4)}_${Math.floor(seededRandom() * 9000) + 1000}`;

// --- Simulation Generators ---

export const generateWeatherAlerts = (count: number): NormalizedWeatherAlert[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `w_alert_${i}`,
    severity: Math.floor(seededRandom() * 5) + 1,
    region: `Region ${String.fromCharCode(65 + i % 5)}`,
    timestamp: Date.now() - Math.floor(seededRandom() * 60000),
    sourceSignature: createSignature(`w_alert_${i}`),
  }));
};

export const generateGeospatialAssets = (count: number): NormalizedGeospatialAsset[] => {
  const statuses: NormalizedGeospatialAsset['status'][] = ['nominal', 'off-grid', 'maintenance', 'unknown'];
  return Array.from({ length: count }, (_, i) => ({
    id: `geo_asset_${i}`,
    coordinates: [ (seededRandom() * 180 - 90), (seededRandom() * 360 - 180) ],
    status: statuses[i % statuses.length],
    timestamp: Date.now() - Math.floor(seededRandom() * 120000),
    sourceSignature: createSignature(`geo_asset_${i}`),
  }));
};

export const generateDispatchEvents = (count: number): NormalizedDispatchEvent[] => {
  const types: NormalizedDispatchEvent['type'][] = ['emergency', 'utility', 'security', 'maintenance'];
  return Array.from({ length: count }, (_, i) => ({
    id: `disp_event_${i}`,
    type: types[i % types.length],
    priority: Math.floor(seededRandom() * 5) + 1,
    timestamp: Date.now() - Math.floor(seededRandom() * 30000),
    sourceSignature: createSignature(`disp_event_${i}`),
  }));
};

// --- Simulation Behaviors ---

// Example of a volatility spike simulation
export const injectVolatilitySpike = (assets: NormalizedGeospatialAsset[]): NormalizedGeospatialAsset[] => {
  if (assets.length > 2) {
    assets[1].status = 'off-grid';
    assets[1].timestamp = Date.now();
  }
  return assets;
};
