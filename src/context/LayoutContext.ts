
import { createContext, useContext } from 'react';

export type LayoutContextState = {
  sidebarWidth: number;
  isSidebarCollapsed: boolean;
  overHUDHeight: number;
  isOverHUDExpanded: boolean;
  panelEngineBounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export const LayoutContext = createContext<LayoutContextState | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
