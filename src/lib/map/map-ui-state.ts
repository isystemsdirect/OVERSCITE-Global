import { create } from 'zustand';

interface MapUiState {
  weatherMasterEnabled: boolean;
  weatherRadarOpacity: number;
  activeBaseOverlayId: string | null;
  layers: Record<string, boolean>;
  setWeatherMasterEnabled: (enabled: boolean) => void;
  setWeatherRadarOpacity: (opacity: number) => void;
  setActiveBaseOverlayId: (id: string | null) => void;
  toggleLayer: (layerId: string) => void;
}

export const useMapUiStore = create<MapUiState>((set) => ({
  weatherMasterEnabled: true,
  weatherRadarOpacity: 0.5,
  activeBaseOverlayId: 'mrms_base_reflectivity',
  layers: {
    'radar': true,
    'satellite': false,
  },
  setWeatherMasterEnabled: (enabled) => set({ weatherMasterEnabled: enabled }),
  setWeatherRadarOpacity: (opacity) => set({ weatherRadarOpacity: opacity }),
  setActiveBaseOverlayId: (id) => set({ activeBaseOverlayId: id }),
  toggleLayer: (layerId) => set((state) => ({
    layers: { ...state.layers, [layerId]: !state.layers[layerId] }
  })),
}));
