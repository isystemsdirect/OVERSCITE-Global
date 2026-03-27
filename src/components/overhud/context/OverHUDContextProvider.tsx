// src/components/overhud/context/OverHUDContextProvider.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OverHUDContext as IOverHUDContext, ArtifactType, ReviewStatus } from '@/lib/lari-repo/types';
import { initializeMockData } from '@/lib/lari-repo/mock-data';

interface OverHUDContextType extends IOverHUDContext {
  setJobId: (id: string) => void;
  setArtifactId: (id: string, type: ArtifactType) => void;
  setFindingId: (id: string) => void;
  setReviewStatus: (status: ReviewStatus) => void;
  setOverlayVisible: (visible: boolean) => void;
  setReportId: (id: string) => void;
}

const OverHUDContext = createContext<OverHUDContextType | undefined>(undefined);

export function OverHUDContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IOverHUDContext>({
    currentOverlayVisible: true,
    currentReviewerRole: 'reviewer', // Matched to IOverHUDContext
  });

  useEffect(() => {
    // Populate mock data for demonstration
    initializeMockData();
  }, []);

  const setJobId = (currentJobId: string) => setState(prev => ({ ...prev, currentJobId }));
  const setArtifactId = (currentArtifactId: string, currentArtifactType: ArtifactType) => 
    setState(prev => ({ ...prev, currentArtifactId, currentArtifactType }));
  const setFindingId = (currentFindingId: string) => setState(prev => ({ ...prev, currentFindingId }));
  const setReviewStatus = (currentReviewStatus: ReviewStatus) => setState(prev => ({ ...prev, currentReviewStatus }));
  const setOverlayVisible = (currentOverlayVisible: boolean) => setState(prev => ({ ...prev, currentOverlayVisible }));
  const setReportId = (currentReportId: string) => setState(prev => ({ ...prev, currentReportId }));

  return (
    <OverHUDContext.Provider value={{
      ...state,
      setJobId,
      setArtifactId,
      setFindingId,
      setReviewStatus,
      setOverlayVisible,
      setReportId
    }}>
      {children}
    </OverHUDContext.Provider>
  );
}

export function useOverHUD() {
  const context = useContext(OverHUDContext);
  if (context === undefined) {
    throw new Error('useOverHUD must be used within an OverHUDContextProvider');
  }
  return context;
}
