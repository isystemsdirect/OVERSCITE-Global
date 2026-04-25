/**
 * @classification SCIMEGA_DRY_LINK_TYPES
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the interface contracts for the "Dry-Link" hardware preparation layer.
 * @warning DRY-LINK ONLY. No live connections authorized.
 */

import { BanePLVerdict } from '../pl/bane-pl-boundary-gate';

export type SCIMEGADryLinkStatus = 'contract_only' | 'dry_link_ready' | 'restricted' | 'blocked';

export type SCIMEGADryLinkChannelType = 
  | 'msp' 
  | 'mavlink' 
  | 'companion' 
  | 'payload_sensor' 
  | 'pilot_input' 
  | 'teon_safety';

export interface SCIMEGADryLinkChannel {
  channelId: string;
  type: SCIMEGADryLinkChannelType;
  protocol: string;
  expectedStatus: SCIMEGADryLinkStatus;
  capabilities: string[];
}

export interface SCIMEGADryLinkAdapterContract {
  adapterId: string;
  type: SCIMEGADryLinkChannelType;
  description: string;
  baudRates?: number[];
  ports?: string[];
  commandFamilies: string[];
  safetyLimitations: string[];
  isExecutionDisabled: boolean; // Must be true for dry-link
}

export interface SCIMEGADryLinkActivationIntent {
  intentId: string;
  targetAdapterId: string;
  requestedState: 'simulate' | 'connect' | 'transmit'; // connect/transmit will be blocked by BANE
  timestamp: string;
}

export interface SCIMEGADryLinkReadiness {
  isReady: boolean;
  verdict: SCIMEGADryLinkStatus;
  reasons: string[];
}

export interface SCIMEGADryLinkProfile {
  profileId: string;
  timestamp: string;
  contracts: SCIMEGADryLinkAdapterContract[];
  channels: SCIMEGADryLinkChannel[];
  baneVerdict: BanePLVerdict;
  overallReadiness: SCIMEGADryLinkStatus;
}
