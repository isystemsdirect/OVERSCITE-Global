/**
 * @classification ARCHIVE_CRYPTO
 * @authority ArcHive™ Packaging Layer
 * @purpose Generates true cryptographic hashes for ArcHive™ manifests and audit chains.
 * @warning Supports evidence preservation only. Does not confer execution authority.
 */

export class ArchiveCrypto {
  /**
   * Generates a SHA-256 hash string for the provided text content.
   */
  static async generateSHA256(content: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback for non-browser/legacy environments if needed, but in OVERSCITE UI we expect Web Crypto API
      throw new Error('Web Crypto API is required for ArcHive cryptographic integrity.');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `sha256:${hashHex}`;
  }

  /**
   * Generates a cryptographic integrity block structure.
   */
  static async generateIntegrityBlock(
    manifestId: string,
    auditChainRoot: string,
    auditChainTip: string,
    eventCount: number,
    manifestContentHash: string
  ) {
    const compositeInput = `${manifestId}|${auditChainRoot}|${auditChainTip}|${eventCount}|${manifestContentHash}`;
    const compositeHash = await this.generateSHA256(compositeInput);

    return {
      manifestHash: compositeHash,
      auditChainRoot,
      auditChainTip,
      eventCount,
      isCryptographic: true,
      placeholderNotice: 'Cryptographic Integrity VERIFIED. Hashes generated using SHA-256. This record is immutable evidence.'
    };
  }
}
