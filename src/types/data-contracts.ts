/**
 * @classification DATA_CONTRACT
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Defines the canonical data structures for the Normalized Metric Store.
 * Ensures that all data consumed by PanelEngine instruments is consistent,
 * typed, and adheres to the Single Source of Truth principle.
 */

// Represents a validated weather alert from any external source.
export interface NormalizedWeatherAlert {
  id: string;
  severity: number; // 1 (low) to 5 (extreme)
  region: string;
  timestamp: number; // UTC epoch seconds
  sourceSignature: string; // Hash of the source identifier
}

// Represents a validated geospatial asset.
export interface NormalizedGeospatialAsset {
  id: string;
  coordinates: [number, number]; // [lon, lat]
  status: 'nominal' | 'off-grid' | 'maintenance' | 'unknown';
  timestamp: number; // UTC epoch seconds
  sourceSignature: string;
}

// Represents a validated dispatch event.
export interface NormalizedDispatchEvent {
  id: string;
  type: 'emergency' | 'utility' | 'security' | 'maintenance';
  priority: number; // 1 (low) to 5 (critical)
  timestamp: number; // UTC epoch seconds
  sourceSignature: string;
}

// Represents the overall confidence and state of a data stream.
export interface DataStreamState<T> {
  data: T[];
  confidence: 'LIVE' | 'CACHED' | 'DELAYED' | 'STALE' | 'INVALID';
  lastUpdated: number; // UTC epoch seconds
  latency: number; // ms
}

// The unified schema for the Normalized Metric Store.
export interface NormalizedMetricStoreState {
  weatherAlerts: DataStreamState<NormalizedWeatherAlert>;
  geospatialAssets: DataStreamState<NormalizedGeospatialAsset>;
  dispatchEvents: DataStreamState<NormalizedDispatchEvent>;
}
