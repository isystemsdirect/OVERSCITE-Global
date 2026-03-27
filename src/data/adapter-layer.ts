/**
 * @classification ADAPTER_LAYER
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Normalizes heterogeneous data from external sources into the canonical
 * format defined by data-contracts.ts. Acts as the entry point for all
 * external data entering the OVERSCITE system.
 */

import {
  generateWeatherAlerts,
  generateGeospatialAssets,
  generateDispatchEvents,
} from './simulation-engine';
import { 
  NormalizedWeatherAlert, 
  NormalizedGeospatialAsset, 
  NormalizedDispatchEvent 
} from '../types/data-contracts';

// In a LIVE system, these functions would fetch from real APIs.
// In TEST mode, they use the simulation engine.

const fetchRawWeatherAlerts = () => {
  // Represents a fetch from a source like NOAA Weather API
  return generateWeatherAlerts(5);
};

const fetchRawGeospatialAssets = () => {
  // Represents a fetch from a Geospatial Map Provider
  return generateGeospatialAssets(10);
};

const fetchRawDispatchEvents = () => {
  // Represents a connection to a Live Dispatch Event Stream
  return generateDispatchEvents(3);
};

// --- Adapters ---

export const adaptWeatherAlerts = (): NormalizedWeatherAlert[] => {
  const rawAlerts = fetchRawWeatherAlerts();
  // In a real adapter, you'd map fields, validate, and transform.
  // Here, the simulation already provides the correct format.
  return rawAlerts;
};

export const adaptGeospatialAssets = (): NormalizedGeospatialAsset[] => {
  const rawAssets = fetchRawGeospatialAssets();
  return rawAssets;
};

export const adaptDispatchEvents = (): NormalizedDispatchEvent[] => {
  const rawEvents = fetchRawDispatchEvents();
  return rawEvents;
};
