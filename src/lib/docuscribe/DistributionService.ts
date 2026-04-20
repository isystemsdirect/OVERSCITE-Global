/**
 * DocuSCRIBE™ — Distribution Service
 * 
 * Manages secure link lifecycle, outbound routing simulations (Email),
 * and distribution integrity checks.
 * 
 * @authority DocuSCRIBE Division
 * @classification DATA_SERVICE
 * @status P6_OPERATIONAL
 */

import { DistributionLink } from './types';

/**
 * Generates a high-entropy secure distribution identifier.
 */
function generateLinkToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  }
  return Math.random().toString(36).substring(2, 18);
}

/**
 * Creates a new secure link instance for a document.
 */
export function createSecureLink(
  docId: string, 
  options: { 
    type: 'live' | 'snapshot', 
    snapshotId?: string,
    expiryDays?: number,
    permissions?: 'view_only' | 'can_comment'
  }
): DistributionLink {
  const token = generateLinkToken();
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + (options.expiryDays || 7));

  return {
    id: token,
    url: `https://overscite.global/p/${token}`, // Simulated URL
    type: options.type,
    snapshot_id: options.snapshotId,
    expiry: expiry.toISOString(),
    permissions: options.permissions || 'view_only',
    revoked: false,
    view_count: 0
  };
}

/**
 * Validates whether a distribution link is active and authorized.
 */
export function isLinkActive(link: DistributionLink): boolean {
  if (link.revoked) return false;
  const now = new Date();
  const expiry = new Date(link.expiry);
  return now < expiry;
}

/**
 * Generates an email composition package for a document.
 */
export interface EmailPackage {
  subject: string;
  body: string;
  filename: string;
}

export function buildEmailPackage(
  docTitle: string,
  docId: string,
  link?: string
): EmailPackage {
  return {
    subject: `DocuSCRIBE Distribution: ${docTitle}`,
    body: `Hello,\n\nA document has been shared with you via OVERSCITE DocuSCRIBE™.\n\nDocument: ${docTitle}\nID: ${docId}\nLink: ${link || 'Attachment Only'}\n\nThis is an automated distribution from the OVERSCITE Global platform.`,
    filename: `${docTitle.replace(/ /g, '_')}_Report.html`
  };
}
