/**
 * @classification WEATHER_INTELLIGENCE_PROVIDER
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * NWS (National Weather Service) Point Weather Provider.
 * Implements PointWeatherProvider interface for U.S. coverage.
 *
 * Requirements:
 * - User-Agent header with application name and contact info (NWS policy)
 * - Server-side only (no browser Firebase SDK)
 * - Rate-limit awareness with backoff on HTTP 429
 * - Cache-first reads per WCB-10 posture
 */

import type { PointWeatherProvider, PointMetadata, PointForecastResult, PointAlertResult } from './types';
import type { WeatherSignal } from '@rtsf/weather/contracts/weatherSignal';
import { nwsForecastToUnifiedModel, nwsAlertsToWeatherSignals } from '@/lib/weather/nws-normalizer';
import { buildSourceMetadata, computeRawHash, NOAA_ATTRIBUTION } from '@/lib/weather/source-metadata';

// ─── Configuration ───────────────────────────────────────────────

const NWS_BASE_URL = 'https://api.weather.gov';
const NWS_USER_AGENT = 'SCINGULAR (contact@SCINGULAR.io)';

const NWS_HEADERS: HeadersInit = {
  'User-Agent': NWS_USER_AGENT,
  'Accept': 'application/geo+json',
};

// ─── Simple In-Memory Cache ──────────────────────────────────────

type CacheEntry = {
  data: unknown;
  rawBody: string;
  fetchedAt: number;
  ttlMs: number;
};

const cache = new Map<string, CacheEntry>();

const getCached = <T>(key: string): { data: T; rawBody: string; fromCache: true } | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > entry.ttlMs) {
    cache.delete(key);
    return null;
  }
  return { data: entry.data as T, rawBody: entry.rawBody, fromCache: true };
};

const setCache = (key: string, data: unknown, rawBody: string, ttlMs: number) => {
  cache.set(key, { data, rawBody, fetchedAt: Date.now(), ttlMs });
};

// ─── NWS Fetch with Retry ────────────────────────────────────────

const fetchNws = async (url: string): Promise<{ json: unknown; rawBody: string }> => {
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, { headers: NWS_HEADERS });

    if (res.status === 429) {
      // WCB-10 mandated backoff on rate limit
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.warn(`[NWS] Rate limited (429). Backing off ${backoffMs}ms. Attempt ${attempt + 1}/${maxRetries + 1}`);
      await new Promise((r) => setTimeout(r, backoffMs));
      continue;
    }

    if (!res.ok) {
      throw new Error(`[NWS] HTTP ${res.status} ${res.statusText} for ${url}`);
    }

    const rawBody = await res.text();
    const json = JSON.parse(rawBody);
    return { json, rawBody };
  }

  throw new Error(`[NWS] Rate limit exceeded after ${maxRetries + 1} attempts for ${url}`);
};

// ─── Provider Implementation ─────────────────────────────────────

export class NwsPointProvider implements PointWeatherProvider {
  readonly providerId = 'nws';
  readonly providerName = 'National Weather Service';

  async fetchPointMetadata(lat: number, lon: number): Promise<PointMetadata> {
    const cacheKey = `nws:points:${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = getCached<PointMetadata>(cacheKey);
    if (cached) return cached.data;

    const { json } = await fetchNws(`${NWS_BASE_URL}/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
    const props = (json as any).properties;

    const meta: PointMetadata = {
      lat,
      lon,
      timezone: props.timeZone ?? 'America/New_York',
      timezoneOffset: 0, // Will be computed from timezone
      gridId: props.gridId,
      gridX: props.gridX,
      gridY: props.gridY,
      forecastUrl: props.forecast,
      hourlyUrl: props.forecastHourly,
      stationId: props.observationStations?.split('/').pop(),
      elevation: props.elevation,
    };

    setCache(cacheKey, meta, JSON.stringify(meta), 24 * 60 * 60 * 1000); // 24h TTL
    return meta;
  }

  async fetchForecast(lat: number, lon: number): Promise<PointForecastResult> {
    const pointMeta = await this.fetchPointMetadata(lat, lon);
    if (!pointMeta.forecastUrl) {
      throw new Error(`[NWS] No forecast URL for point ${lat},${lon}`);
    }

    const cacheKey = `nws:forecast:${pointMeta.gridId}:${pointMeta.gridX},${pointMeta.gridY}`;
    const cached = getCached<any>(cacheKey);

    let json: any;
    let rawBody: string;
    let cacheState: 'live' | 'cached' = 'live';

    if (cached) {
      json = cached.data;
      rawBody = cached.rawBody;
      cacheState = 'cached';
    } else {
      const result = await fetchNws(pointMeta.forecastUrl);
      json = result.json;
      rawBody = result.rawBody;
      setCache(cacheKey, json, rawBody, 30 * 60 * 1000); // 30min TTL per WCB-10 stale policy
    }

    // Also fetch hourly for current conditions
    const hourlyResult = await this.fetchHourlyForecast(lat, lon);

    const model = nwsForecastToUnifiedModel({
      lat,
      lon,
      timezone: pointMeta.timezone,
      timezoneOffset: pointMeta.timezoneOffset,
      gridForecastPeriods: json.properties?.periods ?? [],
      hourlyPeriods: hourlyResult.model.hourly.length > 0
        ? json.properties?.periods ?? []
        : [],
      alerts: undefined, // Alerts fetched separately
    });

    // Merge hourly data from dedicated hourly endpoint
    model.hourly = hourlyResult.model.hourly;
    model.current = hourlyResult.model.current;

    const meta = buildSourceMetadata({
      provider: 'nws',
      datasetOrProduct: 'NWS Grid Forecast',
      rawBody,
      cacheState,
      displayMode: 'forecast_daily',
      attribution: NOAA_ATTRIBUTION,
    });

    return {
      model,
      signals: hourlyResult.signals, // Hourly signals are more useful
      meta,
    };
  }

