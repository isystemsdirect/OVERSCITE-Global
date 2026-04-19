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
    content: `<h1>Site Assessment — North Tower Foundation</h1>
<p><strong>Location</strong><br>Building Complex North — Grid Reference NT-04</p>
<p><strong>Scope</strong><br>Initial visual and structural assessment of foundation elements prior to steel erection phase.</p>
<h2>Observations</h2>
<ul>
  <li>Concrete curing appears complete on all primary pads</li>
  <li>Anchor bolt alignment within specification (±3mm)</li>
  <li>Surface drainage grade requires secondary verification</li>
  <li>Waterproofing membrane integrity unconfirmed at southeast corner</li>
</ul>
<h2>Preliminary Findings</h2>
<p>Foundation elements appear ready for Phase 2 loading. However, the southeast corner membrane condition warrants follow-up inspection before proceeding.</p>
<h2>Action Items</h2>
<ol>
  <li>Schedule follow-up membrane inspection (Priority: High)</li>
  <li>Confirm compressive strength test results from lab</li>
  <li>Coordinate with structural engineer for load path verification</li>
</ol>`,
    template_id: 'tpl-inspection',
    trust_stamp: null,
    findings: [
      { id: 'find-001a', title: 'Concrete Curing Complete', severity: 'None', description: 'All primary pad concrete curing appears complete on visual inspection.', confidence: 'high', category: 'Structural' },
      { id: 'find-001b', title: 'Anchor Bolt Alignment', severity: 'None', description: 'Anchor bolt alignment measured within ±3mm specification tolerance.', confidence: 'high', category: 'Structural' },
      { id: 'find-001c', title: 'Surface Drainage Grade', severity: 'Minor', description: 'Surface drainage grade requires secondary verification — initial readings inconclusive.', confidence: 'low', category: 'Site Conditions' },
      { id: 'find-001d', title: 'Waterproofing Membrane — SE Corner', severity: 'Major', description: 'Membrane integrity at southeast corner unconfirmed. Follow-up required.', confidence: 'inconclusive', category: 'Waterproofing' }
    ],
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
    content: `<h1>Equipment Compliance Log — Crane Operations</h1>
<p><strong>Equipment ID</strong><br>CRANE-LB-4400-07</p>
<p><strong>Certification Status</strong><br>All certifications current as of 2026-04-10.</p>
<h2>Last Inspection</h2>
<p>2026-04-10 — Full operational inspection completed.<br>Inspector: J. Martinez (Cert #CM-4821)</p>
<h2>Load Test Results</h2>
<ul>
  <li>Maximum rated capacity: 440 tons</li>
  <li>Test load applied: 484 tons (110%)</li>
  <li>Duration: 10 minutes</li>
  <li>Result: <strong>PASS</strong> — No structural anomalies detected</li>
</ul>
<h2>Compliance Notes</h2>
<p>This equipment meets all applicable OSHA 1926.1400 requirements and manufacturer specifications for the current project scope.</p>`,
    template_id: null,
    trust_stamp: {
      stamp_id: 'stamp-002',
      issued_by: 'J. Martinez',
      issued_at: '2026-04-10T17:00:00Z',
      document_id: 'doc-002',
      document_version: 2,
      document_sub_version: 1,
      carr_score: 0.9,
      approval_chain: ['J. Martinez', 'S. Chen'],
      content_hash: 'a3b8f2c41e9d7056a8c3b2e1f0d4c5a6b7e8f901234567890abcdef12345678',
      is_valid: true,
    },
    findings: [
      { id: 'find-002a', title: 'Certifications Current', severity: 'None', description: 'All crane certifications verified current as of inspection date.', confidence: 'high', category: 'Compliance' },
      { id: 'find-002b', title: 'Load Test Passed', severity: 'None', description: '110% load test completed successfully — no anomalies.', confidence: 'high', category: 'Structural' },
      { id: 'find-002c', title: 'OSHA 1926.1400 Compliance', severity: 'None', description: 'Equipment meets all applicable OSHA requirements.', confidence: 'high', category: 'Standards' }
    ],
  },
  {
    document_id: 'doc-003',
    title: 'Safety Incident Log — 2026-04-12',
    status: 'approved',
    authority_class: 'protected_log_view_only',
    is_verified: true,
    version: 1,
    sub_version: 0,
    lineage_parent_id: null,
    created_at: '2026-04-12T11:20:00Z',
    updated_at: '2026-04-12T17:00:00Z',
    content: `<h1>Safety Incident Log</h1>
<p><strong>Date & Time</strong><br>2026-04-12 — 10:45 AM local</p>
<p><strong>Location</strong><br>East Wing, Level 3, Section E3-B</p>
<p><strong>Classification</strong><br>Near-miss — No injury</p>
<h2>Description</h2>
<p>Unsecured material (steel plate, approx. 15 lbs) displaced from staging area due to wind gust. Material fell approximately 8 feet to lower deck. Area was barricaded; no personnel in fall zone.</p>
<h2>Immediate Response</h2>
<ul>
  <li>Area secured and re-inspected</li>
  <li>Material re-secured with positive attachment</li>
  <li>Toolbox talk conducted for entire crew</li>
  <li>Wind monitoring protocol reviewed</li>
</ul>
<h2>Corrective Actions</h2>
<ol>
  <li>All staged materials must have positive mechanical attachment — effective immediately</li>
  <li>Wind speed threshold reduced to 20 mph for open-deck staging operations</li>
  <li>Updated staging checklist distributed to all foremen</li>
</ol>`,
    template_id: null,
    trust_stamp: null,
    findings: [],
  },
  {
    document_id: 'doc-004',
    title: 'Subcontractor Scope Agreement — Electrical Phase 1',
    status: 'draft',
    authority_class: 'partial_edit',
    is_verified: false,
    version: 1,
    sub_version: 2,
    lineage_parent_id: null,
    created_at: '2026-04-16T10:00:00Z',
    updated_at: '2026-04-18T09:15:00Z',
    content: `<h1>Subcontractor Scope Agreement</h1>
<p><strong>Parties</strong><br>Prime: Meridian Construction Group LLC<br>Sub: Volt Systems Electrical Inc.</p>
<h2>Scope of Work</h2>
<p style="color: #ff9999;">[LOCKED REGION — Governed by Contractor Division]</p>
<p>Furnish and install all electrical rough-in for Building A, Levels 1-4, including:</p>
<ul>
  <li>Branch circuit wiring per approved plans</li>
  <li>Panel installation and termination</li>
  <li>Conduit runs (EMT and rigid)</li>
  <li>Fire alarm rough-in coordination</li>
</ul>
<p style="color: #ff9999;">[END LOCKED REGION]</p>
<h2>Schedule</h2>
<p>Mobilization: 2026-05-01<br>Substantial Completion: 2026-07-15</p>
<h2>Compensation</h2>
<p>Lump Sum: $385,000<br>Retention: 10%</p>
<h2>Special Conditions</h2>
<ul>
  <li>All work subject to OVERSCITE inspection protocol</li>
  <li>Daily safety briefing attendance mandatory</li>
  <li>OSHA 10-hour certification required for all on-site personnel</li>
</ul>`,
    template_id: null,
    trust_stamp: null,
    findings: [],
  },
];

// ─── Mock Audit Log Entries ─────────────────────────────────────────
// Pre-populated audit trail for the existing stamp on doc-002

export const MOCK_AUDIT_LOG: StampAuditEntry[] = [
  {
    entry_id: 'audit-seed-001',
    stamp_id: 'stamp-002',
    document_id: 'doc-002',
    action: 'stamp_issued',
    actor: 'J. Martinez',
    timestamp: '2026-04-10T17:00:00Z',
    detail: 'Trust Stamp issued for Equipment Compliance Log — Crane Operations v2.1. CARR: 0.90. Password challenge passed.',
    hash: 'c4a8e3b2d1f0e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
    prior_hash: null,
  },
  {
    entry_id: 'audit-seed-002',
    stamp_id: 'stamp-002',
    document_id: 'doc-002',
    action: 'generation_authorized',
    actor: 'J. Martinez',
    timestamp: '2026-04-10T17:01:00Z',
    detail: 'Formal report generation authorized. Trust Stamp stamp-002 is valid.',
    hash: 'f1e2d3c4b5a6978877665544332211ffeeddccbbaa9988776655443322110000',
    prior_hash: 'c4a8e3b2d1f0e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1',
  },
];

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
