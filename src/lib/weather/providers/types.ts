/**
 * @classification WEATHER_INTELLIGENCE_CONTRACT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Provider-abstracted contracts for federated weather intelligence.
 * Separates point intelligence, tile overlay, vector intelligence,
 * and forecast frame concerns into distinct provider interfaces.
 *
 * NOAA-first posture: NWS is the initial authoritative source for
 * U.S. point forecast and alerts. Provider abstraction ensures no
 * permanent single-provider lock-in.
 */

import type { WeatherSignal } from '@rtsf/weather/contracts/weatherSignal';
import type { UnifiedForecastModel } from '@/lib/weather/types';
import type { SourceMetadata } from '@/lib/weather/source-metadata';

// ─── Point Intelligence Provider ─────────────────────────────────

export type PointMetadata = {
  lat: number;
  lon: number;
  timezone: string;
  timezoneOffset: number;
  gridId?: string;       // NWS WFO grid identifier
  gridX?: number;
  gridY?: number;
  forecastUrl?: string;   // Provider-specific follow link
  hourlyUrl?: string;
  stationId?: string;
  elevation?: { value: number; unitCode: string };
};

export type PointForecastResult = {
  model: UnifiedForecastModel;
  signals: WeatherSignal[];
  meta: SourceMetadata;
};

export type PointAlertResult = {
  alerts: WeatherSignal[];
  meta: SourceMetadata;
};

export interface PointWeatherProvider {
  readonly providerId: string;
  readonly providerName: string;

  fetchPointMetadata(lat: number, lon: number): Promise<PointMetadata>;
  fetchForecast(lat: number, lon: number): Promise<PointForecastResult>;
  fetchHourlyForecast(lat: number, lon: number): Promise<PointForecastResult>;
  fetchActiveAlerts(lat: number, lon: number): Promise<PointAlertResult>;
}

// ─── Tile Overlay Provider ───────────────────────────────────────

export type TileDisplayMode =
  | 'observed_radar'
  | 'observed_cloud'
  | 'observed_lightning'
  | 'forecast_precip'
  | 'forecast_wind'
  | 'forecast_temp'
  | 'forecast_cloud';

export type TileCoverageBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type TileLayerConfig = {
  id: string;
  name: string;
  displayMode: TileDisplayMode;
  attribution: string;
  coverageBounds: TileCoverageBounds;
  defaultOpacity: number;
  minZoom?: number;
  maxZoom?: number;
  updateCadenceMs?: number;
};

export interface TileOverlayProvider {
  readonly providerId: string;
  readonly providerName: string;

  getTileUrl(
    layerId: string,
    timestamp: string | null,
    x: number,
    y: number,
    z: number
  ): string | null;

  getCoverageBounds(layerId: string, timestamp?: string): TileCoverageBounds;
  getAttribution(layerId: string): string;
  getDisplayMode(layerId: string): TileDisplayMode;
  getAvailableLayers(): TileLayerConfig[];
}

// ─── Vector Intelligence Provider ────────────────────────────────

export type VectorFeature = {
  id: string;
  type: 'polygon' | 'point' | 'line';
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, unknown>;
  meta: SourceMetadata;
};

export type VectorQueryBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type VectorTimeWindow = {
  hoursBack: number; // e.g. 24, 48, 72
};

export interface VectorIntelProvider {
  readonly providerId: string;
  readonly providerName: string;

  fetchStormOutlooks(bounds: VectorQueryBounds): Promise<VectorFeature[]>;
  fetchMesoscaleDiscussions(bounds: VectorQueryBounds): Promise<VectorFeature[]>;
  fetchLocalStormReports(
    bounds: VectorQueryBounds,
    window: VectorTimeWindow
  ): Promise<VectorFeature[]>;
  fetchAlertPolygons(bounds: VectorQueryBounds): Promise<VectorFeature[]>;
}

// ─── Forecast Frame Provider (Phase 4 Preparatory) ───────────────

export type ForecastHorizon = '6h' | '12h' | '24h' | '72h';

export type ForecastFrame = {
  timestamp: string; // ISO 8601 UTC
  layerId: string;
  available: boolean;
};

export interface ForecastFrameProvider {
  readonly providerId: string;
  readonly providerName: string;

  getAvailableFrames(layerId: string, horizon: ForecastHorizon): Promise<ForecastFrame[]>;
  getFrameTileUrl(
    layerId: string,
    frameTimestamp: string,
    x: number,
    y: number,
    z: number
  ): string | null;
  getFrameCoverageBounds(layerId: string, frameTimestamp: string): TileCoverageBounds;
}
