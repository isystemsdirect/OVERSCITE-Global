/**
 * @classification PROTOCOL_INTERFACE
 * @authority Director
 * @status MOCK_AUTHORITY
 * @version 1.0.0
 * 
 * @purpose
 * Typed definition of the One-Time Capability Invocation Token (OCIT).
 * Represents the native bridge handshake between SCINGULAR and the REBEL Dock.
 * 
 * @doctrinal_lock
 * Frontend application logic operates in `mock_ui` or `simulated_runtime` mode only.
 * Native cryptographic enforcement is deferred to the physical REBEL integration phase.
 * Under no circumstance may this frontend simulation claim `native_rebel` 
 * without active device-bound bridging.
 */

export type CapabilityScope = 
  | 'repository.read.node'
  | 'repository.inspect.metadata'
  | 'repository.invoke.preview'
  | 'repository.invoke.attach'
  | 'repository.invoke.export'
  | 'repository.invoke.seal_mock';

export type BridgeMode = 
  | 'mock_ui'
  | 'simulated_runtime'
  | 'native_rebel';

export interface OneTimeInvocationToken {
  token_id: string;
  nonce: string;
  issued_at: string; // ISO DateTime
  expires_at: string; // ISO DateTime
  scope: CapabilityScope;
  signature: string;
  bridge_mode: BridgeMode;
  single_use: boolean;
  
  // Future native bindings
  device_id?: string;
  dock_session_id?: string;
  actor_id?: string;
  workspace_id?: string;
  origin?: string;
  policy_hash?: string;
  mock?: boolean;
}

export type OcitUiPosture = 
  | 'MOCK OCIT'
  | 'NATIVE PENDING'
  | 'SIMULATED BRIDGE'
  | 'BLOCKED WITHOUT OCIT'
  | 'AVAILABLE'
  | 'POLICY BLOCKED';
