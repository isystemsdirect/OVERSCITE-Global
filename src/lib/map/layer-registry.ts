export interface LayerDefinition {
  key: string;
  name: string;
  category: 'environmental' | 'infrastructure' | 'intel';
  tileProviderId?: string;
  zOrder?: number;
}

export const LAYER_REGISTRY: Record<string, LayerDefinition> = {
  radar_mrms: {
    key: 'radar_mrms',
    name: 'Radar Reflectivity (MRMS)',
    category: 'environmental',
    tileProviderId: 'mrms_base_reflectivity',
    zOrder: 100,
  },
  precip_rate: {
    key: 'precip_rate',
    name: 'Precipitation Rate (MRMS)',
    category: 'environmental',
    tileProviderId: 'mrms_precipitation_rate',
    zOrder: 90,
  },
  radar_mosaic: {
    key: 'radar_mosaic',
    name: 'National Radar Mosaic',
    category: 'environmental',
    tileProviderId: 'nws_radar_mosaic',
    zOrder: 80,
  }
};
