/**
 * PROPERTY INTELLIGENCE CANONICAL TYPES
 * Governed by UTCB_G_Canon_Patch_V1
 */

export enum EEPIP_Status {
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

export enum Daily_Freshness_Status {
  UNCHECKED_TODAY = 'UNCHECKED_TODAY',
  NO_CHANGE = 'NO_CHANGE',
  CHANGE_AVAILABLE = 'CHANGE_AVAILABLE',
  CHECK_FAILED = 'CHECK_FAILED',
  MANUAL_REVIEW_RECOMMENDED = 'MANUAL_REVIEW_RECOMMENDED',
}

export enum Change_Type {
  NEW = 'NEW',
  MODIFIED = 'MODIFIED',
  REMOVED = 'REMOVED',
  SOURCE_METADATA_REFRESH = 'SOURCE_METADATA_REFRESH',
}

export enum Impact_Level {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL_REVIEW = 'CRITICAL_REVIEW',
}

export interface Field_Change_Record {
  section: string;
  field_path: string;
  old_value: any;
  proposed_value: any;
  change_type: Change_Type;
  source: string;
  source_timestamp: string;
  impact_level: Impact_Level;
  validation_status: 'PENDING' | 'VALIDATED' | 'FAILED';
}

export interface Delta_Packet {
  delta_packet_id: string;
  property_id: string;
  pip_version_base: number;
  proposed_eepip_version: string;
  retrieved_at: string;
  source_list: string[];
  change_count: number;
  material_change_flag: boolean;
  impact_summary: string;
  field_changes: Field_Change_Record[];
}

export interface PIP_Metadata {
  pip_id: string;
  pip_version: number;
  eepip_status: EEPIP_Status;
  last_eepip_prompted_at?: string;
  last_eepip_fetch_at?: string;
  last_eepip_accepted_at?: string;
  last_eepip_declined_at?: string;
  last_source_check_at?: string;
  last_verified_at?: string;
  daily_freshness_status: Daily_Freshness_Status;
  material_change_flag: boolean;
  current_delta_packet_id?: string;
  baseline_source_summary?: string;
}

export interface Property_Audit_Log_Entry {
  actor_type: 'USER' | 'SYSTEM';
  actor_id: string;
  decision_type: 'ACCEPT_ALL' | 'ACCEPT_SELECTED' | 'DECLINE' | 'DISMISS' | 'FETCH';
  event_timestamp: string;
  pre_version_ref?: number;
  post_version_ref?: number;
  source_hashes?: string[];
  validation_result?: string;
}
