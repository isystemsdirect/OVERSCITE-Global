/**
 * DocuSCRIBE™ — Workspace Context
 * 
 * Provides shared state for documents, selection, and authority enforcement
 * across the layout sidebar and functional routes.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MOCK_DOCUMENTS, MOCK_TEMPLATES } from './mock-data';
import type { DocuScribeDocument, DocumentTemplate } from './types';
import { calculateCARR, hashContent } from './types';

interface DocuScribeContextType {
  documents: DocuScribeDocument[];
  activeDocument: DocuScribeDocument | null;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  updateDocumentContent: (content: string) => void;
  createDocument: (template: DocumentTemplate) => void;
  issueStamp: (doc: DocuScribeDocument) => Promise<void>;
  templates: DocumentTemplate[];
}

const DocuScribeContext = createContext<DocuScribeContextType | undefined>(undefined);

export function DocuScribeProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocuScribeDocument[]>(MOCK_DOCUMENTS);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
    MOCK_DOCUMENTS[0]?.document_id ?? null
  );

  const activeDocument = documents.find(d => d.document_id === activeDocumentId) ?? null;

  const updateDocumentContent = useCallback((content: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { ...doc, content, updated_at: new Date().toISOString() } 
        : doc
    ));
  }, [activeDocumentId]);

  const createDocument = useCallback((template: DocumentTemplate) => {
    const newDoc: DocuScribeDocument = {
      document_id: `doc-${Date.now()}`,
      title: `New ${template.name}`,
      status: 'draft',
      authority_class: template.authority_class,
      is_verified: false,
      version: 1,
      sub_version: 0,
      lineage_parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: template.default_content,
      template_id: template.id,
      trust_stamp: null,
      findings: [],
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.document_id);
  }, []);

  const issueStamp = useCallback(async (doc: DocuScribeDocument) => {
    // Basic logic moved from page.tsx
    const carrScore = calculateCARR(doc.findings ?? []);
    const contentHash = await hashContent(doc.content);
    const stampId = `stamp-${Date.now()}`;
    const actor = 'Guest Inspector';

    const stamp = {
      stamp_id: stampId,
      issued_by: actor,
      issued_at: new Date().toISOString(),
      document_id: doc.document_id,
      document_version: doc.version,
      document_sub_version: doc.sub_version,
      carr_score: carrScore,
      approval_chain: [actor],
      content_hash: contentHash,
      is_valid: true,
    };

    setDocuments(prev => prev.map(d => 
      d.document_id === doc.document_id 
        ? { ...d, trust_stamp: stamp, updated_at: new Date().toISOString() } 
        : d
    ));
  }, []);

  return (
    <DocuScribeContext.Provider value={{
      documents,
      activeDocument,
      activeDocumentId,
      setActiveDocumentId,
      updateDocumentContent,
      createDocument,
      issueStamp,
      templates: MOCK_TEMPLATES
    }}>
      {children}
    </DocuScribeContext.Provider>
  );
}

export function useDocuScribe() {
  const context = useContext(DocuScribeContext);
  if (context === undefined) {
    throw new Error('useDocuScribe must be used within a DocuScribeProvider');
  }
  return context;
}
