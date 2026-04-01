/**
 * @classification PROTOCOL_INTERFACE
 * @authority Director
 * @status CANON_LOCKED
 * @version 1.0.0
 * 
 * @purpose
 * Structural definition of the OVERSCITE Repository Object Model.
 * Provides the explicit domain array required for tree hierarchies 
 * representing evidence, governance, and operational pipelines.
 */

import { TruthState } from '../constants/truth-states';

// 1. Core Principles - Exactly 14 canonical roots
export enum CanonicalRoot {
  System = 'System',
  Audit = 'Audit',
  Evidence = 'Evidence',
  CaptureSessions = 'CaptureSessions',
  Sensors = 'Sensors',
  Devices = 'Devices',
  Analysis = 'Analysis',
  Reports = 'Reports',
  Sync = 'Sync',
  Exports = 'Exports',
  Archives = 'Archives',
  Recovery = 'Recovery',
  Temp = 'Temp',
  UserSpace = 'UserSpace'
}

export type RootPolicy = 'protected' | 'append_only' | 'structured' | 'ephemeral' | 'user_flex';
export type SyncState = 'local' | 'pending' | 'synced' | 'error';
export type NodeKind = 'root' | 'folder' | 'file';

export interface RepoNode {
  id: string;
  label: string;
  canonical_class: CanonicalRoot | string; // root or derived sub-classification
  node_kind: NodeKind;
  trust_state: TruthState;
  visibility_policy: string; // "public", "bane_shield", "auth_only"
  mutation_class: RootPolicy;
  audit_ref?: string;
  
  // Optional and Hierarchical Fields
  origin?: string;
  timestamp?: string; // ISO datetime
  sync_state?: SyncState;
  created_at?: string;
  created_by?: string;
  last_modified_at?: string;
  last_modified_by?: string;
  linkage?: string[];
  status_tags?: string[];
  capability_requirements?: string[]; // scopes required, e.g. "repository.read.node"

  // Structural hierarchy
  children?: RepoNode[];
}

export const CANONICAL_ROOT_ORDER: CanonicalRoot[] = [
  CanonicalRoot.System,
  CanonicalRoot.Audit,
  CanonicalRoot.Evidence,
  CanonicalRoot.CaptureSessions,
  CanonicalRoot.Sensors,
  CanonicalRoot.Devices,
  CanonicalRoot.Analysis,
  CanonicalRoot.Reports,
  CanonicalRoot.Sync,
  CanonicalRoot.Exports,
  CanonicalRoot.Archives,
  CanonicalRoot.Recovery,
  CanonicalRoot.Temp,
  CanonicalRoot.UserSpace
];
