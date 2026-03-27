"use client";

import { createContext, useContext, useState } from "react";

type SplashState = {
  activePanelId: string | null;
  openSplash: (id: string) => void;
  closeSplash: () => void;
};

const SplashContext = createContext<SplashState | undefined>(undefined);

export const SplashProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  const openSplash = (id: string) => setActivePanelId(id);
  const closeSplash = () => setActivePanelId(null);

  return (
    <SplashContext.Provider value={{ activePanelId, openSplash, closeSplash }}>
      {children}
    </SplashContext.Provider>
  );
};

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error("useSplash must be used within SplashProvider");
  }
  return context;
};
