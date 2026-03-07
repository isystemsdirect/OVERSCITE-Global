
import { FieldValue } from 'firebase/firestore';

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
  date: Date;
  status: 'pending' | 'in-progress' | 'completed';
  // Legacy fields support
  title?: string;
  propertyAddress?: any;
  inspectorId?: string;
  findingsCount?: number;
  executiveSummary?: string;
  findings?: Finding[];
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
  description: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'Low' | 'Medium' | 'High';
  createdAt: FieldValue;
  sourceAssetId: string;
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
