/**
 * @classification WEATHER_INTELLIGENCE_STORM
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Storm intelligence client aggregating NOAA GIS MapServer queries.
 * Provides a unified interface for consuming storm outlook, mesoscale
 * discussion, and local storm report data.
 *
 * This module is consumed by StormIntelligenceOverlay.tsx for map rendering
 * and can be consumed by Weather Command for intelligence panel display.
 */

import { getDefaultVectorProvider } from '@/lib/weather/providers/vector-provider-registry';
import type { VectorFeature, VectorQueryBounds, VectorTimeWindow } from '@/lib/weather/providers/types';

// ─── Storm Intelligence Aggregation ──────────────────────────────

export type StormIntelligenceBundle = {
  outlooks: VectorFeature[];
  mesoscaleDiscussions: VectorFeature[];
  localStormReports: VectorFeature[];
  alertPolygons: VectorFeature[];
  fetchedAtUtc: string;
  isPartial: boolean; // true if any sub-query failed
};

/**
 * Fetch all storm intelligence layers for a given bounds.
 * Partial failures do not block the entire bundle — degraded data
 * is returned with the isPartial flag set.
 */
export const fetchStormIntelligenceBundle = async (
  bounds: VectorQueryBounds,
  opts?: { stormReportWindow?: VectorTimeWindow }
): Promise<StormIntelligenceBundle> => {
  const provider = getDefaultVectorProvider();
  const window: VectorTimeWindow = opts?.stormReportWindow ?? { hoursBack: 24 };
  let isPartial = false;

  const [outlooks, mesoscaleDiscussions, localStormReports, alertPolygons] =
    await Promise.all([
      provider.fetchStormOutlooks(bounds).catch((err) => {
        console.warn('[StormIntel] Outlook fetch degraded:', err.message);
        isPartial = true;
        return [] as VectorFeature[];
      }),
      provider.fetchMesoscaleDiscussions(bounds).catch((err) => {
        console.warn('[StormIntel] Mesoscale fetch degraded:', err.message);
        isPartial = true;
        return [] as VectorFeature[];
      }),
      provider.fetchLocalStormReports(bounds, window).catch((err) => {
        console.warn('[StormIntel] LSR fetch degraded:', err.message);
        isPartial = true;
        return [] as VectorFeature[];
      }),
      provider.fetchAlertPolygons(bounds).catch((err) => {
        console.warn('[StormIntel] Alert polygon fetch degraded:', err.message);
        isPartial = true;
        return [] as VectorFeature[];
      }),
    ]);

  return {
    outlooks,
    mesoscaleDiscussions,
    localStormReports,
    alertPolygons,
    fetchedAtUtc: new Date().toISOString(),
    isPartial,
  };
};

// ─── Outlook Category Colors ─────────────────────────────────────

/**
 * SPC Convective Outlook category color mapping.
 * Used by StormIntelligenceOverlay for polygon fill/stroke.
 */
export const OUTLOOK_CATEGORY_COLORS: Record<string, { fill: string; stroke: string }> = {
  'TSTM': { fill: 'rgba(200, 255, 200, 0.25)', stroke: 'rgba(100, 200, 100, 0.8)' },
  'MRGL': { fill: 'rgba(0, 100, 0, 0.20)', stroke: 'rgba(0, 150, 0, 0.8)' },
  'SLGT': { fill: 'rgba(255, 255, 0, 0.20)', stroke: 'rgba(200, 200, 0, 0.8)' },
  'ENH':  { fill: 'rgba(255, 165, 0, 0.25)', stroke: 'rgba(255, 140, 0, 0.8)' },
  'MDT':  { fill: 'rgba(255, 0, 0, 0.25)', stroke: 'rgba(220, 0, 0, 0.8)' },
  'HIGH': { fill: 'rgba(255, 0, 255, 0.30)', stroke: 'rgba(200, 0, 200, 0.9)' },
};

/**
 * LSR event type color mapping for point markers.
 */
export const LSR_EVENT_COLORS: Record<string, string> = {
  'TORNADO': '#FF0000',
  'HAIL': '#00FF00',
  'TSTM WND DMG': '#FFA500',
  'TSTM WND GST': '#FFD700',
  'FLOOD': '#0000FF',
  'FLASH FLOOD': '#4444FF',
  'HEAVY RAIN': '#6666FF',
  'SNOW': '#FFFFFF',
  'ICE STORM': '#CCCCFF',
  'FUNNEL CLOUD': '#FF6600',
  'DEFAULT': '#AAAAAA',
};

export const getLsrColor = (eventType: string): string => {
  return LSR_EVENT_COLORS[eventType?.toUpperCase()] ?? LSR_EVENT_COLORS['DEFAULT'];
};
