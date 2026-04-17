
import { useState, useEffect, useCallback } from 'react';
import { generateMockWeatherData } from '@/lib/weather/service';
import { calculateIRI } from '@/lib/weather/service';
import { calculateRoofTemp } from '@/lib/weather/service';
import { getGuangelStatus } from '@/lib/weather/service';
import {
  UnifiedForecastModel,
  InspectionRiskScore,
  RoofSurfaceTempData,
  LariGuangelStatus,
} from '@/lib/weather/types';
import type { SourceMetadata } from '@/lib/weather/source-metadata';
import type { TruthStateLabel } from '@/lib/weather/truth-state';

/**
 * @classification WEATHER_INTELLIGENCE_HOOK
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Primary weather data hook. Uses live /api/weather route by default.
 * Mock fallback is feature-flagged via NEXT_PUBLIC_WEATHER_MOCK=true.
 *
 * Returns provenance metadata and truth-state label alongside data
 * so consuming components can disclose data mode and source class.
 */

type WeatherDataResult = {
  data: UnifiedForecastModel | null;
  loading: boolean;
  error: string | null;
  meta: SourceMetadata | null;
  truthState: TruthStateLabel | null;
  refresh: () => void;
};

/**
 * Determine whether mock mode is active.
 * Explicit flag check — no silent fallback that masquerades as live.
 */
const isMockMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return process.env.NEXT_PUBLIC_WEATHER_MOCK === 'true';
};

export function useWeatherData(lat?: number, lon?: number): WeatherDataResult {
  const [data, setData] = useState<UnifiedForecastModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<SourceMetadata | null>(null);
  const [truthState, setTruthState] = useState<TruthStateLabel | null>(null);

  const effectiveLat = lat ?? 40.7128;
  const effectiveLon = lon ?? -74.006;

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isMockMode()) {
      // Feature-flagged mock path — labeled honestly as DEMO
      try {
        const mockData = generateMockWeatherData(effectiveLat, effectiveLon);
        setData(mockData);
        setMeta(null);
        setTruthState({
          label: 'DEMO · Mock Data',
          temporalMode: 'mock',
          spatialMode: 'point',
          displayMode: 'mock',
          cacheState: 'mock',
        });
      } catch (err: any) {
        setError(err.message || 'Mock generation failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Live path — fetch from /api/weather
    try {
      const res = await fetch(
        `/api/weather?lat=${effectiveLat}&lon=${effectiveLon}`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ?? `Weather service returned ${res.status}`
        );
      }

      const envelope = await res.json();
      setData(envelope.model);
      setMeta(envelope.meta ?? null);
      setTruthState(envelope.truthState ?? null);
    } catch (err: any) {
      console.error('[useWeatherData] Fetch failed:', err.message);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [effectiveLat, effectiveLon]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, meta, truthState, refresh: fetchWeather };
}

export function useIRI(weatherData: UnifiedForecastModel | null): InspectionRiskScore | null {
  const [iri, setIRI] = useState<InspectionRiskScore | null>(null);

  useEffect(() => {
    if (weatherData) {
      setIRI(calculateIRI(weatherData));
    }
  }, [weatherData]);

  return iri;
}

export function useRoofTemp(weatherData: UnifiedForecastModel | null): RoofSurfaceTempData | null {
  const [roofTemp, setRoofTemp] = useState<RoofSurfaceTempData | null>(null);

  useEffect(() => {
    if (weatherData) {
      // Assuming flat, black asphalt shingle roof as baseline (high absorption)
      setRoofTemp(calculateRoofTemp(weatherData.current.temp, weatherData.current.uvi, weatherData.current.wind_speed));
    }
  }, [weatherData]);

  return roofTemp;
}

export function useGuangel(iriScore: number | null): LariGuangelStatus {
  const [status, setStatus] = useState<LariGuangelStatus>({ 
    status: 'Offline', 
    message: 'Initializing...', 
    lastCheck: Date.now(), 
    kineticStatus: 'Stable' 
  });

  useEffect(() => {
    if (iriScore !== null) {
      setStatus(getGuangelStatus(iriScore));
    }
  }, [iriScore]);

  return status;
}
