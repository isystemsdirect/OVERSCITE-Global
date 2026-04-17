/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Weather Overlay Component — Tile-Based Rendering Engine
 *
 * Replaces static GroundOverlay with Google Maps ImageMapType tile overlay.
 * Enforces exclusive base field selection (only one raster overlay active at a time).
 * Uses true overlay opacity (not page-level or CSS dimming).
 * Returns null tiles outside CONUS coverage bounds.
 *
 * Calibration 3: Radar/tile rendering is separate from point forecast route.
 * Calibration 4: Raster overlays are visibly distinct from point intelligence.
 */
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useGoogleMap } from '@react-google-maps/api';
import { useMapUiStore } from '@/lib/map/map-ui-state';
import { LAYER_REGISTRY } from '@/lib/map/layer-registry';
import { getDefaultTileProvider, CONUS_BOUNDS } from '@/lib/weather/providers/tile-provider-registry';

export function WeatherRadarOverlay() {
  const map = useGoogleMap();
  const overlayRef = useRef<google.maps.ImageMapType | null>(null);
  const currentLayerRef = useRef<string | null>(null);

  const {
    weatherMasterEnabled,
    weatherRadarOpacity,
    activeBaseOverlayId,
    layers,
  } = useMapUiStore();

  // Determine which tile layer to render (exclusive base field)
  const activeTileLayerId = getActiveTileLayerId(activeBaseOverlayId, layers, weatherMasterEnabled);

  const createTileOverlay = useCallback(
    (layerId: string): google.maps.ImageMapType | null => {
      const provider = getDefaultTileProvider();
      const layerConfig = provider.getAvailableLayers().find((l) => l.id === layerId);
      if (!layerConfig) return null;

      const tileOverlay = new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) => {
          // Coverage clipping: return null for tiles outside CONUS
          if (!isTileInCoverage(coord, zoom)) {
            return null;
          }
          return provider.getTileUrl(layerId, null, coord.x, coord.y, zoom);
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: weatherRadarOpacity,
        name: layerConfig.name,
        maxZoom: layerConfig.maxZoom ?? 16,
        minZoom: layerConfig.minZoom ?? 3,
      });

      return tileOverlay;
    },
    [weatherRadarOpacity]
  );

  // ─── Lifecycle: Add/Remove overlay on map ──────────────────────

  useEffect(() => {
    if (!map) return;

    // Remove previous overlay
    if (overlayRef.current) {
      try {
        map.overlayMapTypes.clear();
      } catch {
        // Safety: clear may fail if map is disposed
      }
      overlayRef.current = null;
      currentLayerRef.current = null;
    }

    // If no active tile layer, we're done
    if (!activeTileLayerId || !weatherMasterEnabled) return;

    // Create and add new overlay
    const overlay = createTileOverlay(activeTileLayerId);
    if (overlay) {
      map.overlayMapTypes.push(overlay);
      overlayRef.current = overlay;
      currentLayerRef.current = activeTileLayerId;
      console.debug(`[WeatherOverlay] Tile layer activated: ${activeTileLayerId}`);
    }

    return () => {
      // Cleanup on unmount
      if (overlayRef.current) {
        try {
          map.overlayMapTypes.clear();
        } catch {
          // Safety
        }
        overlayRef.current = null;
        currentLayerRef.current = null;
      }
    };
  }, [map, activeTileLayerId, weatherMasterEnabled, createTileOverlay]);

  // ─── Opacity updates ──────────────────────────────────────────

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(weatherRadarOpacity);
    }
  }, [weatherRadarOpacity]);

  // This component doesn't render DOM — it manipulates the Google Maps overlay stack
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Determine which tile layer should be the active base field.
 * Only one raster overlay may be active at a time (exclusive base field).
 *
 * Priority:
 * 1. Explicit activeBaseOverlayId if set
 * 2. First enabled environmental layer with a tileProviderId
 * 3. null (no overlay)
 */
function getActiveTileLayerId(
  explicitId: string | null,
  layers: Record<string, boolean>,
  masterEnabled: boolean
): string | null {
  if (!masterEnabled) return null;

  // If an explicit base overlay is selected, use it
  if (explicitId) return explicitId;

  // Otherwise find the first enabled environmental layer with a tile provider
  const environmentalLayers = Object.values(LAYER_REGISTRY)
    .filter(
      (l) =>
        l.category === 'environmental' &&
        l.tileProviderId &&
        layers[l.key]
    )
    .sort((a, b) => (b.zOrder ?? 0) - (a.zOrder ?? 0));

  return environmentalLayers[0]?.tileProviderId ?? null;
}

/**
 * Check if a tile coordinate falls within CONUS coverage bounds.
 * Returns false for tiles entirely outside coverage → overlay returns null.
 */
function isTileInCoverage(coord: google.maps.Point, zoom: number): boolean {
  const n = Math.pow(2, zoom);
  const west = (coord.x / n) * 360 - 180;
  const east = ((coord.x + 1) / n) * 360 - 180;
  const north =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * coord.y) / n))) * 180) / Math.PI;
  const south =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * (coord.y + 1)) / n))) * 180) /
    Math.PI;

  return (
    south < CONUS_BOUNDS.north &&
    north > CONUS_BOUNDS.south &&
    west < CONUS_BOUNDS.east &&
    east > CONUS_BOUNDS.west
  );
}
