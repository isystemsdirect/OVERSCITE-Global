/**
 * DocuSCRIBE™ — Mock Data for Phase 2 Development
 *
 * @classification MOCK_DATA
 * @authority DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Provides seed documents, templates, findings, stamps, and audit entries
 * for local development. These are NOT production data.
 */

import type {
  DocuScribeDocument,
  DocumentTemplate,
  DocumentFinding,
  TrustStamp,
  StampAuditEntry,
} from './types';

// ─── Mock Documents ──────────────────────────────────────────────────

export const MOCK_DOCUMENTS: DocuScribeDocument[] = [
  {
    document_id: 'doc-001',
    title: 'Site Assessment — North Tower Foundation',
    status: 'draft',
    authority_class: 'draft_editable',
    is_verified: false,
    version: 1,
    sub_version: 0,
    lineage_parent_id: null,
    created_at: '2026-04-15T09:00:00Z',
    updated_at: '2026-04-18T14:30:00Z',
    template_id: 'tpl-inspection',
    method_id: 'general-property',
    method_version: '1.0.0',
    active_phase_id: 'capture',
    content: '', // Deprecated in favor of pages
    pages: [
      {
        page_id: 'p1-doc-001',
        status: 'draft',
        blocks: {},
        content: `<h1>Site Assessment — North Tower Foundation</h1>
<p><strong>Location</strong><br>Building Complex North — Grid Reference NT-04</p>
<p><strong>Scope</strong><br>Initial visual and structural assessment of foundation elements prior to steel erection phase.</p>
<p><strong>Intelligence Bridge</strong><br>Integrated NOAA Environmental Intelligence for Site NT-04.</p>
<div data-docuscribe-block="weather" data-block-id="block-init-001"></div>
<h2>Observations</h2>
<ul>
  <li>Concrete curing appears complete on all primary pads</li>
  <li>Anchor bolt alignment within specification (±3mm)</li>
  <li>Surface drainage grade requires secondary verification</li>
  <li>Waterproofing membrane integrity unconfirmed at southeast corner</li>
</ul>`,
      },
      {
        page_id: 'p2-doc-001',
        status: 'draft',
        blocks: {},
        content: `<h2>Preliminary Findings</h2>
<p>Foundation elements appear ready for Phase 2 loading. However, the southeast corner membrane condition warrants follow-up inspection before proceeding.</p>
<h2>Action Items</h2>
<ol>
  <li>Schedule follow-up membrane inspection (Priority: High)</li>
  <li>Confirm compressive strength test results from lab</li>
  <li>Coordinate with structural engineer for load path verification</li>
</ol>`,
      }
    ],
    formatting: {
      pageSize: 'Letter',
      margins: { top: 1, bottom: 1, left: 1, right: 1 },
      lineSpacing: 1.5,
      fontFamily: 'Inter',
    },
    history: [],
    comments: [],
    audit_log: [],
    trust_stamp: null,
    findings: [
      { id: 'find-001a', title: 'Concrete Curing Complete', severity: 'None', description: 'All primary pad concrete curing appears complete on visual inspection.', confidence: 'high', category: 'Structural' },
      { id: 'find-001b', title: 'Anchor Bolt Alignment', severity: 'None', description: 'Anchor bolt alignment measured within ±3mm specification tolerance.', confidence: 'high', category: 'Structural' },
      { id: 'find-001c', title: 'Surface Drainage Grade', severity: 'Minor', description: 'Surface drainage grade requires secondary verification — initial readings inconclusive.', confidence: 'low', category: 'Site Conditions' },
      { id: 'find-001d', title: 'Waterproofing Membrane — SE Corner', severity: 'Major', description: 'Membrane integrity at southeast corner unconfirmed. Follow-up required.', confidence: 'inconclusive', category: 'Waterproofing' }
    ],
    distribution: { links: [], outbound_history: [] },
    discussion_thread: [],
  },
  {
    document_id: 'doc-002',
    title: 'Equipment Compliance Log — Crane Operations',
    status: 'approved',
    authority_class: 'immutable_view_only',
    is_verified: true,
    version: 2,
    sub_version: 1,
    lineage_parent_id: null,
    created_at: '2026-03-20T08:00:00Z',
    updated_at: '2026-04-10T16:45:00Z',
    method_id: 'general-property',
    method_version: '1.0.0',
    content: '',
    pages: [
      {
        page_id: 'p1-doc-002',
        status: 'locked',
        blocks: {},
        content: `<h1>Equipment Compliance Log — Crane Operations</h1>
<p><strong>Equipment ID</strong><br>CRANE-LB-4400-07</p>
<p><strong>Certification Status</strong><br>All certifications current as of 2026-04-10.</p>
<h2>Last Inspection</h2>
<p>2026-04-10 — Full operational inspection completed.<br>Inspector: J. Martinez (Cert #CM-4821)</p>
<h2>Load Test Results</h2>
<p>Maximum rated capacity: 440 tons<br>Test load applied: 484 tons (110%)<br>Duration: 10 minutes<br>Result: <strong>PASS</strong> — No structural anomalies detected</p>`,
      }
    ],
    formatting: {
      pageSize: 'Letter',
      margins: { top: 1, bottom: 1, left: 1, right: 1 },
      lineSpacing: 1.5,
      fontFamily: 'Inter',
    },
    history: [],
    comments: [],
    audit_log: [],
    template_id: null,
    trust_stamp: null,
    findings: [],
    distribution: { links: [], outbound_history: [] },
    discussion_thread: [],
  },
  {
    document_id: 'doc-003',
    title: 'Site Safety Audit',
    status: 'draft',
    authority_class: 'draft_editable',
    is_verified: false,
    version: 1,
    sub_version: 0,
    lineage_parent_id: null,
    created_at: '2026-04-18T10:00:00Z',
    updated_at: '2026-04-18T10:00:00Z',
    template_id: 'tpl-field-log',
    method_id: 'environment-safety',
    method_version: '1.0.0',
    content: '',
    pages: [
      {
        page_id: 'p1-doc-003',
        status: 'reviewed',
        blocks: {},
        content: `<h1>Site Safety Audit</h1><p>Initial audit findings suggest all safety protocols are being followed.</p>`,
      }
    ],
    formatting: {
      pageSize: 'Letter',
      margins: { top: 1, bottom: 1, left: 1, right: 1 },
      lineSpacing: 1.5,
      fontFamily: 'Inter',
    },
    history: [],
    comments: [],
    audit_log: [],
    trust_stamp: null,
    findings: [],
    distribution: { links: [], outbound_history: [] },
    discussion_thread: [],
  },
  {
    document_id: 'doc-004',
    title: 'Material Inventory',
    status: 'draft',
    authority_class: 'draft_editable',
    is_verified: false,
    version: 1,
    sub_version: 0,
    lineage_parent_id: null,
    created_at: '2026-04-18T11:00:00Z',
    updated_at: '2026-04-18T11:00:00Z',
    method_id: 'general-property',
    method_version: '1.0.0',
    content: '',
    pages: [
      {
        page_id: 'p1-doc-004',
        status: 'draft',
        blocks: {},
        content: `<h1>Material Inventory</h1><p>Current inventory status is up to date.</p>`,
      }
    ],
    formatting: {
      pageSize: 'Letter',
      margins: { top: 1, bottom: 1, left: 1, right: 1 },
      lineSpacing: 1.5,
      fontFamily: 'Inter',
    },
    history: [],
    comments: [],
    audit_log: [],
    template_id: null,
    trust_stamp: null,
    findings: [],
    distribution: { links: [], outbound_history: [] },
    discussion_thread: [],
  },
];

