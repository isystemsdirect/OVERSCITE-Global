/**
 * @classification WEATHER_INTELLIGENCE_ROUTE
 * @authority SCINGULAR Prime
 * @status CANONICAL
 *
 * Next.js API route for weather point intelligence.
 * Server-side only — no browser Firebase SDK imported.
 *
 * Accepts: GET /api/weather?lat=...&lon=...
 * Returns: Normalized envelope with UnifiedForecastModel, WeatherSignal[],
 *          provenance metadata, and truth-state labels.
 *
 * Feature-flag: NEXT_PUBLIC_WEATHER_MOCK=true forces mock fallback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { NwsPointProvider } from '@/lib/weather/providers/nws-point-provider';
import { generateMockWeatherData } from '@/lib/weather/service';
import { buildSourceMetadata } from '@/lib/weather/source-metadata';
import { deriveTruthStateLabel } from '@/lib/weather/truth-state';
import type { SourceMetadata } from '@/lib/weather/source-metadata';

// ─── Provider Instance ───────────────────────────────────────────

const nwsProvider = new NwsPointProvider();

// ─── Route Handler ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lon = parseFloat(searchParams.get('lon') ?? '');

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: 'Missing or invalid lat/lon parameters' },
      { status: 400 }
    );
  }

  // Feature-flag: mock fallback
  const useMock = process.env.NEXT_PUBLIC_WEATHER_MOCK === 'true';

  if (useMock) {
    const mockData = generateMockWeatherData(lat, lon);
    const mockMeta: SourceMetadata = buildSourceMetadata({
      provider: 'mock',
      datasetOrProduct: 'OVERSCITE Mock Generator',
      rawBody: JSON.stringify(mockData),
      cacheState: 'mock',
      displayMode: 'mock',
    });

    return NextResponse.json({
      model: mockData,
      signals: [],
      alerts: [],
      meta: mockMeta,
      truthState: deriveTruthStateLabel('mock', 'mock'),
    });
  }

  try {
    // Fetch live data from NWS
    const [forecastResult, alertResult] = await Promise.all([
      nwsProvider.fetchForecast(lat, lon),
      nwsProvider.fetchActiveAlerts(lat, lon),
    ]);

    // Merge alerts into the unified model
    if (alertResult.alerts.length > 0) {
      forecastResult.model.alerts = alertResult.alerts.map((a) => ({
        sender_name: a.source.provider,
        event: a.alert?.title ?? 'Weather Alert',
        start: new Date(a.alert?.startsAtUtc ?? a.atUtc).getTime() / 1000,
        end: new Date(a.alert?.endsAtUtc ?? a.atUtc).getTime() / 1000 + 86400,
        description: a.alert?.description ?? '',
        tags: a.hazards,
      }));
    }

    return NextResponse.json({
      model: forecastResult.model,
      signals: forecastResult.signals,
      alerts: alertResult.alerts,
      meta: forecastResult.meta,
      alertMeta: alertResult.meta,
      truthState: deriveTruthStateLabel(
        forecastResult.meta.displayMode,
        forecastResult.meta.cacheState,
        {
          confidenceClass: forecastResult.meta.confidenceClass,
          attribution: forecastResult.meta.attribution,
        }
      ),
    });
  } catch (err: any) {
    console.error('[Weather Route] NWS fetch failed:', err.message);

    // Degrade gracefully with truth-state honesty
    return NextResponse.json(
      {
        error: 'Weather data temporarily unavailable',
        detail: err.message,
        truthState: deriveTruthStateLabel('observed_point', 'stale_cache'),
      },
      { status: 503 }
    );
  }
}
