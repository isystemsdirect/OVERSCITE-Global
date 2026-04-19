/**
 * DocuSCRIBE™ — Export Service
 *
 * @classification DATA_SERVICE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Handles document export to various formats.
 * Incorporates Trust Stamp and CARR score directly into exported artifacts.
 * P3: Only HTML is active. PDF and Word are stubbed (governance gate).
 */

import type { DocuScribeDocument } from './types';

export type ExportFormat = 'html' | 'pdf' | 'docx';

export interface ExportCapability {
  format: ExportFormat;
  allowed: boolean;
  reason: string | null;
}

/**
 * Validates whether a specific format can be exported currently.
 */
export function getExportCapability(format: ExportFormat, doc: DocuScribeDocument): ExportCapability {
  // Formal reports (approved/verified) require a valid Trust Stamp to export
  const isFormal = doc.status === 'approved' || doc.is_verified;
  if (isFormal && (!doc.trust_stamp || !doc.trust_stamp.is_valid)) {
    return {
      format,
      allowed: false,
      reason: 'A valid Trust Stamp is required to export formal reports.'
    };
  }

  if (format === 'html') {
    return { format, allowed: true, reason: null };
  }

  // P3: PDF and DOCX dependencies are not yet authorized
  return {
    format,
    allowed: false,
    reason: 'Connector Required — PDF/DOCX compiler libraries are pending Director authorization.'
  };
}

/**
 * Triggers a browser download of a Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates an HTML document Blob from a DocuSCRIBE document.
 * Injects basic print styles, OVERSCITE branding, and Trust Stamp data.
 */
export function exportAsHTML(doc: DocuScribeDocument): Blob {
  const isFormal = doc.status === 'approved' || doc.is_verified;
  const stamp = doc.trust_stamp;
  
  // Format dates
  const createdDate = new Date(doc.created_at).toLocaleString();
  const updatedDate = new Date(doc.updated_at).toLocaleString();

  // Basic markdown-to-html (very simple subset for P3)
  const renderedContent = doc.content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.title} - DocuSCRIBE Export</title>
  <style>
    :root {
      --primary: #4ade80; /* emerald-400 equivalent for print */
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      font-weight: 900;
      font-size: 1.5rem;
      letter-spacing: -0.025em;
    }
    .brand span {
      color: #6b7280;
      font-weight: 400;
      font-size: 1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .meta {
      font-size: 0.875rem;
      color: #4b5563;
      text-align: right;
    }
    .meta-item { margin-bottom: 4px; }
    
    .stamp-container {
      margin: 30px 0;
      padding: 20px;
      border: 2px solid #10b981;
      background-color: #ecfdf5;
      border-radius: 8px;
    }
    .stamp-header {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #047857;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 15px;
    }
    .stamp-header svg {
      width: 24px;
      height: 24px;
    }
    .stamp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 0.875rem;
    }
    .stamp-label { color: #065f46; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;}
    .stamp-value { color: #022c22; font-family: monospace; }
    
    .content h1 { font-size: 1.875rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-top: 40px;}
    .content h2 { font-size: 1.5rem; margin-top: 30px;}
    .content h3 { font-size: 1.25rem; margin-top: 25px;}
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
    }
    .unverified-warning {
      color: #b91c1c;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">
      OVERSCITE™<br>
      <span>DocuSCRIBE Division</span>
    </div>
    <div class="meta">
      <div class="meta-item"><strong>ID:</strong> ${doc.document_id}</div>
      <div class="meta-item"><strong>Date:</strong> ${updatedDate}</div>
      <div class="meta-item"><strong>Version:</strong> v${doc.version}.${doc.sub_version}</div>
      <div class="meta-item"><strong>Status:</strong> ${doc.status.toUpperCase()}</div>
    </div>
  </div>

  ${stamp && stamp.is_valid ? `
  <div class="stamp-container">
    <div class="stamp-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
      SCINGULAR TRUST STAMP
    </div>
    <div class="stamp-grid">
      <div>
        <div class="stamp-label">Issued By</div>
        <div class="stamp-value">${stamp.issued_by}</div>
      </div>
      <div>
        <div class="stamp-label">Issued At</div>
        <div class="stamp-value">${new Date(stamp.issued_at).toLocaleString()}</div>
      </div>
      <div>
        <div class="stamp-label">CARR Score</div>
        <div class="stamp-value">${stamp.carr_score.toFixed(2)}</div>
      </div>
      <div>
        <div class="stamp-label">Content SHA-256 Hash</div>
        <div class="stamp-value">${stamp.content_hash.slice(0, 32)}...</div>
      </div>
    </div>
  </div>
  ` : ''}

  <div class="content">
    ${renderedContent}
  </div>

  <div class="footer">
    <div>Generated by DocuSCRIBE™ Export Service on ${new Date().toLocaleString()}</div>
    ${!doc.is_verified ? '<div class="unverified-warning">★ TRUTH-STATE WARNING: UNVERIFIED DRAFT ★</div>' : ''}
  </div>

</body>
</html>
  `;

  return new Blob([html], { type: 'text/html;charset=utf-8' });
}
