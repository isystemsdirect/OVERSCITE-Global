/**
 * @classification WEATHER_INTELLIGENCE_VECTOR_REGISTRY
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Provider-abstracted vector intelligence registry.
 * NOAA-first posture: initial entries use NOAA/NWS/SPC GIS MapServer
 * endpoints for storm outlooks, mesoscale discussions, local storm reports,
 * and alert polygons.
 *
 * Vector intelligence is additive operational intelligence overlaid on
 * the geospatial substrate — NOT a background raster field.
 */

import type { VectorIntelProvider, VectorFeature, VectorQueryBounds, VectorTimeWindow } from './types';
import { buildSourceMetadata, NOAA_ATTRIBUTION } from '@/lib/weather/source-metadata';

// ─── NOAA/SPC GIS MapServer Endpoints ────────────────────────────

const SPC_GIS_BASE = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/WWA';
const SPC_OUTLOOK_BASE = 'https://www.spc.noaa.gov/products/outlook';

/**
 * NOAA Vector Intelligence Provider.
 * Fetches storm intelligence from NOAA MapServer GeoJSON endpoints.
 */
export class NoaaVectorProvider implements VectorIntelProvider {
  readonly providerId = 'noaa_spc';
  readonly providerName = 'NOAA SPC / NWS';

  async fetchStormOutlooks(bounds: VectorQueryBounds): Promise<VectorFeature[]> {
    try {
      // SPC Convective Outlook Day 1 via MapServer
      const url = `${SPC_GIS_BASE}/MapServer/0/query?` +
        `where=1%3D1` +
        `&geometry=${bounds.west},${bounds.south},${bounds.east},${bounds.north}` +
        `&geometryType=esriGeometryEnvelope` +
        `&inSR=4326&outSR=4326&spatialRel=esriSpatialRelIntersects` +
        `&outFields=*&f=geojson`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'SCINGULAR (contact@SCINGULAR.io)' },
      });

      if (!res.ok) {
        console.warn(`[VectorProvider] SPC outlook query returned ${res.status}`);
        return [];
      }

      const rawBody = await res.text();
      const geojson = JSON.parse(rawBody);

      return (geojson.features ?? []).map((f: any, idx: number) => ({
        id: f.properties?.OBJECTID?.toString() ?? `spc_outlook_${idx}`,
        type: 'polygon' as const,
        geometry: f.geometry,
        properties: f.properties ?? {},
        meta: buildSourceMetadata({
          provider: 'noaa_spc',
          datasetOrProduct: 'SPC Convective Outlook',
          rawBody,
          cacheState: 'live',
          displayMode: 'storm_vector',
          attribution: NOAA_ATTRIBUTION,
        }),
      }));
    } catch (err: any) {
      console.error('[VectorProvider] fetchStormOutlooks failed:', err.message);
      return [];
    }
  }

  async fetchMesoscaleDiscussions(bounds: VectorQueryBounds): Promise<VectorFeature[]> {
    try {
      // SPC Mesoscale Discussions via MapServer
      const url = `${SPC_GIS_BASE}/MapServer/1/query?` +
        `where=1%3D1` +
        `&geometry=${bounds.west},${bounds.south},${bounds.east},${bounds.north}` +
        `&geometryType=esriGeometryEnvelope` +
        `&inSR=4326&outSR=4326&spatialRel=esriSpatialRelIntersects` +
        `&outFields=*&f=geojson`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'SCINGULAR (contact@SCINGULAR.io)' },
      });

      if (!res.ok) return [];

      const rawBody = await res.text();
      const geojson = JSON.parse(rawBody);

      return (geojson.features ?? []).map((f: any, idx: number) => ({
        id: f.properties?.OBJECTID?.toString() ?? `meso_${idx}`,
        type: 'polygon' as const,
        geometry: f.geometry,
        properties: f.properties ?? {},
        meta: buildSourceMetadata({
          provider: 'noaa_spc',
          datasetOrProduct: 'SPC Mesoscale Discussion',
          rawBody,
          cacheState: 'live',
          displayMode: 'storm_vector',
          attribution: NOAA_ATTRIBUTION,
        }),
      }));
    } catch (err: any) {
      console.error('[VectorProvider] fetchMesoscaleDiscussions failed:', err.message);
      return [];
    }
  }

  async fetchLocalStormReports(
    bounds: VectorQueryBounds,
    window: VectorTimeWindow
  ): Promise<VectorFeature[]> {
    try {
      // NWS Local Storm Reports via MapServer
      // Default to 24h window
      const hoursBack = window.hoursBack ?? 24;
      const sinceMs = Date.now() - hoursBack * 60 * 60 * 1000;

      const url = `${SPC_GIS_BASE}/MapServer/2/query?` +
        `where=1%3D1` +
        `&geometry=${bounds.west},${bounds.south},${bounds.east},${bounds.north}` +
        `&geometryType=esriGeometryEnvelope` +
        `&inSR=4326&outSR=4326&spatialRel=esriSpatialRelIntersects` +
        `&outFields=*&f=geojson`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'SCINGULAR (contact@SCINGULAR.io)' },
      });

      if (!res.ok) return [];

      const rawBody = await res.text();
      const geojson = JSON.parse(rawBody);

      return (geojson.features ?? []).map((f: any, idx: number) => ({
        id: f.properties?.OBJECTID?.toString() ?? `lsr_${idx}`,
        type: 'point' as const,
        geometry: f.geometry,
        properties: f.properties ?? {},
        meta: buildSourceMetadata({
          provider: 'noaa_spc',
          datasetOrProduct: `NWS LSR (${hoursBack}h)`,
          rawBody,
          cacheState: 'live',
          displayMode: 'storm_vector',
          attribution: NOAA_ATTRIBUTION,
        }),
      }));
    } catch (err: any) {
      console.error('[VectorProvider] fetchLocalStormReports failed:', err.message);
      return [];
    }
  }

  async fetchAlertPolygons(bounds: VectorQueryBounds): Promise<VectorFeature[]> {
    try {
      // NWS Active Alert Polygons
      const url = `https://api.weather.gov/alerts/active?` +
        `point=${((bounds.north + bounds.south) / 2).toFixed(4)},` +
        `${((bounds.east + bounds.west) / 2).toFixed(4)}`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'SCINGULAR (contact@SCINGULAR.io)',
          'Accept': 'application/geo+json',
        },
      });

      if (!res.ok) return [];

      const rawBody = await res.text();
      const geojson = JSON.parse(rawBody);

      return (geojson.features ?? [])
        .filter((f: any) => f.geometry != null)
        .map((f: any, idx: number) => ({
          id: f.properties?.id ?? `alert_poly_${idx}`,
          type: 'polygon' as const,
          geometry: f.geometry,
          properties: {
            event: f.properties?.event,
            severity: f.properties?.severity,
            headline: f.properties?.headline,
            description: f.properties?.description,
            onset: f.properties?.onset,
            expires: f.properties?.expires,
          },
          meta: buildSourceMetadata({
            provider: 'nws',
            datasetOrProduct: 'NWS Alert Polygons',
            rawBody,
            cacheState: 'live',
            displayMode: 'storm_vector',
            attribution: NOAA_ATTRIBUTION,
          }),
        }));
    } catch (err: any) {
      console.error('[VectorProvider] fetchAlertPolygons failed:', err.message);
      return [];
    }
  }
}

// ─── Registry ────────────────────────────────────────────────────

const providers: VectorIntelProvider[] = [new NoaaVectorProvider()];

export const getVectorProvider = (providerId: string): VectorIntelProvider | undefined =>
  providers.find((p) => p.providerId === providerId);

export const getDefaultVectorProvider = (): VectorIntelProvider => providers[0];

export const addVectorProvider = (provider: VectorIntelProvider): void => {
  providers.push(provider);
};

export const getAllVectorProviders = (): VectorIntelProvider[] => [...providers];
