/**
 * DocuSCRIBE™ — Weather Intelligence Connector
 * 
 * Bridges the SCINGULAR NWS/Weather service with the DocuSCRIBE
 * document engine, providing environmental risk context.
 * 
 * @authority SCINGULAR Intelligence Layer
 */

import { generateMockWeatherData, calculateIRI, calculateRoofTemp } from '@/lib/weather/service';

export interface WeatherDataPayload {
  temp: number;
  conditions: string;
  windSpeed: number;
  iri: number;
  iriBand: string;
  roofTemp: number;
  timestamp: string;
}

/**
 * Fetches current weather and risk intelligence for a document location.
 */
export async function getWeatherData(lat: number, lng: number): Promise<WeatherDataPayload> {
  // Use existing SCINGULAR weather logic
  const model = generateMockWeatherData(lat, lng);
  const iri = calculateIRI(model);
  const roof = calculateRoofTemp(model.current.temp, model.current.uvi, model.current.wind_speed);

  return {
    temp: model.current.temp,
    conditions: model.current.weather[0].description,
    windSpeed: model.current.wind_speed,
    iri: iri.score,
    iriBand: iri.band,
    roofTemp: roof.surfaceTemp,
    timestamp: new Date().toISOString()
  };
}
