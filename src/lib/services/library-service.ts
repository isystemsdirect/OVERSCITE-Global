import { LibraryDocument } from '../types';

// Mock initial data seeded with standards
const SEED_DOCUMENTS: LibraryDocument[] = [
  {
    id: 'doc-001',
    title: 'International Building Code (IBC) 2021',
    category: 'Regulatory Standards',
    document_type: 'PDF',
    storage_path_or_url: '/docs/standards/ibc-2021-sample.pdf',
    status: 'live',
    created_at: new Date('2023-01-15').toISOString(),
    updated_at: new Date('2023-01-15').toISOString(),
    created_by: 'system',
  },
  {
    id: 'doc-002',
    title: 'National Electrical Code (NEC) 2023 - Quick Ref',
    category: 'Electrical Standards',
    document_type: 'PDF',
    storage_path_or_url: '/docs/standards/nec-2023-ref.pdf',
    status: 'live',
    created_at: new Date('2023-05-20').toISOString(),
    updated_at: new Date('2023-05-20').toISOString(),
    created_by: 'system',
  },
  {
    id: 'doc-003',
    title: 'SCINGULAR Field Safety Protocol V2',
    category: 'Internal Governance',
    document_type: 'PDF',
    storage_path_or_url: '/docs/internal/safety-v2.pdf',
    status: 'candidate',
    created_at: new Date('2024-03-20').toISOString(),
    updated_at: new Date('2024-03-20').toISOString(),
    created_by: 'Director Anderson',
  }
];

export async function getLibraryDocuments(): Promise<LibraryDocument[]> {
  // In a real implementation, this would fetch from Firestore
  return SEED_DOCUMENTS;
}

export async function uploadLibraryDocument(
  title: string,
  category: string,
  file: File
): Promise<LibraryDocument> {
  // Simulate upload latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newDoc: LibraryDocument = {
    id: `doc-${Math.random().toString(36).substr(2, 9)}`,
    title,
    category,
    document_type: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
    storage_path_or_url: `gs://SCINGULAR-global-library/${file.name}`,
    status: 'candidate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'Current User', // Should be from Auth context
  };

  console.log('Document uploaded to BANE-gated storage:', newDoc);
  // Log Audit Event here in real implementation
  return newDoc;
}

export async function getLibraryDocumentById(id: string): Promise<LibraryDocument | null> {
  return SEED_DOCUMENTS.find(d => d.id === id) || null;
}
