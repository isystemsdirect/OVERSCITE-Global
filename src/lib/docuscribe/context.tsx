/**
 * DocuSCRIBE™ — Workspace Context
 * 
 * Provides shared state for documents, selection, and authority enforcement
 * across the layout sidebar and functional routes.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MOCK_DOCUMENTS, MOCK_TEMPLATES } from './mock-data';
import type { DocuScribeDocument, DocumentTemplate, SectionTruthState } from './types';
import { calculateCARR, hashContent } from './types';
import { executeIntelligenceAction, type ScingAction, type ScingSuggestion } from './ScingIntelligenceService';
import { createSecureLink } from './DistributionService';

interface DocuScribeContextType {
  documents: DocuScribeDocument[];
  activeDocument: DocuScribeDocument | null;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  updatePageContent: (pageId: string, content: string) => void;
  updatePageSection: (pageId: string, payload: { header?: string; footer?: string; status?: SectionTruthState }) => void;
  updateFormatting: (formatting: Partial<DocuScribeDocument['formatting']>) => void;
  addPage: (initialContent?: string) => void;
  removePage: (pageId: string) => void;
  createDocument: (template: DocumentTemplate) => void;
  issueStamp: (doc: DocuScribeDocument) => Promise<void>;
  addComment: (text: string, pageId?: string) => void;
  createSnapshot: (note?: string) => void;
  logAuditEntry: (docId: string, action: string, details: string) => void;
  executeScingAction: (action: ScingAction, text: string) => Promise<ScingSuggestion>;
  confirmSuggestion: (pageId: string, suggestion: ScingSuggestion) => void;
  insertDataBlock: (pageId: string, type: any) => void;
  refreshDataBlock: (pageId: string, blockId: string) => void;
  captureBlockSnapshot: (pageId: string, blockId: string) => void;
  createShareLink: (type: 'live' | 'snapshot', snapshotId?: string, expiryDays?: number) => string;
  revokeShareLink: (linkId: string) => void;
  sendDocumentEmail: (recipient: string, subject: string, body: string) => void;
  postDiscussionMessage: (text: string, blockId?: string, pageId?: string) => void;
  templates: DocumentTemplate[];
}

const DocuScribeContext = createContext<DocuScribeContextType | undefined>(undefined);

/**
 * Migration Bridge: Elevates legacy v1 docs (content) to v2 schema (pages).
 */
function migrateDocument(doc: DocuScribeDocument): DocuScribeDocument {
  // If pages exist, it's already migrated (or v2 native)
  if (doc.pages && doc.pages.length > 0) return doc;

  // Fallback to legacy content migration
  return {
    ...doc,
    pages: (doc.pages && doc.pages.length > 0) ? doc.pages.map(p => ({
      ...p,
      status: p.status || 'draft'
    })) : [
      {
        page_id: `page-migrated-${doc.document_id}`,
        content: doc.content || '<p><br></p>',
        status: 'draft',
        blocks: {}
      }
    ],
    // Ensure formatting exists
    formatting: doc.formatting || {
      pageSize: 'Letter',
      margins: { top: 1, bottom: 1, left: 1, right: 1 },
      lineSpacing: 1.5,
      fontFamily: 'Inter',
    },
    // Initialize Phase 3 fields if missing
    history: doc.history || [],
    comments: doc.comments || [],
    audit_log: doc.audit_log || [
      {
        id: `audit-init-${doc.document_id}`,
        timestamp: new Date().toISOString(),
        action: 'document_initialized',
        actor: 'System',
        details: 'Document migrated to Phase 3 Intelligence Schema'
      }
    ],
    distribution: doc.distribution || { links: [], outbound_history: [] },
    discussion_thread: doc.discussion_thread || []
  };
}

