/**
 * CLIENT INTELLIGENCE CANONICAL TYPES
 * Governed by L-UTCB-S__20260420-000000Z
 */

export enum EECIP_Status {
  NOT_CONNECTED = 'NOT_CONNECTED',
  AVAILABLE = 'AVAILABLE',
  DEFERRED = 'DEFERRED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PARTIALLY_INGESTED = 'PARTIALLY_INGESTED',
  FULLY_INGESTED = 'FULLY_INGESTED',
  OUTDATED = 'OUTDATED',
  USER_DECLINED = 'USER_DECLINED',
  SOURCE_UNAVAILABLE = 'SOURCE_UNAVAILABLE',
}

export interface CIP_Metadata {
  cip_id: string;
  cip_version: string; // v[x].[x]
  eecip_status: EECIP_Status;
  profileType: 'CIP';
  truthClass: 'accepted_baseline';
  last_eecip_fetch_at?: string;
  last_eecip_accepted_at?: string;
  last_verified_at?: string;
  material_change_flag: boolean;
}

export interface EECIP_Metadata {
  eecip_id: string;
  eecip_version: string; // v[x].[x]
  profileType: 'EECIP';
  truthClass: 'external_enhancement_candidate';
  sources: string[];
  retrieved_at: string;
}

export interface Client_Intelligence_Bundle {
  cip: CIP_Metadata;
  eecip_candidate?: EECIP_Metadata;
}
