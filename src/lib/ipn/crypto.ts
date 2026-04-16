/**
 * Crypto and hashing utils for replay-resistance and integrity in IPN
 */

// Simulated crypto hashing for Phase 1. 
// Uses Web Crypto API when in browser or Node crypto if needed.
export async function createPayloadHash(payload: string | object): Promise<string> {
    const textAsBuffer = new TextEncoder().encode(
        typeof payload === 'string' ? payload : JSON.stringify(payload)
    );
    
    // Check if running in browser window crypto
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    // In Node.js (or fallback) environment
    try {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(textAsBuffer).digest('hex');
    } catch (e) {
        // Fallback for mock environments
        return `mock-hash-${Date.now()}`;
    }
}

export async function createAuditHash(recordSubset: object): Promise<string> {
    return createPayloadHash(recordSubset);
}

export function generateNonce(): string {
    return `nonce-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
}
