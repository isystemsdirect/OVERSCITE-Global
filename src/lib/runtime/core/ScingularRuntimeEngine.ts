/**
 * @classification SCINGULAR_RUNTIME_CORE
 * @engine SCINGULAR_RUNTIME_ENGINE
 * @purpose The unified OS-grade deterministic runtime spine. Manages tick loops, universal state, and domain-agnostic evaluation.
 */

import { GlobalAuthorityEngine, SystemActuationPosture, CommandTriad } from './GlobalAuthorityEngine';
import { LariSyncUniversal, UniversalSyncPayload } from './LariSyncUniversal';

export interface AuditLogEntry {
  timestamp: string;
  commandType: 'CRITICAL_ACTUATION' | 'MODE_CHANGE' | 'DELEGATION' | 'ROUTINE';
  triad: CommandTriad;
  action: string;
  permitted: boolean;
  reason: string | null;
  baneComplianceHash: string;
}

export type SCINGULAR_DOMAIN = 'FLIGHT' | 'INSPECTION' | 'ROBOTICS' | 'WIRM';

export interface GenericTelemetry {
  energyLevel: number; // 0-100 (Battery equivalent)
  connectionQuality: number; // 0-100 (Link quality equivalent)
  velocity: number;
  altitudeZ: number;
  [key: string]: any; // Domain specific extensions
}

export interface UniversalRuntimeState<T = any> {
  domain: SCINGULAR_DOMAIN;
  isConnected: boolean;
  isActiveOrArmed: boolean;
  actuationPosture: SystemActuationPosture;
  telemetry: GenericTelemetry;
  domainSpecificState: T | null;
  syncPayload: UniversalSyncPayload<T> | null;
  baneAuditLog: AuditLogEntry[];
}

export class ScingularRuntimeEngine<T = any> {
  private authorityEngine: GlobalAuthorityEngine;
  private syncEngine: LariSyncUniversal;
  
  private currentState: UniversalRuntimeState<T>;
  private stateSubscribers: Array<(state: UniversalRuntimeState<T>) => void> = [];
  
  private tickInterval: NodeJS.Timeout | null = null;
  private domainEvaluator: ((telemetry: GenericTelemetry) => T) | null = null;

  constructor(domain: SCINGULAR_DOMAIN) {
    this.authorityEngine = new GlobalAuthorityEngine();
    this.syncEngine = new LariSyncUniversal();

    this.currentState = {
      domain,
      isConnected: true,
      isActiveOrArmed: false,
      actuationPosture: 'SUPERVISORY',
      telemetry: {
        energyLevel: 100,
        connectionQuality: 100,
        velocity: 0,
        altitudeZ: 0
      },
      domainSpecificState: null,
      syncPayload: null,
      baneAuditLog: []
    };
  }

  public registerDomainEvaluator(evaluator: (telemetry: GenericTelemetry) => T) {
    this.domainEvaluator = evaluator;
  }

  public subscribe(callback: (state: UniversalRuntimeState<T>) => void): () => void {
    this.stateSubscribers.push(callback);
    callback(this.currentState); // Emit immediate
    return () => {
      this.stateSubscribers = this.stateSubscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.stateSubscribers.forEach(sub => sub({ ...this.currentState }));
  }

  public startRuntime() {
    if (this.tickInterval) return;

    this.tickInterval = setInterval(() => {
      this.tick();
    }, 1000); // 1Hz runtime base tick
  }

  public stopRuntime() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick() {
    // 1. Simulate telemetry decay/drift
    const activeDrain = this.currentState.isActiveOrArmed ? 0.2 : 0.05;
    
    this.currentState.telemetry = {
      ...this.currentState.telemetry,
      energyLevel: Math.max(0, this.currentState.telemetry.energyLevel - activeDrain),
      connectionQuality: this.currentState.isActiveOrArmed && this.currentState.telemetry.energyLevel < 10 
        ? Math.max(0, this.currentState.telemetry.connectionQuality - 1) 
        : this.currentState.telemetry.connectionQuality,
      altitudeZ: this.currentState.isActiveOrArmed ? this.currentState.telemetry.altitudeZ + (Math.random() * 2 - 0.5) : this.currentState.telemetry.altitudeZ,
      velocity: this.currentState.isActiveOrArmed ? Math.max(0, this.currentState.telemetry.velocity + (Math.random() * 0.5 - 0.2)) : this.currentState.telemetry.velocity
    };

    // 2. Evaluate Authority constraints
    this.currentState.actuationPosture = this.authorityEngine.evaluateSystemPosture(
      this.currentState.isConnected,
      this.currentState.isActiveOrArmed,
      false
    );

    // 3. Domain Specific Evaluation
    if (this.domainEvaluator) {
      this.currentState.domainSpecificState = this.domainEvaluator(this.currentState.telemetry);
    }

    // 4. Generate Universal Sync Payload
    this.currentState.syncPayload = this.syncEngine.generateSyncPayload(this.currentState.domainSpecificState as T);

    // 5. Publish
    this.notifySubscribers();
  }

  // --- External Mutations ---

  public setConnection(connected: boolean) {
    this.currentState.isConnected = connected;
    if (!connected) this.currentState.isActiveOrArmed = false;
    this.notifySubscribers();
  }

  public setActuationState(active: boolean) {
    if (!this.currentState.isConnected && active) {
      console.warn("RUNTIME: Cannot actuate while disconnected. Blocked by AuthorityGate.");
      return;
    }
    this.currentState.isActiveOrArmed = active;
    this.notifySubscribers();
  }

  public executeGatedCommand(
    commandType: 'CRITICAL_ACTUATION' | 'MODE_CHANGE' | 'DELEGATION' | 'ROUTINE',
    action: string,
    triad: CommandTriad,
    executeFn: () => void
  ) {
    const validation = this.authorityEngine.validateCommand(triad, commandType);
    
    // Simulate a cryptographic trace hash for BANE compliance
    const baneHash = `BANE-ZTI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      commandType,
      triad,
      action,
      permitted: validation.permitted,
      reason: validation.reason,
      baneComplianceHash: baneHash
    };

    this.currentState.baneAuditLog = [entry, ...this.currentState.baneAuditLog].slice(0, 100);

    if (validation.permitted) {
      executeFn();
    } else {
      console.warn(`[BANE_GOVERNANCE_BLOCK] Command ${action} rejected: ${validation.reason}`);
    }

    this.notifySubscribers();
    return validation;
  }

  public getSyncEngine() { return this.syncEngine; }
  public getAuthorityEngine() { return this.authorityEngine; }
}
