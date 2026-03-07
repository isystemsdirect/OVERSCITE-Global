
import { useState, useEffect } from 'react';
import { generateMockWeatherData } from '@/lib/weather/service';
import { calculateIRI } from '@/lib/weather/service';
import { calculateRoofTemp } from '@/lib/weather/service';
import { getGuangelStatus } from '@/lib/weather/service';
import { UnifiedForecastModel, InspectionRiskScore, RoofSurfaceTempData, LariGuangelStatus } from '@/lib/weather/types';

export function useWeatherData(lat?: number, lon?: number) {
  const [data, setData] = useState<UnifiedForecastModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would use fetch('/api/weather?lat=...&lon=...')
    // For now, we use the mock generator
    try {
      setLoading(true);
      const mockData = generateMockWeatherData(lat || 40.7128, lon || -74.0060);
      setData(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  return { data, loading, error };
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
