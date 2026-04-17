/**
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Storm Intelligence Vector Overlay Component.
 * Renders SPC outlook polygons, mesoscale discussions, and local storm
 * reports as additive operational intelligence overlayed on the map.
 *
 * This is NOT a background raster field — it is additive vector intelligence
 * that sits above the base field layer but below operational markers.
 *
 * Calibration 4: Storm vectors are visibly labeled as intelligence overlays.
 */
'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGoogleMap } from '@react-google-maps/api';
import { useMapUiStore } from '@/lib/map/map-ui-state';
import {
  fetchStormIntelligenceBundle,
  OUTLOOK_CATEGORY_COLORS,
  getLsrColor,
  type StormIntelligenceBundle,
} from '@/lib/weather/storm-intelligence';
import type { VectorQueryBounds } from '@/lib/weather/providers/types';

export function StormIntelligenceOverlay() {
  const map = useGoogleMap();
  const dataLayerRef = useRef<google.maps.Data | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [bundle, setBundle] = useState<StormIntelligenceBundle | null>(null);

  const { layers, weatherMasterEnabled } = useMapUiStore();

  const isOutlooksEnabled = layers.storm_outlooks && weatherMasterEnabled;
  const isMesoscaleEnabled = layers.mesoscale_discussions && weatherMasterEnabled;
  const isReportsEnabled = layers.storm_reports && weatherMasterEnabled;

  const anyEnabled = isOutlooksEnabled || isMesoscaleEnabled || isReportsEnabled;

  // ─── Fetch storm intelligence when enabled ────────────────────

  const fetchBundle = useCallback(async () => {
    if (!map || !anyEnabled) return;

    const mapBounds = map.getBounds();
    if (!mapBounds) return;

    const ne = mapBounds.getNorthEast();
    const sw = mapBounds.getSouthWest();

    const bounds: VectorQueryBounds = {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
    };

    try {
      const result = await fetchStormIntelligenceBundle(bounds, {
        stormReportWindow: { hoursBack: 24 },
      });
      setBundle(result);
    } catch (err: any) {
      console.error('[StormIntel] Bundle fetch failed:', err.message);
    }
  }, [map, anyEnabled]);

  useEffect(() => {
    fetchBundle();
    // Re-fetch on map idle (pan/zoom)
    if (map && anyEnabled) {
      const listener = map.addListener('idle', fetchBundle);
      return () => google.maps.event.removeListener(listener);
    }
  }, [map, anyEnabled, fetchBundle]);

  // ─── Render vector features ───────────────────────────────────

  useEffect(() => {
    if (!map) return;

    // Clear previous features
    clearFeatures();

    if (!bundle || !anyEnabled) return;

    // Create data layer for polygons
    const dataLayer = new google.maps.Data({ map });
    dataLayerRef.current = dataLayer;

    // Add outlook polygons
    if (isOutlooksEnabled && bundle.outlooks.length > 0) {
      for (const feature of bundle.outlooks) {
        try {
          const geoJsonFeature = {
            type: 'Feature' as const,
            geometry: feature.geometry,
            properties: { ...feature.properties, _layerType: 'outlook' },
          };
          dataLayer.addGeoJson(geoJsonFeature);
        } catch (err) {
          console.debug('[StormIntel] Failed to add outlook feature:', err);
        }
      }
    }

    // Add mesoscale discussion polygons
    if (isMesoscaleEnabled && bundle.mesoscaleDiscussions.length > 0) {
      for (const feature of bundle.mesoscaleDiscussions) {
        try {
          const geoJsonFeature = {
            type: 'Feature' as const,
            geometry: feature.geometry,
            properties: { ...feature.properties, _layerType: 'mesoscale' },
          };
          dataLayer.addGeoJson(geoJsonFeature);
        } catch (err) {
          console.debug('[StormIntel] Failed to add mesoscale feature:', err);
        }
      }
    }

    // Style polygons
    dataLayer.setStyle((feature) => {
      const layerType = feature.getProperty('_layerType');
      const category = String(feature.getProperty('LABEL') ?? feature.getProperty('cat') ?? 'TSTM');
      const colors = OUTLOOK_CATEGORY_COLORS[category as keyof typeof OUTLOOK_CATEGORY_COLORS] ?? OUTLOOK_CATEGORY_COLORS['TSTM'];

      if (layerType === 'mesoscale') {
        return {
          fillColor: 'rgba(255, 200, 0, 0.15)',
          strokeColor: 'rgba(255, 180, 0, 0.7)',
          strokeWeight: 2,
          fillOpacity: 0.15,
          strokeOpacity: 0.7,
          zIndex: 65,
        };
      }

      return {
        fillColor: colors.fill,
        strokeColor: colors.stroke,
        strokeWeight: 2,
        fillOpacity: 0.2,
        strokeOpacity: 0.8,
        zIndex: 60,
      };
    });

    // Add LSR point markers
    if (isReportsEnabled && bundle.localStormReports.length > 0) {
      const markers: google.maps.Marker[] = [];

      for (const report of bundle.localStormReports) {
        if (report.geometry.type !== 'Point') continue;
        const coords = (report.geometry as { type: string; coordinates: number[] }).coordinates;
        if (!coords || coords.length < 2) continue;

        const eventType =
          (report.properties.EVENT_TYPE as string) ??
          (report.properties.event as string) ??
          'DEFAULT';

        const marker = new google.maps.Marker({
          position: { lat: coords[1], lng: coords[0] },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getLsrColor(eventType),
            fillOpacity: 0.8,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 6,
          },
          title: `LSR: ${eventType}`,
          zIndex: 70,
        });

        markers.push(marker);
      }

      markersRef.current = markers;
    }

    return () => clearFeatures();
  }, [map, bundle, anyEnabled, isOutlooksEnabled, isMesoscaleEnabled, isReportsEnabled]);

  // ─── Cleanup ──────────────────────────────────────────────────

  const clearFeatures = useCallback(() => {
    if (dataLayerRef.current) {
      dataLayerRef.current.setMap(null);
      dataLayerRef.current = null;
    }
    for (const marker of markersRef.current) {
      marker.setMap(null);
    }
    markersRef.current = [];
  }, []);

  // Component doesn't render DOM — it manipulates Google Maps overlays
  return null;
}
