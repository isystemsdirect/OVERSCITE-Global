'use client';

import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useScingularRuntime } from './ScingularRuntimeContext';
import { FlightDomainState } from '@/lib/runtime/domains/FlightDomainAdapter';
import { AuthorityPosture } from '@/lib/lari/flight/lari-fc';
import { SituationalTruthState } from '@/lib/lari/flight/lari-aware';
import { HUDSymbologyState } from '@/lib/lari/flight/lari-hud';
import { SurfaceSyncState, OperatorRole, SurfaceAuthorityPosture } from '@/lib/lari/flight/lari-sync';

// --- Types (Preserved for backward compatibility with UI) ---
export type FlightMode = 'DISARMED' | 'ARMED' | 'PLAN' | 'HOLD' | 'MANUAL';

export interface TelemetryData {
  battery: number;
  linkQuality: number;
  satellites: number;
  altitude: number;
  velocity: number;
  vibration: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
  yawDrift: number;
  windComp: number;
  imuSync: string;
}

export interface FlightAlert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'EMERGENCY';
  message: string;
}

export type MissionProgressState = 'not_loaded' | 'loaded' | 'staged' | 'in_progress' | 'holding' | 'restricted' | 'abort_pending' | 'aborted' | 'completed';
export type ZoneContextState = 'clear' | 'approaching_boundary' | 'inside_boundary' | 'restricted_zone_near' | 'restricted_zone_entered';
export type RouteIntegrityState = 'on_path' | 'minor_deviation' | 'material_deviation' | 'path_unknown';
export type SyncIntegrityState = 'aligned' | 'lagging' | 'stale' | 'divergent';

export interface Waypoint {
  id: string;
  name: string;
  distance: number;
  eta: number;
  status: 'pending' | 'active' | 'passed';
}

export interface MissionData {
  id: string;
  name: string;
  waypoints: Waypoint[];
  currentWaypointIndex: number;
  homeAnchor: { lat: number; lng: number; distance: number };
}

interface LiveFlightState {
  flightMode: FlightMode;
  setFlightMode: (mode: FlightMode) => void;
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  isArmed: boolean;
  setArmed: (armed: boolean) => void;
  isOverFLIGHTActive: boolean;
  overFlightMode: 'STANDARD' | 'HIGH_DENSITY' | 'SURROUND';
  telemetry: TelemetryData;
  alerts: FlightAlert[];
  authorityPosture: AuthorityPosture;
  situationalTruth: SituationalTruthState | null;
  hudState: HUDSymbologyState | null;
  syncState: SurfaceSyncState | null;
  activeSupportWindows: string[];
  surfaceRegistry: Record<string, 'primary' | 'secondary' | 'external'>;
  routeSurface: (id: string, path: string) => void;
  trackWindow: (id: string, active: boolean) => void;
  faultSeverity: 'advisory' | 'caution' | 'critical' | 'failsafe';
  telemetryFreshness: 'live' | 'delayed' | 'stale' | 'unknown';
  truthDivergence: 'aligned' | 'minor_divergence' | 'material_divergence' | 'confidence_collapse';
  consequenceState: 'idle' | 'pending_confirmation' | 'confirmed' | 'blocked' | 'restricted' | 'ack_required';
  blockReason: string | null;
  setFaultSeverity: (severity: 'advisory' | 'caution' | 'critical' | 'failsafe') => void;
  setTelemetryFreshness: (freshness: 'live' | 'delayed' | 'stale' | 'unknown') => void;
  setTruthDivergence: (divergence: 'aligned' | 'minor_divergence' | 'material_divergence' | 'confidence_collapse') => void;
  setConsequenceState: (state: 'idle' | 'pending_confirmation' | 'confirmed' | 'blocked' | 'restricted' | 'ack_required', reason?: string) => void;
  safeStateVerified: boolean;
  setSafeStateVerified: (verified: boolean) => void;
  missionState: MissionProgressState;
  zoneContext: ZoneContextState;
  routeIntegrity: RouteIntegrityState;
  syncIntegrity: SyncIntegrityState;
  missionData: MissionData | null;
  setMissionState: (state: MissionProgressState) => void;
  setZoneContext: (context: ZoneContextState) => void;
  setRouteIntegrity: (integrity: RouteIntegrityState) => void;
  setSyncIntegrity: (integrity: SyncIntegrityState) => void;
  setMissionData: (data: MissionData | null) => void;
  currentOperatorRole: OperatorRole;
  surfaceManifest: SurfaceSyncState['surfaceManifest'];
  setOperatorRole: (role: OperatorRole) => void;
  delegateAuthority: (surfaceId: string, authority: SurfaceAuthorityPosture) => void;
}

const LiveFlightContext = createContext<LiveFlightState | undefined>(undefined);

export function useLiveFlight() {
  const context = useContext(LiveFlightContext);
  if (!context) throw new Error('useLiveFlight must be used within a LiveFlightProvider');
  return context;
}