// ─── Mock Audit Log Entries ─────────────────────────────────────────

export const MOCK_AUDIT_LOG: StampAuditEntry[] = [];

// ─── Mock Templates ─────────────────────────────────────────────────

export const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl-blank',
    name: 'Blank Document',
    description: 'Start with an empty document. No predefined structure.',
    default_content: '',
    authority_class: 'draft_editable',
  },
  {
    id: 'tpl-inspection',
    name: 'Inspection Report',
    description: 'Standard inspection observation report with structured sections.',
    default_content: `<h1>Inspection Report</h1>
<h2>Location</h2>
<p>&nbsp;</p>
<h2>Date</h2>
<p>&nbsp;</p>
<h2>Inspector</h2>
<p>&nbsp;</p>
<h2>Scope of Inspection</h2>
<p>&nbsp;</p>
<h2>Observations</h2>
<p>&nbsp;</p>
<h2>Findings</h2>
<p>&nbsp;</p>
<h2>Recommendations</h2>
<p>&nbsp;</p>
<h2>Action Items</h2>
<p>&nbsp;</p>`,
    authority_class: 'draft_editable',
    method_binding: {
      methodId: 'general-property',
      requiredSections: ['disclosures', 'observations'],
      protectedSections: ['disclosures']
    }
  },
  {
    id: 'tpl-field-log',
    name: 'Field Log',
    description: 'Daily field activity and observation log.',
    default_content: `# Field Log

## Date


## Weather Conditions


## Personnel On-Site


## Work Performed


## Materials Received


## Issues / Delays


## Safety Observations


## Notes
`,
    authority_class: 'draft_editable',
    method_binding: {
      methodId: 'general-property',
      requiredSections: ['personnel', 'work-performed'],
      protectedSections: []
    }
  },
  {
    id: 'tpl-compliance-memo',
    name: 'Compliance Memo',
    description: 'Internal compliance communication or advisory document.',
    default_content: `# Compliance Memo

## To


## From


## Date


## Subject


## Reference Standards


## Summary


## Required Actions


## Deadline

`,
    authority_class: 'draft_editable',
  },
];
