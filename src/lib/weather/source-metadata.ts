/**
 * @classification WEATHER_INTELLIGENCE_METADATA
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Source provenance, cache state, and trust metadata for every
 * normalized weather payload. Required per Calibration 5:
 * "Provenance now, not later."
 *
 * Every weather response envelope and every alert/signal object
 * must carry these fields for audit, attribution, and truth-state
 * integrity.
 */

import { createHash } from 'crypto';

// ─── Cache State ─────────────────────────────────────────────────

/**
 * Describes whether this data was served from cache or fetched live.
 * Must never mislabel cache as current-live.
 */
export type CacheState =
  | 'live'         // Freshly fetched from upstream source
  | 'cached'       // Served from local cache; within staleness window
  | 'stale_cache'  // Served from cache but beyond staleness window
  | 'mock';        // Generated from mock/demo data

// ─── Display Mode ────────────────────────────────────────────────

/**
 * What class of weather surface this data represents.
 * Enforces Calibration 4: truth-state separation.
 */
export type WeatherDisplayMode =
  | 'observed_point'     // Current conditions from observation source
  | 'forecast_hourly'    // Hourly forecast model output
  | 'forecast_daily'     // Daily forecast model output
  | 'active_alert'       // Warning/watch/advisory
  | 'observed_raster'    // Observed radar/satellite tile overlay
  | 'forecast_raster'    // Forecast model tile overlay
  | 'storm_vector'       // Storm intelligence vector (SPC/NWS)
  | 'mock';              // Mock/demo data

// ─── Confidence Class ────────────────────────────────────────────

/**
 * Coarse confidence classification for UI display.
 * Maps from SCING certaintyScore ranges.
 */
export type ConfidenceClass =
  | 'high'       // certaintyScore >= 0.85
  | 'moderate'   // certaintyScore >= 0.6
  | 'low'        // certaintyScore >= 0.4
  | 'degraded';  // certaintyScore < 0.4

export const confidenceClassFromScore = (score: number): ConfidenceClass => {
  if (score >= 0.85) return 'high';
  if (score >= 0.6) return 'moderate';
  if (score >= 0.4) return 'low';
  return 'degraded';
};

// ─── Source Metadata ─────────────────────────────────────────────

export type SourceMetadata = {
  /** Provider identifier (e.g., 'nws', 'openweather', 'tomorrow_io') */
  provider: string;

  /** Specific dataset or product name (e.g., 'NWS Grid Forecast', 'MRMS Composite') */
  datasetOrProduct: string;

  /** When the data was fetched from the upstream source (ISO 8601 UTC) */
  fetchedAtUtc: string;

  /** Last-Modified header or equivalent from upstream, if available */
  sourceLastModifiedAt?: string;

  /** SHA-256 hash of the raw response body for dedup and audit */
  rawHash: string;

  /** Cache state at time of serving */
  cacheState: CacheState;

  /** What class of weather surface this payload represents */
  displayMode: WeatherDisplayMode;

  /** Coarse confidence classification, if applicable */
  confidenceClass?: ConfidenceClass;

  /** Geographic coverage bounds, if bounded (e.g., CONUS-only) */
  coverageBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  /**
   * NOAA attribution requirement:
   * "Data from NOAA. No implied endorsement."
   * Populated per-provider to satisfy NOAA open data policy.
   */
  attribution?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Compute SHA-256 hash of a raw response body for provenance tracking.
 * Used server-side only.
 */
export const computeRawHash = (body: string): string => {
  return createHash('sha256').update(body).digest('hex').substring(0, 16);
};

/**
 * Build a SourceMetadata object with required fields populated.
 */
export const buildSourceMetadata = (opts: {
  provider: string;
  datasetOrProduct: string;
  rawBody: string;
  cacheState: CacheState;
  displayMode: WeatherDisplayMode;
  sourceLastModifiedAt?: string;
  confidenceClass?: ConfidenceClass;
  coverageBounds?: SourceMetadata['coverageBounds'];
  attribution?: string;
}): SourceMetadata => ({
  provider: opts.provider,
  datasetOrProduct: opts.datasetOrProduct,
  fetchedAtUtc: new Date().toISOString(),
  sourceLastModifiedAt: opts.sourceLastModifiedAt,
  rawHash: computeRawHash(opts.rawBody),
  cacheState: opts.cacheState,
  displayMode: opts.displayMode,
  confidenceClass: opts.confidenceClass,
  coverageBounds: opts.coverageBounds,
  attribution: opts.attribution,
});

/**
 * Standard NOAA attribution string per NOAA Open Data policy.
 */
export const NOAA_ATTRIBUTION =
  'Data from NOAA/NWS. NOAA does not endorse or approve this product.';