  async fetchHourlyForecast(lat: number, lon: number): Promise<PointForecastResult> {
    const pointMeta = await this.fetchPointMetadata(lat, lon);
    if (!pointMeta.hourlyUrl) {
      throw new Error(`[NWS] No hourly forecast URL for point ${lat},${lon}`);
    }

    const cacheKey = `nws:hourly:${pointMeta.gridId}:${pointMeta.gridX},${pointMeta.gridY}`;
    const cached = getCached<any>(cacheKey);

    let json: any;
    let rawBody: string;
    let cacheState: 'live' | 'cached' = 'live';

    if (cached) {
      json = cached.data;
      rawBody = cached.rawBody;
      cacheState = 'cached';
    } else {
      const result = await fetchNws(pointMeta.hourlyUrl);
      json = result.json;
      rawBody = result.rawBody;
      setCache(cacheKey, json, rawBody, 30 * 60 * 1000);
    }

    const periods = json.properties?.periods ?? [];

    const model = nwsForecastToUnifiedModel({
      lat,
      lon,
      timezone: pointMeta.timezone,
      timezoneOffset: pointMeta.timezoneOffset,
      gridForecastPeriods: [],
      hourlyPeriods: periods,
    });

    const rawHash = computeRawHash(rawBody);

    // Build WeatherSignals for the hourly periods
    const signals: WeatherSignal[] = periods.slice(0, 24).map((p: any) => ({
      schemaVersion: '1.0' as const,
      source: {
        provider: 'nws',
        fetchedAtUtc: new Date().toISOString(),
        rawHash,
      },
      geo: { lat, lon, tz: pointMeta.timezone },
      atUtc: p.startTime,
      kind: 'hourly' as const,
      certaintyScore: 0.8,
      severityIndex: 0,
      metrics: {
        tempC: fahrenheitToCelsius(p.temperature),
        humidityPct: p.relativeHumidity?.value ?? undefined,
        windKph: parseWindSpeedMph(p.windSpeed) * 1.60934,
        windDeg: windDirectionToDeg(p.windDirection),
        cloudPct: estimateCloudPercent(p.shortForecast),
      },
      hazards: [],
    }));

    const meta = buildSourceMetadata({
      provider: 'nws',
      datasetOrProduct: 'NWS Hourly Forecast',
      rawBody,
      cacheState,
      displayMode: 'forecast_hourly',
      attribution: NOAA_ATTRIBUTION,
    });

    return { model, signals, meta };
  }

  async fetchActiveAlerts(lat: number, lon: number): Promise<PointAlertResult> {
    const url = `${NWS_BASE_URL}/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cacheKey = `nws:alerts:${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = getCached<any>(cacheKey);

    let json: any;
    let rawBody: string;
    let cacheState: 'live' | 'cached' = 'live';

    if (cached) {
      json = cached.data;
      rawBody = cached.rawBody;
      cacheState = 'cached';
    } else {
      const result = await fetchNws(url);
      json = result.json;
      rawBody = result.rawBody;
      setCache(cacheKey, json, rawBody, 5 * 60 * 1000); // 5min TTL for alerts
    }

    const features = json.features ?? [];
    const rawHash = computeRawHash(rawBody);
    const signals = nwsAlertsToWeatherSignals(features, { lat, lon }, rawHash);

    const meta = buildSourceMetadata({
      provider: 'nws',
      datasetOrProduct: 'NWS Active Alerts',
      rawBody,
      cacheState,
      displayMode: 'active_alert',
      attribution: NOAA_ATTRIBUTION,
    });

    return { alerts: signals, meta };
  }
}

// ─── Local Helpers ───────────────────────────────────────────────

const fahrenheitToCelsius = (f: number): number => (f - 32) * (5 / 9);

const parseWindSpeedMph = (windStr: string): number => {
  const nums = windStr.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map(Number);
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const windDirectionToDeg = (dir: string): number => {
  const map: Record<string, number> = {
    N: 0, NNE: 22, NE: 45, ENE: 67,
    E: 90, ESE: 112, SE: 135, SSE: 157,
    S: 180, SSW: 202, SW: 225, WSW: 247,
    W: 270, WNW: 292, NW: 315, NNW: 337,
  };
  return map[dir?.toUpperCase()] ?? 0;
};

const estimateCloudPercent = (forecast: string): number => {
  const lower = (forecast ?? '').toLowerCase();
  if (lower.includes('overcast')) return 95;
  if (lower.includes('mostly cloudy')) return 75;
  if (lower.includes('partly')) return 50;
  if (lower.includes('mostly clear') || lower.includes('mostly sunny')) return 20;
  if (lower.includes('clear') || lower.includes('sunny')) return 5;
  return 50;
};
