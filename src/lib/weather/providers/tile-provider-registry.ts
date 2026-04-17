/**
 * @classification WEATHER_INTELLIGENCE_TILE_REGISTRY
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Provider-abstracted tile overlay registry.
 * NOAA-first posture: initial entries use NOAA-sourced tile services.
 * Provider abstraction ensures commercial fallback can be added later
 * without architectural change.
 *
 * Calibration 3: Radar/tile path is separate from point forecast route.
 * Calibration 2: NOAA-first, not commercial-first.
 */

import type { TileOverlayProvider, TileLayerConfig, TileCoverageBounds, TileDisplayMode } from './types';

// ─── CONUS Coverage Bounds ───────────────────────────────────────

export const CONUS_BOUNDS: TileCoverageBounds = {
  north: 50.0,     // Northern US border
  south: 24.396,   // Southern tip of Florida Keys
  east: -66.934,   // Eastern tip of Maine
  west: -125.0,    // Western tip of Washington
};

// ─── NOAA-First Tile Layers ──────────────────────────────────────

/**
 * NOAA/NWS provides several free tile/WMS overlay services.
 * These are the initial canonical entries.
 */
const NOAA_TILE_LAYERS: TileLayerConfig[] = [
  {
    id: 'mrms_base_reflectivity',
    name: 'Radar Reflectivity (MRMS)',
    displayMode: 'observed_radar',
    attribution: 'Data from NOAA MRMS. NOAA does not endorse or approve this product.',
    coverageBounds: CONUS_BOUNDS,
    defaultOpacity: 0.5,
    minZoom: 3,
    maxZoom: 12,
    updateCadenceMs: 5 * 60 * 1000, // 5 minutes
  },
  {
    id: 'mrms_precipitation_rate',
    name: 'Precipitation Rate (MRMS)',
    displayMode: 'observed_radar',
    attribution: 'Data from NOAA MRMS. NOAA does not endorse or approve this product.',
    coverageBounds: CONUS_BOUNDS,
    defaultOpacity: 0.5,
    minZoom: 3,
    maxZoom: 12,
    updateCadenceMs: 5 * 60 * 1000,
  },
  {
    id: 'nws_radar_mosaic',
    name: 'National Radar Mosaic',
    displayMode: 'observed_radar',
    attribution: 'Data from NOAA/NWS. NOAA does not endorse or approve this product.',
    coverageBounds: CONUS_BOUNDS,
    defaultOpacity: 0.5,
    minZoom: 3,
    maxZoom: 10,
    updateCadenceMs: 10 * 60 * 1000,
  },
  {
    id: 'cloud_cover',
    name: 'Cloud Cover (Reserved)',
    displayMode: 'observed_cloud',
    attribution: 'Data from NOAA/GOES. NOAA does not endorse or approve this product.',
    coverageBounds: CONUS_BOUNDS,
    defaultOpacity: 0.4,
    minZoom: 3,
    maxZoom: 10,
    updateCadenceMs: 15 * 60 * 1000,
  },
];

// ─── NOAA Tile Provider Implementation ───────────────────────────

/**
 * NOAA-sourced tile overlay provider.
 * Uses NWS/NOAA WMS endpoints packaged as XYZ-compatible tile URLs.
 *
 * The ridge2 radar imagery is the canonical NOAA radar tile path.
 * MRMS products are available via NOAA MapServer endpoints.
 */
export class NoaaTileProvider implements TileOverlayProvider {
  readonly providerId = 'noaa';
  readonly providerName = 'NOAA/NWS';

  getTileUrl(
    layerId: string,
    _timestamp: string | null,
    x: number,
    y: number,
    z: number
  ): string | null {
    // Coverage clipping: return null for tiles outside CONUS
    if (!this.isTileInCoverage(layerId, x, y, z)) {
      return null;
    }

    switch (layerId) {
      case 'mrms_base_reflectivity':
        // NOAA MRMS via Iowa Environmental Mesonet WMS tile proxy
        return `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/q2-n1p-${this.getTimestampTag()}/{z}/{x}/{y}.png`
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y));

