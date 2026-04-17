/**
 * @classification WEATHER_INTELLIGENCE_NORMALIZER
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * NWS API response normalization into OVERSCITE canonical contracts.
 * Transforms NWS JSON-LD / GeoJSON responses into:
 * - UnifiedForecastModel (UI contract)
 * - WeatherSignal[] (SCING operational contract)
 *
 * Reuses SCING's existing severity/certainty/stale pipeline.
 * Does NOT invent a new risk model.
 */

import type { WeatherSignal, WeatherHazard, WeatherAlertSeverity } from '@rtsf/weather/contracts/weatherSignal';
import type {
  UnifiedForecastModel,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  WeatherAlert,
  WeatherCondition,
} from '@/lib/weather/types';

// ─── NWS Response Types (subset relevant to normalization) ───────

type NwsForecastPeriod = {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: 'F' | 'C';
  windSpeed: string;       // e.g. "10 to 15 mph"
  windDirection: string;   // e.g. "SW"
  shortForecast: string;
  detailedForecast: string;
  probabilityOfPrecipitation?: { value: number | null };
  relativeHumidity?: { value: number | null };
  dewpoint?: { value: number | null; unitCode: string };
  icon?: string;
};

type NwsAlertFeature = {
  id: string;
  properties: {
    id: string;
    event: string;
    severity: string;      // 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
    certainty: string;
    urgency: string;
    senderName: string;
    headline?: string;
    description?: string;
    instruction?: string;
    onset?: string;
    expires?: string;
    effective?: string;
    areaDesc?: string;
    parameters?: Record<string, string[]>;
  };
  geometry?: { type: string; coordinates: unknown } | null;
};

// ─── Temperature Helpers ─────────────────────────────────────────

const fahrenheitToCelsius = (f: number): number => (f - 32) * (5 / 9);

const parseWindSpeed = (windStr: string): number => {
  // "10 to 15 mph" → avg = 12.5; "15 mph" → 15
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
  return map[dir.toUpperCase()] ?? 0;
};

// ─── NWS → UnifiedForecastModel ──────────────────────────────────

export const nwsForecastToUnifiedModel = (opts: {
  lat: number;
  lon: number;
  timezone: string;
  timezoneOffset: number;
  gridForecastPeriods: NwsForecastPeriod[];
  hourlyPeriods: NwsForecastPeriod[];
  alerts?: NwsAlertFeature[];
}): UnifiedForecastModel => {
  const now = Date.now() / 1000;

  // Build current conditions from first hourly period
  const firstHourly = opts.hourlyPeriods[0];
  const current: CurrentWeather = firstHourly
    ? {
        dt: new Date(firstHourly.startTime).getTime() / 1000,
        temp: firstHourly.temperature,
        feels_like: firstHourly.temperature, // NWS doesn't provide feels_like directly
        pressure: 1013,                       // NWS grid doesn't expose barometric pressure
        humidity: firstHourly.relativeHumidity?.value ?? 50,
        dew_point: firstHourly.dewpoint?.value
          ? (firstHourly.dewpoint.unitCode.includes('degC')
              ? firstHourly.dewpoint.value * 9 / 5 + 32
              : firstHourly.dewpoint.value)
          : 50,
        uvi: 0,                               // NWS doesn't provide UV index
        clouds: 50,                            // Approximate from forecast text
        visibility: 10000,
        wind_speed: parseWindSpeed(firstHourly.windSpeed),
        wind_deg: windDirectionToDeg(firstHourly.windDirection),
        wind_gust: parseWindSpeed(firstHourly.windSpeed) * 1.3, // Estimate
        weather: [shortForecastToCondition(firstHourly.shortForecast, firstHourly.isDaytime)],
      }
    : buildFallbackCurrent(now);

  // Build hourly forecast (NWS provides up to 156 hours)
  const hourly: HourlyForecast[] = opts.hourlyPeriods.slice(0, 48).map((p) => ({
    dt: new Date(p.startTime).getTime() / 1000,
    temp: p.temperature,
    feels_like: p.temperature,
    pressure: 1013,
    humidity: p.relativeHumidity?.value ?? 50,
    dew_point: p.dewpoint?.value
      ? (p.dewpoint.unitCode.includes('degC')
          ? p.dewpoint.value * 9 / 5 + 32
          : p.dewpoint.value)
      : 50,
    uvi: 0,
    clouds: estimateCloudCover(p.shortForecast),
    visibility: 10000,
    wind_speed: parseWindSpeed(p.windSpeed),
    wind_deg: windDirectionToDeg(p.windDirection),
    wind_gust: parseWindSpeed(p.windSpeed) * 1.3,
    weather: [shortForecastToCondition(p.shortForecast, p.isDaytime)],
    pop: (p.probabilityOfPrecipitation?.value ?? 0) / 100,
  }));

  // Build daily forecast from grid forecast periods (day/night pairs)
  const daily: DailyForecast[] = buildDailyFromGridPeriods(opts.gridForecastPeriods, now);

  // Normalize alerts
  const alerts: WeatherAlert[] | undefined = opts.alerts?.map((a) => ({
    sender_name: a.properties.senderName,
    event: a.properties.event,
    start: a.properties.onset ? new Date(a.properties.onset).getTime() / 1000 : now,
    end: a.properties.expires ? new Date(a.properties.expires).getTime() / 1000 : now + 86400,
    description: a.properties.description ?? '',
    tags: [a.properties.severity, a.properties.certainty, a.properties.urgency].filter(Boolean),
  }));

  return {
    lat: opts.lat,
    lon: opts.lon,
    timezone: opts.timezone,
    timezone_offset: opts.timezoneOffset,
    current,
    hourly,
    daily,
    alerts: alerts && alerts.length > 0 ? alerts : undefined,
  };
};