export function LiveFlightProvider({ children }: { children: React.ReactNode }) {
  const { state: runtimeState, setConnection, setActuationState, registerSurface, unregisterSurface, delegateAuthority: delegateRuntimeAuthority } = useScingularRuntime();
  
  // Cast domainState as we know we are in FLIGHT domain adapter context when this is used
  const domainState = runtimeState.domainSpecificState as FlightDomainState | null;

  // UI-Local state that doesn't need to be in the OS engine
  const [flightMode, setFlightMode] = useState<FlightMode>('DISARMED');
  const [activeSupportWindows, setActiveSupportWindows] = useState<string[]>([]);
  const [surfaceRegistry, setSurfaceRegistry] = useState<Record<string, 'primary' | 'secondary' | 'external'>>({});
  const [safeStateVerified, setSafeStateVerified] = useState(false);
  const [alerts, setAlerts] = useState<FlightAlert[]>([]);
  
  // Phase 3 & 4 Manual States for Demo UI
  const [faultSeverity, setFaultSeverity] = useState<'advisory' | 'caution' | 'critical' | 'failsafe'>('advisory');
  const [telemetryFreshness, setTelemetryFreshness] = useState<'live' | 'delayed' | 'stale' | 'unknown'>('live');
  const [truthDivergence, setTruthDivergence] = useState<'aligned' | 'minor_divergence' | 'material_divergence' | 'confidence_collapse'>('aligned');
  const [consequenceStateInternal, setConsequenceStateInternal] = useState<'idle' | 'pending_confirmation' | 'confirmed' | 'blocked' | 'restricted' | 'ack_required'>('idle');
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [missionState, setMissionState] = useState<MissionProgressState>('not_loaded');
  const [zoneContext, setZoneContext] = useState<ZoneContextState>('clear');
  const [routeIntegrity, setRouteIntegrity] = useState<RouteIntegrityState>('on_path');
  const [syncIntegrity, setSyncIntegrity] = useState<SyncIntegrityState>('aligned');
  const [missionData, setMissionData] = useState<MissionData | null>(null);

  const [currentOperatorRole, setOperatorRole] = useState<OperatorRole>('PILOT');

  const setConsequenceState = useCallback((state: any, reason?: string) => {
    setConsequenceStateInternal(state);
    if (reason) setBlockReason(reason);
    else if (state === 'idle') setBlockReason(null);
  }, []);

  const trackWindow = useCallback((id: string, active: boolean) => {
    setActiveSupportWindows(prev => {
      let newActive = prev;
      if (active && !prev.includes(id)) {
        newActive = [...prev, id];
        registerSurface(id, 'PROJECTED', 'OBSERVER');
      }
      if (!active && prev.includes(id)) {
        newActive = prev.filter(w => w !== id);
        unregisterSurface(id);
      }
      return newActive;
    });
  }, [registerSurface, unregisterSurface]);

  const routeSurface = useCallback((id: string, path: string) => {
    setSurfaceRegistry(prev => ({ ...prev, [id]: 'secondary' }));
  }, []);

  const setArmed = useCallback((armed: boolean) => {
    setActuationState(armed);
    if (armed) {
      setFlightMode('ARMED');
      setSafeStateVerified(true);
    } else {
      setFlightMode('DISARMED');
      setSafeStateVerified(false);
      setAlerts([]);
    }
  }, [setActuationState]);

  // Map generic runtime SyncPayload to Flight's expected SurfaceSyncState format
  const mappedSyncState: SurfaceSyncState | null = runtimeState.syncPayload ? {
    globalHUDState: domainState?.hudSymbology || {} as any,
    activeSurfaces: Object.keys(runtimeState.syncPayload.surfaceManifest),
    surfaceManifest: runtimeState.syncPayload.surfaceManifest as unknown as SurfaceSyncState['surfaceManifest'],
    latencyHealth: 'NOMINAL',
    timestamp: runtimeState.syncPayload.syncTimestamp
  } : null;

  // Fallbacks for telemetry when domainState is null
  const defaultTelemetry: TelemetryData = { battery: 100, linkQuality: 100, satellites: 0, altitude: 0, velocity: 0, vibration: 'NOMINAL', yawDrift: 0, windComp: 0, imuSync: '100%' };

  const value = useMemo(() => ({
    flightMode, setFlightMode,
    isConnected: runtimeState.isConnected, setConnected: setConnection,
    isArmed: runtimeState.isActiveOrArmed, setArmed,
    isOverFLIGHTActive: runtimeState.isActiveOrArmed,
    overFlightMode: runtimeState.isActiveOrArmed ? 'HIGH_DENSITY' as const : 'STANDARD' as const,
    telemetry: domainState?.droneTelemetry || defaultTelemetry,
    alerts,
    authorityPosture: runtimeState.actuationPosture as AuthorityPosture,
    situationalTruth: domainState?.situationalTruth || null,
    hudState: domainState?.hudSymbology || null,
    syncState: mappedSyncState,
    surfaceRegistry, routeSurface, trackWindow, activeSupportWindows,
    safeStateVerified, setSafeStateVerified,
    faultSeverity, setFaultSeverity,
    telemetryFreshness, setTelemetryFreshness,
    truthDivergence, setTruthDivergence,
    consequenceState: consequenceStateInternal, setConsequenceState, blockReason,
    missionState, setMissionState,
    zoneContext, setZoneContext,
    routeIntegrity, setRouteIntegrity,
    syncIntegrity, setSyncIntegrity,
    missionData, setMissionData,
    currentOperatorRole, setOperatorRole,
    surfaceManifest: runtimeState.syncPayload?.surfaceManifest as unknown as SurfaceSyncState['surfaceManifest'] || {},
    delegateAuthority: delegateRuntimeAuthority
  }), [
    flightMode, runtimeState, domainState, alerts, mappedSyncState, surfaceRegistry, routeSurface, trackWindow, activeSupportWindows, safeStateVerified, faultSeverity, telemetryFreshness, truthDivergence, consequenceStateInternal, setConsequenceState, blockReason, missionState, zoneContext, routeIntegrity, syncIntegrity, missionData, currentOperatorRole, delegateRuntimeAuthority, setConnection, setArmed
  ]);

  return (
    <LiveFlightContext.Provider value={value}>
      {children}
    </LiveFlightContext.Provider>
  );
}

