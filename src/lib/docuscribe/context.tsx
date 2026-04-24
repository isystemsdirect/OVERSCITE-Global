import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MOCK_DOCUMENTS, MOCK_TEMPLATES } from './mock-data';
import type { 
  DocuScribeDocument, 
  DocumentTemplate, 
  SectionTruthState, 
  DocumentFinding, 
  AuditEntry, 
  TrustStamp, 
  StampAuditEntry, 
  DocuScribePage,
  DocumentFormatting,
  DocuScribeDataBlock,
  DiscussionMessage,
  DocumentComment
} from './types';
import { calculateCARR, hashContent } from './types';
import { executeIntelligenceAction, type ScingAction, type ScingSuggestion } from './ScingIntelligenceService';
import { createSecureLink } from './DistributionService';

interface DocuScribeContextType {
  documents: DocuScribeDocument[];
  activeDocumentId: string | null;
  activeDocument: DocuScribeDocument | null;
  templates: DocumentTemplate[];
  setActiveDocumentId: (id: string | null) => void;
  updateDocument: (id: string, updates: Partial<DocuScribeDocument>) => void;
  deleteDocument: (id: string) => void;
  createDocument: (template: DocumentTemplate) => void;
  createSnapshot: (note?: string) => void;
  updatePageContent: (pageId: string, content: string) => void;
  updatePageSection: (pageId: string, updates: any, sectionId?: string) => void; 
  addPage: (content?: string) => void;
  logAuditEntry: (action: string, details?: string, docId?: string) => void;
  addFinding: (docId: string, finding: Omit<DocumentFinding, 'id'>) => void;
  removeFinding: (docId: string, findingId: string) => void;
  issueStamp: (document: DocuScribeDocument) => void;
  verifyDocument: (docId: string) => void;
  executeScingAction: (action: ScingAction, text: string) => Promise<ScingSuggestion>;
  confirmSuggestion: (pageId: string, suggestion: ScingSuggestion) => void;
  updateFormatting: (formatting: Partial<DocumentFormatting>) => void;
  createShareLink: (type: 'live' | 'snapshot', snapshotId?: string, expiryDays?: number) => void;
  revokeShareLink: (linkId: string) => void;
  sendDocumentEmail: (recipient: string, subject: string, body: string) => void;
  insertDataBlock: (type: any, pageId?: string) => void;
  refreshDataBlock: (pageId: string, blockId: string) => void;
  captureBlockSnapshot: (pageId: string, blockId: string) => void;
  postDiscussionMessage: (message: string) => void;
  addComment: (text: string, pageId?: string) => void;
}

const DocuScribeContext = createContext<DocuScribeContextType | undefined>(undefined);