// ─── NWS Alerts → WeatherSignal[] ────────────────────────────────

export const nwsAlertsToWeatherSignals = (
  alerts: NwsAlertFeature[],
  geo: { lat: number; lon: number },
  rawHash: string
): WeatherSignal[] => {
  return alerts.map((a) => {
    const severity = mapNwsSeverityToCanonical(a.properties.severity);
    const hazards = inferHazardsFromEvent(a.properties.event);

    return {
      schemaVersion: '1.0' as const,
      source: {
        provider: 'nws',
        fetchedAtUtc: new Date().toISOString(),
        rawHash,
      },
      geo: { lat: geo.lat, lon: geo.lon },
      atUtc: a.properties.onset ?? a.properties.effective ?? new Date().toISOString(),
      kind: 'alert' as const,
      certaintyScore: 0.95, // Alerts have high base certainty per SCING model
      severityIndex: severity === 'critical' ? 8 : severity === 'caution' ? 5 : 2,
      metrics: {},
      hazards,
      alert: {
        id: a.properties.id,
        title: a.properties.headline ?? a.properties.event,
        description: a.properties.description,
        severity,
        startsAtUtc: a.properties.onset ?? a.properties.effective,
        endsAtUtc: a.properties.expires,
        areas: a.properties.areaDesc ? [a.properties.areaDesc] : undefined,
      },
    };
  });
};

// ─── Internal Helpers ────────────────────────────────────────────

const mapNwsSeverityToCanonical = (nwsSeverity: string): WeatherAlertSeverity => {
  switch (nwsSeverity?.toLowerCase()) {
    case 'extreme':
    case 'severe':
      return 'critical';
    case 'moderate':
      return 'caution';
    default:
      return 'info';
  }
};

const inferHazardsFromEvent = (event: string): WeatherHazard[] => {
  const lower = event.toLowerCase();
  const hazards: WeatherHazard[] = [];

  if (lower.includes('tornado')) hazards.push('tornado');
  if (lower.includes('hurricane') || lower.includes('tropical')) hazards.push('hurricane');
  if (lower.includes('wind')) hazards.push('wind');
  if (lower.includes('flood') || lower.includes('flash')) hazards.push('flood');
  if (lower.includes('thunder') || lower.includes('lightning')) hazards.push('lightning');
  if (lower.includes('hail')) hazards.push('hail');
  if (lower.includes('snow') || lower.includes('blizzard') || lower.includes('winter')) hazards.push('snow');
  if (lower.includes('ice') || lower.includes('freezing')) hazards.push('ice');
  if (lower.includes('heat') || lower.includes('excessive')) hazards.push('heat');
  if (lower.includes('fog') || lower.includes('visibility')) hazards.push('fog');
  if (lower.includes('dust')) hazards.push('dust');
  if (lower.includes('smoke') || lower.includes('fire')) hazards.push('smoke');

  return hazards.length > 0 ? hazards : ['wind']; // fallback
};

