/**
 * @classification NORMALIZED_METRIC_STORE
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * The single source of truth for all instrument data in SCINGULAR.
 * Manages the state of normalized data streams, ensuring panels are always
 * displaying validated, consistent, and up-to-date information.
 */

import { create } from 'zustand';
import { 
  NormalizedMetricStoreState,
  DataStreamState,
  NormalizedWeatherAlert,
  NormalizedGeospatialAsset,
  NormalizedDispatchEvent,
} from '../types/data-contracts';
import {
  adaptWeatherAlerts,
  adaptGeospatialAssets,
  adaptDispatchEvents,
} from './adapter-layer';
import { validateAndScore } from './integrity-guard';

const useMetricStore = create<NormalizedMetricStoreState>(() => ({
  weatherAlerts: { data: [], confidence: 'CACHED', lastUpdated: 0, latency: 0 },
  geospatialAssets: { data: [], confidence: 'CACHED', lastUpdated: 0, latency: 0 },
  dispatchEvents: { data: [], confidence: 'CACHED', lastUpdated: 0, latency: 0 },
}));

export const useDataStream = <T extends keyof NormalizedMetricStoreState>(
  streamName: T
): NormalizedMetricStoreState[T] => {
  return useMetricStore(state => state[streamName]);
};

// This function simulates the data ingestion pipeline.
export const refreshDataStreams = () => {
  const isTestMode = process.env.NEXT_PUBLIC_SYSTEM_MODE === 'TEST';

  if (!isTestMode) {
    console.warn('LIVE mode not implemented. No data will be fetched.');
    return;
  }

  // --- Weather Alerts Stream ---
  let startTime = Date.now();
  const rawWeather = adaptWeatherAlerts();
  const validatedWeather = validateAndScore(rawWeather, startTime);

  // --- Geospatial Assets Stream ---
  startTime = Date.now();
  const rawGeo = adaptGeospatialAssets();
  const validatedGeo = validateAndScore(rawGeo, startTime);

  // --- Dispatch Events Stream ---
  startTime = Date.now();
  const rawDispatch = adaptDispatchEvents();
  const validatedDispatch = validateAndScore(rawDispatch, startTime);

  // --- Update State ---
  useMetricStore.setState({
    weatherAlerts: validatedWeather,
    geospatialAssets: validatedGeo,
    dispatchEvents: validatedDispatch,
  });
};

// Initialize and periodically refresh the data in TEST mode
if (process.env.NEXT_PUBLIC_SYSTEM_MODE === 'TEST') {
  refreshDataStreams(); // Initial fetch
  setInterval(refreshDataStreams, 5000); // Refresh every 5 seconds
}

export default useMetricStore;