export function DocuScribeProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocuScribeDocument[]>(() => 
    MOCK_DOCUMENTS.map(migrateDocument)
  );
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
    MOCK_DOCUMENTS[0]?.document_id ?? null
  );

  const activeDocument = documents.find(d => d.document_id === activeDocumentId) ?? null;

  // Internal Audit Helper
  const logAuditEntry = useCallback((docId: string, action: string, details: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.document_id === docId 
        ? { 
            ...doc, 
            audit_log: [
              {
                id: `audit-${Date.now()}`,
                timestamp: new Date().toISOString(),
                action,
                actor: 'Active User',
                details
              },
              ...doc.audit_log
            ].slice(0, 50) // Keep last 50
          } 
        : doc
    ));
  }, []);

  const updatePageContent = useCallback((pageId: string, content: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => p.page_id === pageId ? { ...p, content } : p),
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));
  }, [activeDocumentId]);

  const updatePageSection = useCallback((pageId: string, payload: { header?: string; footer?: string; status?: SectionTruthState }) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => 
              p.page_id === pageId 
                ? { 
                    ...p, 
                    header_override: payload.header !== undefined ? payload.header : p.header_override,
                    footer_override: payload.footer !== undefined ? payload.footer : p.footer_override,
                    status: payload.status !== undefined ? payload.status : p.status
                  } 
                : p
            ),
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));

    if (payload.status) {
      logAuditEntry(activeDocumentId, 'page_status_change', `Page ${pageId} status set to ${payload.status}`);
      
      // Phase 5: Auto-capture snapshots on status transition to Reviewed or Locked
      if (payload.status === 'reviewed' || payload.status === 'locked') {
        setDocuments(prev => prev.map(doc => 
          doc.document_id === activeDocumentId 
            ? { 
                ...doc, 
                pages: doc.pages.map(p => 
                  p.page_id === pageId 
                    ? { 
                        ...p, 
                        blocks: Object.fromEntries(
                          Object.entries(p.blocks || {}).map(([id, block]) => [
                            id, 
                            { ...block, mode: 'snapshot', timestamp: new Date().toISOString() }
                          ])
                        )
                      } 
                    : p
                ) 
              } 
            : doc
        ));
        logAuditEntry(activeDocumentId, 'data_block_freeze', `All data blocks on page ${pageId} captured as snapshots due to ${payload.status} transition`);
      }
    }
  }, [activeDocumentId, logAuditEntry]);

  const updateFormatting = useCallback((newFormatting: Partial<DocuScribeDocument['formatting']>) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            formatting: { ...doc.formatting, ...newFormatting },
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'formatting_update', 'Document-wide formatting modified');
  }, [activeDocumentId, logAuditEntry]);

  const executeScingAction = useCallback(async (action: ScingAction, text: string) => {
    if (!activeDocumentId) throw new Error('No active document');
    
    logAuditEntry(activeDocumentId, 'scing_action_request', `Scing Intelligence requested: ${action}`);
    const suggestion = await executeIntelligenceAction(action, text);
    return suggestion;
  }, [activeDocumentId, logAuditEntry]);

  const confirmSuggestion = useCallback((pageId: string, suggestion: ScingSuggestion) => {
    if (!activeDocumentId || !activeDocument) return;

    // Use a regular regex or simple string replacement for the commit
    // In a real app we'd use a more sophisticated diff/merge but here we assume 
    // the suggestion replaces the specific original selection.
    // For simplicity in this demo, if the suggestion is for a full section, 
    // we'll update the page content.
    
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => 
              p.page_id === pageId 
                ? { ...p, content: p.content.replace(suggestion.original, suggestion.proposed) } 
                : p
            ),
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));

    logAuditEntry(activeDocumentId, 'scing_action_commit', `Scing-Assisted transformation committed to page ${pageId}`);
  }, [activeDocumentId, activeDocument, logAuditEntry]);

  const addPage = useCallback((initialContent?: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: [...doc.pages, { 
              page_id: `page-${Date.now()}`, 
              content: initialContent || '<p><br></p>',
              status: 'draft',
              blocks: {}
            }],
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'page_add', initialContent ? 'New page spawned via overflow' : 'New discrete page appended');
  }, [activeDocumentId, logAuditEntry]);

  const removePage = useCallback((pageId: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId && doc.pages.length > 1
        ? { 
            ...doc, 
            pages: doc.pages.filter(p => p.page_id !== pageId),
            updated_at: new Date().toISOString() 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'page_remove', `Page ${pageId} deleted`);
  }, [activeDocumentId, logAuditEntry]);

  const addComment = useCallback((text: string, pageId?: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            comments: [
              ...doc.comments,
              {
                id: `comment-${Date.now()}`,
                page_id: pageId || 'global',
                author: 'Active User',
                text,
                timestamp: new Date().toISOString(),
                resolved: false
              }
            ]
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'comment_add', 'New review thread initiated');
  }, [activeDocumentId, logAuditEntry]);

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
                pages: JSON.parse(JSON.stringify(doc.pages)), // Deep clone
                note
              },
              ...doc.history
            ]
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'snapshot_created', note || 'Manual version snapshot captured');
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
      content: '', // Legacy
      pages: [
        { 
          page_id: 'p1-doc-004',
          status: 'draft',
          blocks: {},
          content: template.default_content || '<p><br></p>' 
        }
      ],
      formatting: {
        pageSize: 'Letter',
        margins: { top: 1, bottom: 1, left: 1, right: 1 },
        lineSpacing: 1.5,
        fontFamily: 'Inter',
      },
      template_id: template.id,
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
    logAuditEntry(docId, 'document_created', `Document spawned from template: ${template.name}`);
  }, [logAuditEntry]);

  const insertDataBlock = useCallback((pageId: string, type: any) => {
    if (!activeDocumentId) return;
    const blockId = `block-${Date.now()}`;
    const newBlock: any = {
      block_id: blockId,
      type,
      mode: 'live',
      source: type === 'weather' ? 'NOAA-Intelligence' : 'OVERSCITE-Core',
      timestamp: new Date().toISOString(),
      data: null
    };

    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => 
              p.page_id === pageId 
                ? { 
                    ...p, 
                    content: p.content + `\n<div data-docuscribe-block="${type}" data-block-id="${blockId}"></div>\n`,
                    blocks: { ...(p.blocks || {}), [blockId]: newBlock }
                  } 
                : p
            ) 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'data_block_insert', `Inserted ${type} data block into page ${pageId}`);
  }, [activeDocumentId, logAuditEntry]);

  const refreshDataBlock = useCallback((pageId: string, blockId: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => 
              p.page_id === pageId 
                ? { 
                    ...p, 
                    blocks: { 
                      ...(p.blocks || {}), 
                      [blockId]: { 
                        ...(p.blocks[blockId]), 
                        timestamp: new Date().toISOString() 
                      } 
                    } 
                  } 
                : p
            ) 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'data_block_refresh', `Refreshed live data for block ${blockId}`);
  }, [activeDocumentId, logAuditEntry]);

  const captureBlockSnapshot = useCallback((pageId: string, blockId: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            pages: doc.pages.map(p => 
              p.page_id === pageId 
                ? { 
                    ...p, 
                    blocks: { 
                      ...(p.blocks || {}), 
                      [blockId]: { 
                        ...(p.blocks[blockId]), 
                        mode: 'snapshot',
                        timestamp: new Date().toISOString() 
                      } 
                    } 
                  } 
                : p
            ) 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'data_block_snapshot', `Manual snapshot captured for block ${blockId}`);
  }, [activeDocumentId, logAuditEntry]);

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
    logAuditEntry(doc.document_id, 'stamp_issued', `Trust Stamp issued with CARR ${carrScore}`);
  }, [logAuditEntry]);

  const createShareLink = useCallback((type: 'live' | 'snapshot', snapshotId?: string, expiryDays?: number) => {
    if (!activeDocumentId || !activeDocument) return '';
    const newLink = createSecureLink(activeDocumentId, { type, snapshotId, expiryDays });
    
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            distribution: { 
              ...doc.distribution, 
              links: [newLink, ...doc.distribution.links] 
            } 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'link_created', `Secure ${type} share link generated. Expiry: ${newLink.expiry}`);
    return newLink.url;
  }, [activeDocumentId, activeDocument, logAuditEntry]);

  const revokeShareLink = useCallback((linkId: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            distribution: { 
              ...doc.distribution, 
              links: doc.distribution.links.map(l => l.id === linkId ? { ...l, revoked: true } : l) 
            } 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'link_revoked', `Secure link ${linkId} revoked and disabled`);
  }, [activeDocumentId, logAuditEntry]);

  const sendDocumentEmail = useCallback((recipient: string, subject: string, body: string) => {
    if (!activeDocumentId) return;
    // Simulate send by logging to audit and outbound history
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            distribution: { 
              ...doc.distribution, 
              outbound_history: [
                { recipient, subject, timestamp: new Date().toISOString() },
                ...doc.distribution.outbound_history
              ] 
            } 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'document_shared_email', `Document package routed to ${recipient}. Subject: ${subject}`);
  }, [activeDocumentId, logAuditEntry]);

  const postDiscussionMessage = useCallback((text: string, blockId?: string, pageId?: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(doc => 
      doc.document_id === activeDocumentId 
        ? { 
            ...doc, 
            discussion_thread: [
              ...doc.discussion_thread,
              {
                id: `msg-${Date.now()}`,
                author: 'Active User',
                text,
                timestamp: new Date().toISOString(),
                block_id: blockId,
                page_id: pageId
              }
            ] 
          } 
        : doc
    ));
    logAuditEntry(activeDocumentId, 'internal_message_posted', `New discussion item posted. Reference: ${blockId || pageId || 'Global'}`);
  }, [activeDocumentId, logAuditEntry]);

  return (
    <DocuScribeContext.Provider value={{
      documents,
      activeDocument,
      activeDocumentId,
      setActiveDocumentId,
      updatePageContent,
      updatePageSection,
      updateFormatting,
      addPage,
      removePage,
      createDocument,
      issueStamp,
      addComment,
      createSnapshot,
      logAuditEntry,
      executeScingAction,
      confirmSuggestion,
      insertDataBlock,
      refreshDataBlock,
      captureBlockSnapshot,
      createShareLink,
      revokeShareLink,
      sendDocumentEmail,
      postDiscussionMessage,
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