      case 'mrms_precipitation_rate':
        return `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/q2-hsr-${this.getTimestampTag()}/{z}/{x}/{y}.png`
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y));

      case 'nws_radar_mosaic':
        // NWS ridge2 radar imagery
        return `https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=WMS&version=1.1.1&request=GetMap&layers=conus_bref_qcd&styles=&bbox=${this.tileToBBox(x, y, z)}&width=256&height=256&srs=EPSG:3857&format=image/png&transparent=true`;

      case 'cloud_cover':
        // Reserved — GOES ABI integration pending Phase 4
        return null;

      default:
        return null;
    }
  }

  getCoverageBounds(layerId: string, _timestamp?: string): TileCoverageBounds {
    const layer = NOAA_TILE_LAYERS.find((l) => l.id === layerId);
    return layer?.coverageBounds ?? CONUS_BOUNDS;
  }

  getAttribution(layerId: string): string {
    const layer = NOAA_TILE_LAYERS.find((l) => l.id === layerId);
    return layer?.attribution ?? 'Data from NOAA. NOAA does not endorse or approve this product.';
  }

  getDisplayMode(layerId: string): TileDisplayMode {
    const layer = NOAA_TILE_LAYERS.find((l) => l.id === layerId);
    return layer?.displayMode ?? 'observed_radar';
  }

  getAvailableLayers(): TileLayerConfig[] {
    return NOAA_TILE_LAYERS;
  }

  // ─── Internal Helpers ────────────────────────────────────────

  private getTimestampTag(): string {
    // Round to nearest 5 minutes for tile cache coherency
    const now = new Date();
    const minutes = Math.floor(now.getUTCMinutes() / 5) * 5;
    return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}${String(now.getUTCHours()).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;
  }

  private isTileInCoverage(layerId: string, x: number, y: number, z: number): boolean {
    const bounds = this.getCoverageBounds(layerId);
    const tileBounds = this.tileToLatLonBounds(x, y, z);

    return (
      tileBounds.south < bounds.north &&
      tileBounds.north > bounds.south &&
      tileBounds.west < bounds.east &&
      tileBounds.east > bounds.west
    );
  }

  private tileToLatLonBounds(x: number, y: number, z: number) {
    const n = Math.pow(2, z);
    const west = (x / n) * 360 - 180;
    const east = ((x + 1) / n) * 360 - 180;
    const north = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
    const south = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
    return { north, south, east, west };
  }

  private tileToBBox(x: number, y: number, z: number): string {
    // Convert XYZ tile coordinates to EPSG:3857 bounding box for WMS
    const n = Math.pow(2, z);
    const earthCirc = 20037508.342789244;

    const xMin = (x / n) * 2 * earthCirc - earthCirc;
    const xMax = ((x + 1) / n) * 2 * earthCirc - earthCirc;
    const yMin = earthCirc - ((y + 1) / n) * 2 * earthCirc;
    const yMax = earthCirc - (y / n) * 2 * earthCirc;

    return `${xMin},${yMin},${xMax},${yMax}`;
  }
}

// ─── Registry of Available Tile Providers ────────────────────────

/**
 * Provider registry. NOAA-first by canonical posture.
 * Commercial fallback providers can be registered via addProvider().
 */
const providers: TileOverlayProvider[] = [new NoaaTileProvider()];

export const getTileProvider = (providerId: string): TileOverlayProvider | undefined =>
  providers.find((p) => p.providerId === providerId);

export const getDefaultTileProvider = (): TileOverlayProvider => providers[0];

export const addTileProvider = (provider: TileOverlayProvider): void => {
  providers.push(provider);
};

export const getAllTileProviders = (): TileOverlayProvider[] => [...providers];
