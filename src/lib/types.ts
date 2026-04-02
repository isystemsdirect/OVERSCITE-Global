import { FieldValue } from 'firebase/firestore';
import { PIP_Metadata } from './types/property-intelligence';

import { TruthState } from './constants/truth-states';
export type { TruthState };

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface Inspection {
  id: string;
  address: string;
  inspector: string;
  status: TruthState;
  date: Date;
  pipMetadata?: PIP_Metadata;
  // Legacy fields support
  title?: string;
  propertyAddress?: string;
  inspectorId?: string;
  inspectorName?: string;
  findingsCount?: number;
  executiveSummary?: string;
  findings?: Finding[];
  deviceKeysUsed?: string[];
}

export interface InspectionAsset {
  inspectionId: string;
  assetId: string;
  type: 'image' | 'video' | 'document';
  imageUrl: string;
  storagePath: string;
  createdAt: FieldValue;
  captureMode: 'live_capture' | 'file_upload';
  originalFileName?: string;
  contentType?: string;
  sizeBytes?: number;
}

export interface Finding {
  id?: string;
  label?: string; // AI generated label
  type?: string; // Legacy type field
  /** @deprecated Use observedCondition, systemIdentification, and recommendation layers */
  description: string;
  observedCondition: string; // Layer 1: Deterministic Capture
  systemIdentification: string; // Layer 2: Probabilistic Identification
  recommendation: string; // Layer 3: Human Authority
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'Low' | 'Medium' | 'High';
  createdAt: FieldValue;
  sourceAssetId: string;
  mediaRefs?: string[];
  engine: 'LARI-VISION' | string;
  modelVersion?: string;
  evidence?: any[];
  codeReferences?: any[];
  inspectorNote?: string;
}

export interface ReportNote {
  noteId: string;
  inspectionId: string;
  insertedByUserId: string;
  insertedAt: FieldValue;
  sourceFindingId: string;
  sourceAssetId: string;
  content: {
    label: string;
    description: string;
  };
}

export interface LibraryDocument {
  id: string;
  title: string;
  category: string;
  document_type: string;
  status: TruthState;
  storage_path_or_url: string;
  created_at: FieldValue | string;
  updated_at: FieldValue | string;
  created_by: string;
}

export interface CalendarBooking {
  id: string;
  title: string;
  start_at: FieldValue | string;
  end_at: FieldValue | string;
  status: TruthState | 'cancelled' | 'tentative' | 'confirmed';
  location: string;
  linked_entity_type: 'inspection' | 'meeting' | 'operational_block';
  linked_entity_id: string;
  created_by: string;
}

export interface FinanceInvoice {
  id: string;
  invoice_number: string;
  status: TruthState | 'paid' | 'overdue' | 'void' | 'issued' | 'draft';
  amount: number;
  currency: string;
  issued_at: FieldValue | string;
  due_at: FieldValue | string;
  download_url_if_real?: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  sent_at: string;
  attachments?: string[];
}

export interface MessagingThread {
  id: string;
  title: string;
  last_message_preview: string;
  last_activity_at: string;
  participants: string[];
  status: 'active' | 'archived' | 'pinned';
  unread_count: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
  signature: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface FiscalLimit {
  category: string;
  threshold: number;
  spent: number;
  currency: string;
}

export interface Capability {
  id: string;
  name: string;
  status: TruthState;
  provider: string;
  lari_key_required: boolean;
  category: string;
  description: string;
}

export interface Inspector {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  imageHint?: string;
  onCall?: boolean;
  rating?: number;
  reviews?: number;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  bio?: string;
  status?: string;
  certifications: {
    id: string;
    name: string;
    verified: boolean;
    expiresAt: string;
  }[];
  offeredServices: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  __canonical?: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSeen: string;
  firmwareVersion: string;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  pricePeriod: string;
  features: string[];
  cta: string;
  isCurrent: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  status: TruthState;
}

export interface ConferenceRoom {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Job {
  id: string;
  title: string;
  type?: string;
  address?: string;
  client_id: string;
  status: TruthState;
  assigned_to?: string;
}

export interface Notification {
  id: string;
  type: 'post' | 'topic' | 'safety' | 'traffic' | 'weather_news' | string;
  title: string;
  description: string;
  timestamp: string;
}

export interface MarketplaceIntegration {
  id: string;
  name: string;
  provider: string;
  status: TruthState;
}

export interface MarketplaceService {
  id: string;
  name: string;
  description: string;
  category: string;
  status: TruthState;
  provider: string;
  lari_key_required: boolean;
}

// ---------------------------------------------------------------------------
// Deterministic Pipeline Types
// ---------------------------------------------------------------------------

export type PipelineStatus = 'idle' | 'capturing' | 'analyzing' | 'evaluating' | 'finalizing' | 'completed' | 'failed';

export interface FieldCaptureObject {
  captureId: string;
  inspectionId: string;
  assetId: string;
  type: string;
  timestamp: string;
  coordinates?: { lat: number; lng: number };
  raw_data_ref: string;
}

export interface AnalyticalResultObject {
  analyticalId: string;
  captureId: string;
  engine: string;
  confidence: number;
  verdict: string;
  observations: string[];
  timestamp: string;
}

export interface MeasurementResultObject {
  measurementId: string;
  captureId: string;
  value: number;
  unit: string;
  tolerance: number;
  isWithinSpec: boolean;
  timestamp: string;
}

export interface ComplianceEvaluationObject {
  evaluationId: string;
  inspectionId: string;
  policyId: string;
  result: 'pass' | 'fail' | 'conditional';
  reasoning: string;
  timestamp: string;
}

export interface AdvisoryBlock {
  id: string;
  type: 'regulatory' | 'safety' | 'operational';
  severity: Impact_Level;
  content: string;
  action_required: boolean;
}

import { Impact_Level } from './types/property-intelligence';
