'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { ScingularRuntimeEngine, UniversalRuntimeState, SCINGULAR_DOMAIN } from '@/lib/runtime/core/ScingularRuntimeEngine';
import { FlightDomainAdapter, FlightDomainState } from '@/lib/runtime/domains/FlightDomainAdapter';
import { InspectionDomainAdapter, InspectionTaskState } from '@/lib/runtime/domains/InspectionDomainAdapter';
import { WirmDomainEvaluator, WirmDomainState } from '@/lib/runtime/domains/WirmDomainAdapter';
import { OperatorRole, SurfaceAuthorityPosture, SurfaceClassification } from '@/lib/runtime/core/LariSyncUniversal';

type ActiveDomainState = FlightDomainState | InspectionTaskState | WirmDomainState;

interface RuntimeContextValue {
  state: UniversalRuntimeState<ActiveDomainState>;
  
  // OS-Grade Mutations
  setConnection: (connected: boolean) => void;
  setActuationState: (active: boolean) => void;
  switchDomain: (domain: SCINGULAR_DOMAIN) => void;
  
  // Sync / Distribution Mutations
  registerSurface: (id: string, classification: SurfaceClassification, role: OperatorRole) => void;
  unregisterSurface: (id: string) => void;
  delegateAuthority: (id: string, posture: SurfaceAuthorityPosture) => void;
}

const ScingularRuntimeContext = createContext<RuntimeContextValue | undefined>(undefined);

export function useScingularRuntime() {
  const context = useContext(ScingularRuntimeContext);
  if (!context) throw new Error('useScingularRuntime must be used within a ScingularRuntimeProvider');
  return context;
}

export function ScingularRuntimeProvider({ children }: { children: React.ReactNode }) {
  // We initialize the generic engine with FLIGHT domain by default
  const engineRef = useRef(new ScingularRuntimeEngine<ActiveDomainState>('FLIGHT'));
  const flightAdapter = useRef(new FlightDomainAdapter());
  const inspectionAdapter = useRef(new InspectionDomainAdapter());

  const [runtimeState, setRuntimeState] = useState<UniversalRuntimeState<ActiveDomainState>>(
    // @ts-ignore - Initialization shim, the actual state comes from the subscribe block
    { domain: 'FLIGHT', isConnected: true, isActiveOrArmed: false, telemetry: {}, syncPayload: null }
  );

  useEffect(() => {
    const engine = engineRef.current;

    // Default to Flight Evaluator
    engine.registerDomainEvaluator((telemetry) => flightAdapter.current.evaluate(telemetry));

    const unsubscribe = engine.subscribe((state) => {
      setRuntimeState(state);
    });

    engine.startRuntime();

    return () => {
      unsubscribe();
      engine.stopRuntime();
    };
  }, []);

  const switchDomain = (domain: SCINGULAR_DOMAIN) => {
    const engine = engineRef.current;
    if (domain === 'FLIGHT') {
      engine.registerDomainEvaluator((telemetry) => flightAdapter.current.evaluate(telemetry));
    } else if (domain === 'INSPECTION') {
      engine.registerDomainEvaluator((telemetry) => inspectionAdapter.current.evaluate(telemetry, runtimeState.isActiveOrArmed));
    } else if (domain === 'WIRM') {
      engine.registerDomainEvaluator(WirmDomainEvaluator);
    }
  };

  const value = useMemo<RuntimeContextValue>(() => ({
    state: runtimeState,
    setConnection: (c) => engineRef.current.setConnection(c),
    setActuationState: (a) => engineRef.current.setActuationState(a),
    switchDomain,
    registerSurface: (id, cls, role) => engineRef.current.getSyncEngine().registerSurface(id, cls, role),
    unregisterSurface: (id) => engineRef.current.getSyncEngine().unregisterSurface(id),
    delegateAuthority: (id, posture) => engineRef.current.getSyncEngine().updateSurfaceAuthority(id, posture)
  }), [runtimeState]);

  return (
    <ScingularRuntimeContext.Provider value={value}>
      {children}
    </ScingularRuntimeContext.Provider>
  );
}