export const DocuScribeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocuScribeDocument[]>(MOCK_DOCUMENTS);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(MOCK_DOCUMENTS[0].document_id);
  const [templates] = useState<DocumentTemplate[]>(MOCK_TEMPLATES);

  const activeDocument = documents.find(d => d.document_id === activeDocumentId) || null;

  const updateDocument = useCallback((id: string, updates: Partial<DocuScribeDocument>) => {
    setDocuments(prev => prev.map(doc => 
      doc.document_id === id ? { ...doc, ...updates, updated_at: new Date().toISOString() } : doc
    ));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.document_id !== id));
    if (activeDocumentId === id) setActiveDocumentId(null);
  }, [activeDocumentId]);

  const updatePageContent = useCallback((pageId: string, content: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        pages: doc.pages.map(p => p.page_id === pageId ? { ...p, content } : p),
        updated_at: new Date().toISOString()
      };
    }));
  }, [activeDocumentId]);

  const updatePageSection = useCallback((pageId: string, updates: any, sectionId?: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        pages: doc.pages.map(p => p.page_id === pageId ? { ...p, ...updates } : p),
        updated_at: new Date().toISOString()
      };
    }));
  }, [activeDocumentId]);

  const addPage = useCallback((content: string = '<p><br></p>') => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      const newPage: DocuScribePage = {
        page_id: `p${doc.pages.length + 1}-${doc.document_id}`,
        status: 'draft',
        blocks: {},
        content
      };
      return {
        ...doc,
        pages: [...doc.pages, newPage],
        updated_at: new Date().toISOString()
      };
    }));
  }, [activeDocumentId]);

  const logAuditEntry = useCallback((action: string, details: string = 'No additional details', docId?: string) => {
    const targetDocId = docId || activeDocumentId;
    if (!targetDocId) return;

    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== targetDocId) return doc;
      const newEntry: AuditEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action,
        actor: 'Active User',
        details
      };
      return {
        ...doc,
        audit_log: [newEntry, ...(doc.audit_log || [])]
      };
    }));
  }, [activeDocumentId]);

  const addFinding = useCallback((docId: string, finding: Omit<DocumentFinding, 'id'>) => {
    const newFinding: DocumentFinding = {
      ...finding,
      id: `find-${Date.now()}`
    };
    setDocuments(prev => prev.map(doc => 
      doc.document_id === docId 
        ? { ...doc, findings: [...(doc.findings || []), newFinding] } 
        : doc
    ));
    logAuditEntry('finding_add', `New finding added: ${finding.title}`, docId);
  }, [logAuditEntry]);

  const removeFinding = useCallback((docId: string, findingId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.document_id === docId 
        ? { ...doc, findings: (doc.findings || []).filter(f => f.id !== findingId) } 
        : doc
    ));
    logAuditEntry('finding_remove', `Finding removed: ${findingId}`, docId);
  }, [logAuditEntry]);

  const issueStamp = useCallback(async (document: DocuScribeDocument) => {
    const carrScore = calculateCARR(document.findings || []);
    const docHash = await hashContent(document.pages.map(p => p.content).join(''));
    
    const stamp: TrustStamp = {
      stamp_id: `stamp-${Date.now()}`,
      issued_by: 'Active User',
      issued_at: new Date().toISOString(),
      document_id: document.document_id,
      document_version: document.version,
      document_sub_version: document.sub_version,
      carr_score: carrScore,
      approval_chain: ['Active User'],
      content_hash: docHash,
      is_valid: true
    };

    setDocuments(prev => prev.map(doc => 
      doc.document_id === document.document_id ? { ...doc, trust_stamp: stamp, is_verified: true, status: 'approved' } : doc
    ));
    logAuditEntry('trust_stamp_apply', 'Trust stamp issued and applied to document baseline', document.document_id);
  }, [logAuditEntry]);

  const verifyDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.document_id === docId ? { ...doc, is_verified: true, status: 'approved' } : doc
    ));
    logAuditEntry('document_verified', 'Document manually marked as verified', docId);
  }, [logAuditEntry]);

  const executeScingAction = useCallback(async (action: ScingAction, text: string) => {
    const suggestion = await executeIntelligenceAction(action, text);
    if (activeDocumentId) {
      logAuditEntry('intelligence_action', `Applied ${action} to content selection`);
    }
    return suggestion;
  }, [activeDocumentId, logAuditEntry]);

  const confirmSuggestion = useCallback((pageId: string, suggestion: ScingSuggestion) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        pages: doc.pages.map(p => p.page_id === pageId ? { ...p, content: p.content + suggestion.proposed } : p),
        updated_at: new Date().toISOString()
      };
    }));
  }, [activeDocumentId]);

  const updateFormatting = useCallback((formatting: Partial<DocumentFormatting>) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { ...doc, formatting: { ...doc.formatting, ...formatting }, updated_at: new Date().toISOString() } 
        : doc
    ));
  }, [activeDocumentId]);

  const createShareLink = useCallback((type: 'live' | 'snapshot', snapshotId?: string, expiryDays?: number) => {
    if (!activeDocumentId) return;
    const newLink = createSecureLink(activeDocumentId, { type, snapshotId, expiryDays });
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        distribution: {
          ...doc.distribution,
          links: [...(doc.distribution.links || []), newLink]
        }
      };
    }));
    logAuditEntry('share_link_created', `Secure sharing link generated (${type})`);
  }, [activeDocumentId, logAuditEntry]);

  const revokeShareLink = useCallback((linkId: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        distribution: {
          ...doc.distribution,
          links: (doc.distribution.links || []).map(l => l.id === linkId ? { ...l, revoked: true } : l)
        }
      };
    }));
    logAuditEntry('share_link_revoked', `Revoked distribution link: ${linkId}`);
  }, [activeDocumentId, logAuditEntry]);

  const sendDocumentEmail = useCallback((recipient: string, subject: string, body: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      const historyEntry = {
        recipient,
        timestamp: new Date().toISOString(),
        subject
      };
      return {
        ...doc,
        distribution: {
          ...doc.distribution,
          outbound_history: [...(doc.distribution.outbound_history || []), historyEntry]
        }
      };
    }));
    logAuditEntry('outbound_distribution', `Document data routed to ${recipient}`);
  }, [activeDocumentId, logAuditEntry]);

  const insertDataBlock = useCallback((type: any, pageId?: string) => {
    if (!activeDocumentId || !activeDocument) return;
    const targetPageId = pageId || (activeDocument.pages.length > 0 ? activeDocument.pages[0].page_id : '');
    if (!targetPageId) return;

    const blockId = `block-${Date.now()}`;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      return {
        ...doc,
        pages: doc.pages.map(p => p.page_id === targetPageId ? { 
          ...p, 
          blocks: { ...p.blocks, [blockId]: { block_id: blockId, type, mode: 'live', source: 'auto', timestamp: new Date().toISOString(), data: {} } } 
        } : p),
        updated_at: new Date().toISOString()
      };
    }));
    logAuditEntry('data_block_inserted', `Inserted ${type} block on page ${targetPageId}`);
  }, [activeDocumentId, activeDocument, logAuditEntry]);

  const refreshDataBlock = useCallback((pageId: string, blockId: string) => {
    if (!activeDocumentId) return;
    logAuditEntry('data_block_refreshed', `Refreshed block ${blockId}`);
  }, [activeDocumentId, logAuditEntry]);

  const captureBlockSnapshot = useCallback((pageId: string, blockId: string) => {
    if (!activeDocumentId) return;
    logAuditEntry('data_block_snapshot', `Captured snapshot for block ${blockId}`);
  }, [activeDocumentId, logAuditEntry]);

  const postDiscussionMessage = useCallback((message: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      const newMessage: DiscussionMessage = {
        id: `msg-${Date.now()}`,
        author: 'Active User',
        timestamp: new Date().toISOString(),
        text: message
      };
      return {
        ...doc,
        discussion_thread: [...(doc.discussion_thread || []), newMessage]
      };
    }));
  }, [activeDocumentId]);

  const addComment = useCallback((text: string, pageId?: string) => {
    if (!activeDocumentId || !activeDocument) return;
    const targetPageId = pageId || (activeDocument.pages.length > 0 ? activeDocument.pages[0].page_id : '');
    if (!targetPageId) return;

    setDocuments(prev => prev.map(doc => {
      if (doc.document_id !== activeDocumentId) return doc;
      const newComment: DocumentComment = {
        id: `com-${Date.now()}`,
        page_id: targetPageId,
        author: 'Active User',
        timestamp: new Date().toISOString(),
        text,
        resolved: false
      };
      return {
        ...doc,
        comments: [...(doc.comments || []), newComment]
      };
    }));
    logAuditEntry('comment_added', `Comment added to page ${targetPageId}`);
  }, [activeDocumentId, activeDocument, logAuditEntry]);

  const createSnapshot = useCallback((note?: string) => {
    if (!activeDocumentId || !activeDocument) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            history: [
              {
                version_id: `v${doc.version}.${doc.history.length + 1}`,
                author: 'Active User',
                timestamp: new Date().toISOString(),
                pages: JSON.parse(JSON.stringify(doc.pages)),
                note
              },
              ...doc.history
            ]
          } 
        : doc
    ));
    logAuditEntry('snapshot_created', note || 'Manual version snapshot captured');
  }, [activeDocumentId, activeDocument, logAuditEntry]);

  const createDocument = useCallback((template: DocumentTemplate) => {
    const docId = `doc-${Date.now()}`;
    const newDoc: DocuScribeDocument = {
      document_id: docId,
      title: `New ${template.name}`,
      status: 'draft',
      authority_class: template.authority_class,
      is_verified: false,
      version: 1,
      sub_version: 0,
      lineage_parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_id: template.id,
      method_id: template.method_binding?.methodId || 'general-property',
      method_version: '1.0.0',
      active_phase_id: 'intake',
      content: '', 
      pages: [
        { 
          page_id: `p1-${docId}`,
          status: 'draft',
          blocks: {},
          content: template.default_content
        }
      ],
      formatting: {
        pageSize: 'Letter',
        margins: { top: 1, bottom: 1, left: 1, right: 1 },
        lineSpacing: 1.5,
        fontFamily: 'Inter',
      },
      trust_stamp: null,
      findings: [],
      history: [],
      comments: [],
      audit_log: [{
        id: `audit-init-${docId}`,
        timestamp: new Date().toISOString(),
        action: 'document_created',
        actor: 'Active User',
        details: `Document spawned from template: ${template.name}`
      }],
      distribution: { links: [], outbound_history: [] },
      discussion_thread: []
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.document_id);
    logAuditEntry('document_created', `Document spawned from template: ${template.name}`, docId);
  }, [logAuditEntry]);

  return (
    <DocuScribeContext.Provider value={{
      documents, activeDocumentId, activeDocument, templates,
      setActiveDocumentId, updateDocument, deleteDocument, createDocument,
      createSnapshot, updatePageContent, updatePageSection, addPage, logAuditEntry, addFinding, removeFinding,
      issueStamp, verifyDocument, executeScingAction, confirmSuggestion, updateFormatting,
      createShareLink, revokeShareLink, sendDocumentEmail,
      insertDataBlock, refreshDataBlock, captureBlockSnapshot, postDiscussionMessage, addComment
    }}>
      {children}
    </DocuScribeContext.Provider>
  );
};

export const useDocuScribe = () => {
  const context = useContext(DocuScribeContext);
  if (context === undefined) throw new Error('useDocuScribe must be used within a DocuScribeProvider');
  return context;
};
