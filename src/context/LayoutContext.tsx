'use client';

/**
 * @classification CONTEXT_PROVIDER
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Provides the layout boundaries for the Panel Engine, ensuring it does not
 * overlap with the Sidebar or OverHUD. This context is critical for
 * maintaining a clean, predictable, and contained UI structure.
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

interface LayoutContextType {
  sidebarWidth: number;
  overHUDHeight: number;
  panelEngineBounds: {
    top: number;
    left: number;
    width: string; // e.g., 'calc(100% - 50px)'
    height: string; // e.g., 'calc(100% - 50px)'
  };
  setSidebarWidth: (width: number) => void;
  setOverHUDHeight: (height: number) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(50);
  const [overHUDHeight, setOverHUDHeight] = useState(50);

  const panelEngineBounds = useMemo(() => ({
    top: overHUDHeight,
    left: sidebarWidth,
    width: `calc(100% - ${sidebarWidth}px)`,
    height: `calc(100% - ${overHUDHeight}px)`,
  }), [sidebarWidth, overHUDHeight]);

  const value = {
    sidebarWidth,
    overHUDHeight,
    panelEngineBounds,
    setSidebarWidth,
    setOverHUDHeight,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};
