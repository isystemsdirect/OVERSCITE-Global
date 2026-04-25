/**
 * @classification SCINGULAR_RUNTIME_CORE
 * @engine ARC_IDENTITY
 * @purpose Manages the human operator identity bound to the current session, ensuring all BANE execution paths carry a valid ARC trace.
 */

'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export interface ArcIdentity {
  arcId: string;
  displayName: string;
  clearanceLevel: number;
  certifications: string[];
  sessionToken: string;
}

interface ArcIdentityContextValue {
  currentIdentity: ArcIdentity | null;
  loginAs: (identity: ArcIdentity) => void;
  logout: () => void;
  getSignature: () => string; // The trace string added to BANE
}

const ArcIdentityContext = createContext<ArcIdentityContextValue | undefined>(undefined);

export function useArcIdentity() {
  const context = useContext(ArcIdentityContext);
  if (!context) throw new Error('useArcIdentity must be used within an ArcIdentityProvider');
  return context;
}

export function ArcIdentityProvider({ children }: { children: React.ReactNode }) {
  const [currentIdentity, setCurrentIdentity] = useState<ArcIdentity | null>(null);

  const value = useMemo<ArcIdentityContextValue>(() => ({
    currentIdentity,
    loginAs: (identity) => setCurrentIdentity(identity),
    logout: () => setCurrentIdentity(null),
    getSignature: () => {
      if (!currentIdentity) return 'ANONYMOUS_UNAUTHORIZED';
      return `ARC::${currentIdentity.arcId}::${currentIdentity.sessionToken.substring(0, 8)}`;
    }
  }), [currentIdentity]);

  return (
    <ArcIdentityContext.Provider value={value}>
      {children}
    </ArcIdentityContext.Provider>
  );
}
