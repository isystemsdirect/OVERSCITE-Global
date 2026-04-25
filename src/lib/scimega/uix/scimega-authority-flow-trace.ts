"use client";

/**
 * SCIMEGA™ Authority Flow Trace Model
 * Defines the schema for tracking authority transitions and preemptions.
 */

export type SCIMEGAAuthorityClass = 
  | 'pilot_interrupt' 
  | 'teon_preemption' 
  | 'bane_hold' 
  | 'scing_autonomy_request' 
  | 'anchor_hold_entry' 
  | 'manual_confirmation' 
  | 'security_override';

export type SCIMEGAAuthorityLevel = 
  | 'TEON_SAFETY' 
  | 'PILOT_CONTROL' 
  | 'BANE_GOVERNANCE' 
  | 'SCING_BFI' 
  | 'ARC_IDENTITY';

export interface SCIMEGAAuthorityTransition {
  timestamp: string;
  class: SCIMEGAAuthorityClass;
  priorAuthority: SCIMEGAAuthorityLevel;
  newAuthority: SCIMEGAAuthorityLevel;
  preemptionSource: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction?: string;
}

export interface SCIMEGAAuthorityFlowEvent {
  id: string;
  transition: SCIMEGAAuthorityTransition;
}
