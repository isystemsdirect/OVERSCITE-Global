
import {
  InspectionRiskScore,
  RoofSurfaceTempData,
  UnifiedForecastModel,
  LariGuangelStatus
} from './types';

// Constants for Risk Calculation Weights (from spec)
const WEIGHTS = {
  WIND_GUST_SPEED: 0.25,
  PRECIPITATION_PROBABILITY: 0.20,
  LIGHTNING_DISTANCE: 0.20,
  ROOF_SURFACE_TEMP: 0.15,
  HEAT_INDEX: 0.10,
  AIR_QUALITY_INDEX: 0.05,
  EXPOSURE_DURATION: 0.05
};

// Mock data generator for demo purposes until real APIs are hooked up
export const generateMockWeatherData = (lat: number, lon: number): UnifiedForecastModel => {
  const now = Date.now();
  
  return {
    lat,
    lon,
    timezone: "America/New_York",
    timezone_offset: -14400,
    current: {
      dt: now / 1000,
      temp: 72,
      feels_like: 74,
      pressure: 1012,
      humidity: 45,
      dew_point: 50,
      uvi: 5.2,
      clouds: 20,
      visibility: 10000,
      wind_speed: 8,
      wind_deg: 180,
      wind_gust: 12,
      weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }]
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: (now / 1000) + (i * 3600),
      temp: 72 + Math.sin(i * 0.5) * 5,
      feels_like: 74 + Math.sin(i * 0.5) * 5,
      pressure: 1012,
      humidity: 45 + (i * 2),
      dew_point: 50,
      uvi: Math.max(0, 8 - Math.abs(12 - (new Date().getHours() + i)) * 1.5),
      clouds: 20 + (i * 5) % 80,
      visibility: 10000,
      wind_speed: 8 + Math.random() * 5,
      wind_deg: 180 + (i * 10) % 360,
      wind_gust: 12 + Math.random() * 8,
      weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
      pop: Math.random() * 0.3
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      dt: (now / 1000) + (i * 86400),
      sunrise: (now / 1000) + (i * 86400) - 20000,
      sunset: (now / 1000) + (i * 86400) + 20000,
      moonrise: 0,
      moonset: 0,
      moon_phase: 0.5,
      temp: { day: 75, min: 65, max: 82, night: 68, eve: 72, morn: 66 },
      feels_like: { day: 77, night: 70, eve: 74, morn: 68 },
      pressure: 1012,
      humidity: 50,
      dew_point: 55,
      wind_speed: 10,
      wind_deg: 200,
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      clouds: 10,
      pop: 0.1,
      uvi: 7
    }))
  };
};

export const calculateIRI = (weather: UnifiedForecastModel): InspectionRiskScore => {
  // Simplified logic for demo based on spec weights
  const windScore = Math.min(100, (weather.current.wind_gust || weather.current.wind_speed) * 2.5); // Max 40mph = 100
  const precipScore = (weather.hourly[0]?.pop || 0) * 100;
  const lightningScore = 0; // Mock: assume no lightning nearby
  const tempScore = Math.max(0, (weather.current.temp - 90) * 10); // Over 90F adds risk
  
  const totalScore = (
    windScore * WEIGHTS.WIND_GUST_SPEED +
    precipScore * WEIGHTS.PRECIPITATION_PROBABILITY +
    lightningScore * WEIGHTS.LIGHTNING_DISTANCE +
    tempScore * WEIGHTS.HEAT_INDEX
    // Simplified: ignoring others for now
  ) / (WEIGHTS.WIND_GUST_SPEED + WEIGHTS.PRECIPITATION_PROBABILITY + WEIGHTS.LIGHTNING_DISTANCE + WEIGHTS.HEAT_INDEX) * 100;

  let band: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  let color = 'text-green-500';

  if (totalScore > 75) { band = 'Critical'; color = 'text-destructive'; }
  else if (totalScore > 50) { band = 'High'; color = 'text-orange-500'; }
  else if (totalScore > 25) { band = 'Moderate'; color = 'text-yellow-500'; }

  // Identify top factors
  const factorsList: { name: string; val: number }[] = [
      { name: 'Wind Gust', val: windScore * WEIGHTS.WIND_GUST_SPEED },
      { name: 'Precipitation', val: precipScore * WEIGHTS.PRECIPITATION_PROBABILITY },
      { name: 'Heat Index', val: tempScore * WEIGHTS.HEAT_INDEX },
      { name: 'Roof Temp', val: 0 } // Mocked as 0 for now in this calculation
  ];
  factorsList.sort((a, b) => b.val - a.val);
  const topFactors = factorsList.slice(0, 2).filter(f => f.val > 5).map(f => f.name);

  return {
    score: Math.round(totalScore),
    band,
    color,
    factors: {
      wind: windScore,
      precip: precipScore,
      lightning: lightningScore,
      temp: tempScore,
      heatIndex: tempScore, // simplified
      aqi: 0,
      exposure: 0
    },
    topFactors
  };
};

export const calculateRoofTemp = (ambientTemp: number, uvi: number, windSpeed: number): RoofSurfaceTempData => {
  // Simple physics approximation:
  // Solar gain increases temp, wind cooling decreases it.
  // Base rise due to sun: ~3-5 degrees F per UV index point
  // Wind cooling factor: reduces the delta
  
  const solarGain = uvi * 4.5; 
  const windCooling = windSpeed * 0.8;
  const netRise = Math.max(0, solarGain - windCooling);
  const surfaceTemp = ambientTemp + netRise;

  let riskLevel: 'Safe' | 'Caution' | 'Critical' = 'Safe';
  if (surfaceTemp > 140) riskLevel = 'Critical';
  else if (surfaceTemp > 120) riskLevel = 'Caution';
  else if (surfaceTemp > 100) riskLevel = 'Caution'; // Adjusted to match interface constraints

  return {
    ambientTemp,
    surfaceTemp: Math.round(surfaceTemp),
    delta: Math.round(netRise),
    riskLevel,
    material: 'asphalt_shingle'
  };
};

export const getGuangelStatus = (iri: number): LariGuangelStatus => {
  if (iri > 80) return { 
    status: 'Intervention', 
    message: 'CRITICAL: High Wind & Storm Risk. Seek Shelter.', 
    lastCheck: Date.now(), 
    kineticStatus: 'Stable' 
  };
  if (iri > 50) return { 
    status: 'Warning', 
    message: 'Monitoring: Elevated Wind Gusts detected.', 
    lastCheck: Date.now(), 
    kineticStatus: 'Stable' 
  };
  return { 
    status: 'Active', 
    message: 'All Systems Nominal. Monitoring active.', 
    lastCheck: Date.now(), 
    kineticStatus: 'Stable' 
  };
};
