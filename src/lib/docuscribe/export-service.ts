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
 * Injects basic print styles, SCINGULAR branding, and Trust Stamp data.
 */
export function exportAsHTML(doc: DocuScribeDocument): Blob {
  const isFormal = doc.status === 'approved' || doc.is_verified;
  const stamp = doc.trust_stamp;
  const { formatting, pages } = doc;
  const { margins, lineSpacing, fontFamily, defaultHeader, defaultFooter } = formatting;
  
  // Format dates
  const updatedDate = new Date(doc.updated_at).toLocaleString();

  // Helper to render basic markdown/html
  const renderContent = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\n/g, '<br>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const pagesHtml = pages.map((page, index) => {
    return `
    <div class="page" id="page-${index + 1}">
      <div class="page-header">${page.header_override || defaultHeader || 'DocuSCRIBE™ Export'}</div>
      <div class="page-content" style="padding: ${margins.top * 0.5}in ${margins.right}in ${margins.bottom * 0.5}in ${margins.left}in; line-height: ${lineSpacing};">
        ${renderContent(page.content)}
      </div>
      <div class="page-footer">
        <div class="footer-text">${page.footer_override || defaultFooter || `Page ${index + 1} of ${pages.length}`}</div>
        ${index === pages.length - 1 && isFormal && stamp ? `
          <div class="stamp-verified">SCINGULAR VERIFIED AUTHENTICITY</div>
        ` : ''}
      </div>
    </div>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.title} - DocuSCRIBE Export</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto:wght@400;700&family=JetBrains+Mono&display=swap');
    
    :root {
      --primary: #10b981;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: '${fontFamily}', sans-serif;
      color: #1a1a1a;
    }

    @media print {
      body { background: white; }
      .no-print { display: none; }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
      }
    }

    .page {
      background: white;
      width: 8.5in;
      height: 11in;
      margin: 20px auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      box-sizing: border-box;
    }

    .page-header {
      padding: 0.5in 1in 0;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #9ca3af;
    }

    .page-content {
      flex: 1;
      overflow: hidden;
    }

    .page-footer {
      padding: 0 1in 0.5in;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #9ca3af;
      border-top: 1px solid #f3f4f6;
      margin-top: auto;
    }

    .footer-text { margin-top: 20px; }
    
    .stamp-verified {
      margin-top: 10px;
      color: var(--primary);
      font-weight: 900;
      border: 1px solid var(--primary);
      display: inline-block;
      padding: 2px 8px;
    }

    .doc-meta-cover {
      page-break-after: always;
      padding: 1in;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 11in;
      box-sizing: border-box;
      background: #fafafa;
    }

    .brand { font-weight: 900; font-size: 24px; margin-bottom: 40px; }
    .title { font-size: 48px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
    .meta-grid { display: grid; grid-template-columns: 120px 1fr; gap: 10px; font-size: 12px; }
    .label { font-weight: bold; color: #6b7280; text-transform: uppercase; }
  </style>
</head>
<body>

  <div class="doc-meta-cover">
    <div class="brand">SCINGULAR™<br><span style="font-weight:400; font-size: 14px; color:#9ca3af; letter-spacing:0.2em;">DocuSCRIBE DIVISION</span></div>
    <div class="title">${doc.title}</div>
    <div class="meta-grid">
      <div class="label">Document ID</div><div style="font-family:monospace;">${doc.document_id}</div>
      <div class="label">Date</div><div>${updatedDate}</div>
      <div class="label">Authority</div><div>${doc.authority_class.toUpperCase()}</div>
      <div class="label">Status</div><div>${doc.status.toUpperCase()}</div>
    </div>

    ${stamp ? `
    <div style="margin-top: 60px; padding: 20px; border: 2px solid var(--primary); background: #ecfdf5; border-radius: 8px;">
      <div style="font-weight:900; color:#065f46; letter-spacing:0.1em; margin-bottom: 15px;">SCINGULAR TRUST STAMP</div>
      <div class="meta-grid">
        <div class="label">Issued By</div><div>${stamp.issued_by}</div>
        <div class="label">Score</div><div>${stamp.carr_score.toFixed(2)} CARR</div>
        <div class="label">Hash</div><div style="font-family:monospace; font-size: 10px;">${stamp.content_hash}</div>
      </div>
    </div>
    ` : ''}
  </div>

  ${pagesHtml}

</body>
</html>
  `;

  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

