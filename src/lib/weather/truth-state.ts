/**
 * @classification WEATHER_INTELLIGENCE_TRUTHSTATE
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Truth-state labeling system for weather surfaces.
 * Enforces Calibration 4: "Observed is not forecast. Forecast is not
 * radar. Raster visualization is not the same thing as authoritative
 * point intelligence."
 *
 * Every weather UI surface must disclose its mode and source class.
 */

import type { WeatherDisplayMode, CacheState, ConfidenceClass } from './source-metadata';

// ─── Truth-State Label ───────────────────────────────────────────

export type TruthStateLabel = {
  /** Human-readable short label for UI display */
  label: string;

  /** Whether this represents observed (live) or modeled (forecast) data */
  temporalMode: 'observed' | 'forecast' | 'alert' | 'mock';

  /** Whether this is point data, raster overlay, or vector intelligence */
  spatialMode: 'point' | 'raster' | 'vector';

  /** The underlying display mode for detailed classification */
  displayMode: WeatherDisplayMode;

  /** Cache freshness state */
  cacheState: CacheState;

  /** Confidence classification if applicable */
  confidenceClass?: ConfidenceClass;

  /** Provider attribution string */
  attribution?: string;
};

// ─── Label Derivation ────────────────────────────────────────────

/**
 * Derive a human-facing truth-state label from display mode and cache state.
 * This function ensures no weather surface exists without explicit classification.
 */
export const deriveTruthStateLabel = (
  displayMode: WeatherDisplayMode,
  cacheState: CacheState,
  opts?: {
    confidenceClass?: ConfidenceClass;
    attribution?: string;
  }
): TruthStateLabel => {
  const base = TRUTH_STATE_MAP[displayMode];

  return {
    ...base,
    displayMode,
    cacheState,
    confidenceClass: opts?.confidenceClass,
    attribution: opts?.attribution,
  };
};

/**
 * Canonical mapping from display mode to truth-state classification.
 * This prevents any weather surface from being ambiguously labeled.
 */
const TRUTH_STATE_MAP: Record<
  WeatherDisplayMode,
  Pick<TruthStateLabel, 'label' | 'temporalMode' | 'spatialMode'>
> = {
  observed_point: {
    label: 'LIVE · Point Observation',
    temporalMode: 'observed',
    spatialMode: 'point',
  },
  forecast_hourly: {
    label: 'FORECAST · Hourly Model',
    temporalMode: 'forecast',
    spatialMode: 'point',
  },
  forecast_daily: {
    label: 'FORECAST · Daily Model',
    temporalMode: 'forecast',
    spatialMode: 'point',
  },
  active_alert: {
    label: 'ALERT · Active Warning',
    temporalMode: 'alert',
    spatialMode: 'point',
  },
  observed_raster: {
    label: 'LIVE · Observed Overlay',
    temporalMode: 'observed',
    spatialMode: 'raster',
  },
  forecast_raster: {
    label: 'FORECAST · Model Overlay',
    temporalMode: 'forecast',
    spatialMode: 'raster',
  },
  storm_vector: {
    label: 'INTEL · Storm Vector',
    temporalMode: 'observed',
    spatialMode: 'vector',
  },
  mock: {
    label: 'DEMO · Mock Data',
    temporalMode: 'mock',
    spatialMode: 'point',
  },
};

// ─── UI Badge Helpers ────────────────────────────────────────────

/**
 * Returns a compact badge string for inline UI display.
 * Examples: "LIVE", "FORECAST", "ALERT", "DEMO", "STALE"
 */
export const getTruthStateBadge = (label: TruthStateLabel): string => {
  if (label.cacheState === 'stale_cache') return 'STALE';
  if (label.cacheState === 'mock') return 'DEMO';

  switch (label.temporalMode) {
    case 'observed':
      return 'LIVE';
    case 'forecast':
      return 'FORECAST';
    case 'alert':
      return 'ALERT';
    case 'mock':
      return 'DEMO';
    default:
      return 'UNKNOWN';
  }
};

/**
 * Returns the appropriate color class for truth-state UI badges.
 */
export const getTruthStateBadgeColor = (label: TruthStateLabel): string => {
  if (label.cacheState === 'stale_cache') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  if (label.cacheState === 'mock') return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';

  switch (label.temporalMode) {
    case 'observed':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'forecast':
      return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
    case 'alert':
      return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    default:
      return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  }
};