const shortForecastToCondition = (forecast: string, isDaytime: boolean): WeatherCondition => {
  const lower = forecast.toLowerCase();
  const suffix = isDaytime ? 'd' : 'n';

  if (lower.includes('thunder')) return { id: 211, main: 'Thunderstorm', description: forecast.toLowerCase(), icon: `11${suffix}` };
  if (lower.includes('rain') || lower.includes('showers')) return { id: 500, main: 'Rain', description: forecast.toLowerCase(), icon: `10${suffix}` };
  if (lower.includes('snow')) return { id: 601, main: 'Snow', description: forecast.toLowerCase(), icon: `13${suffix}` };
  if (lower.includes('fog') || lower.includes('mist')) return { id: 741, main: 'Fog', description: forecast.toLowerCase(), icon: `50${suffix}` };
  if (lower.includes('overcast') || lower.includes('cloudy')) return { id: 804, main: 'Clouds', description: forecast.toLowerCase(), icon: `04${suffix}` };
  if (lower.includes('partly')) return { id: 802, main: 'Clouds', description: forecast.toLowerCase(), icon: `03${suffix}` };
  if (lower.includes('mostly clear') || lower.includes('few clouds')) return { id: 801, main: 'Clouds', description: forecast.toLowerCase(), icon: `02${suffix}` };
  return { id: 800, main: 'Clear', description: forecast.toLowerCase(), icon: `01${suffix}` };
};

const estimateCloudCover = (forecast: string): number => {
  const lower = forecast.toLowerCase();
  if (lower.includes('overcast')) return 95;
  if (lower.includes('mostly cloudy')) return 75;
  if (lower.includes('partly')) return 50;
  if (lower.includes('mostly clear') || lower.includes('mostly sunny')) return 20;
  if (lower.includes('clear') || lower.includes('sunny')) return 5;
  return 50;
};

const buildFallbackCurrent = (now: number): CurrentWeather => ({
  dt: now,
  temp: 0, feels_like: 0, pressure: 0, humidity: 0, dew_point: 0,
  uvi: 0, clouds: 0, visibility: 0, wind_speed: 0, wind_deg: 0,
  weather: [{ id: 0, main: 'Unknown', description: 'data unavailable', icon: '01d' }],
});

const buildDailyFromGridPeriods = (periods: NwsForecastPeriod[], now: number): DailyForecast[] => {
  const daily: DailyForecast[] = [];
  // NWS grid periods come as day/night pairs
  for (let i = 0; i < Math.min(periods.length, 14); i += 2) {
    const dayPeriod = periods[i];
    const nightPeriod = periods[i + 1];
    if (!dayPeriod) break;

    const dayTemp = dayPeriod.temperature;
    const nightTemp = nightPeriod?.temperature ?? dayTemp - 15;
    const dt = new Date(dayPeriod.startTime).getTime() / 1000;

    daily.push({
      dt,
      sunrise: dt - 3600,     // Approximate
      sunset: dt + 43200,     // Approximate
      moonrise: 0,
      moonset: 0,
      moon_phase: 0.5,
      temp: {
        day: dayTemp,
        min: Math.min(dayTemp, nightTemp),
        max: Math.max(dayTemp, nightTemp),
        night: nightTemp,
        eve: dayTemp - 3,
        morn: nightTemp + 3,
      },
      feels_like: {
        day: dayTemp,
        night: nightTemp,
        eve: dayTemp - 3,
        morn: nightTemp + 3,
      },
      pressure: 1013,
      humidity: dayPeriod.relativeHumidity?.value ?? 50,
      dew_point: dayPeriod.dewpoint?.value ?? 50,
      wind_speed: parseWindSpeed(dayPeriod.windSpeed),
      wind_deg: windDirectionToDeg(dayPeriod.windDirection),
      weather: [shortForecastToCondition(dayPeriod.shortForecast, true)],
      clouds: estimateCloudCover(dayPeriod.shortForecast),
      pop: (dayPeriod.probabilityOfPrecipitation?.value ?? 0) / 100,
      uvi: 5, // NWS doesn't provide UVI
    });
  }
  return daily;
};
