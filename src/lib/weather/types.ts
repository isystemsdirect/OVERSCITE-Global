
import { z } from 'zod';

export type WeatherUnit = 'imperial' | 'metric';

export interface GeoCoordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  uvi: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface UnifiedForecastModel {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}

// Inspection Risk Index (IRI) Types
export interface InspectionRiskScore {
  score: number; // 0-100
  band: 'Low' | 'Moderate' | 'High' | 'Critical';
  color: string;
  factors: {
    wind: number;
    precip: number;
    lightning: number;
    temp: number;
    heatIndex: number;
    aqi: number;
    exposure: number;
  };
  topFactors: string[]; // For v1.1.0 explanation
}

export type RoofMaterial = 'asphalt_shingle' | 'metal_roof' | 'tile';

export interface RoofSurfaceTempData {
  ambientTemp: number;
  surfaceTemp: number;
  delta: number;
  riskLevel: 'Safe' | 'Caution' | 'Critical'; // Updated to match v1.1.0 specs
  material: RoofMaterial;
}

export interface LariGuangelStatus {
  status: 'Active' | 'Warning' | 'Intervention' | 'Offline';
  message: string;
  lastCheck: number;
  kineticStatus: 'Stable' | 'Motion' | 'Fall Detected' | 'Immobile';
  biometricStatus?: 'Normal' | 'Elevated' | 'Critical'; 
}
