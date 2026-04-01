import crypto from 'node:crypto';
import type { BaneStore } from './baneStore';
import type { BaneAuditRecord } from './records';

export async function appendChainedAuditLog(
  store: BaneStore,
  record: BaneAuditRecord,
  privateKeyHex?: string
): Promise<void> {
  // Fetch the anchor from persistent storage to ensure integrity across function instances.
  const anchor = await store.getAnchor();
  
  const chainedRecord: BaneAuditRecord = { ...record };
  chainedRecord.prevHash = anchor.lastHash;
  chainedRecord.sequenceRef = anchor.sequence + 1;
  
  // Hash the deterministic JSON stringified version of the record (pre-signature)
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(chainedRecord))
    .digest('hex');

  const signingKey = privateKeyHex || process.env.BANE_AUDIT_KEY;
  if (signingKey) {
    try {
      const signFn = crypto.createSign('SHA256');
      signFn.update(hash);
      const privateKeyStr = `-----BEGIN PRIVATE KEY-----\n${signingKey}\n-----END PRIVATE KEY-----`;
      chainedRecord.signature = signFn.sign(privateKeyStr, 'hex');
    } catch (e) {
      chainedRecord.signature = 'UNSIGNED';
    }
  } else {
    chainedRecord.signature = 'UNSIGNED';
  }

  // Record to persistent storage
  await store.appendAudit(chainedRecord);
  
  // Advance the anchor state permanently
  await store.updateAnchor(hash, chainedRecord.sequenceRef);
}
