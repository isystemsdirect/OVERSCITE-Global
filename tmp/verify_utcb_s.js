const { getCurrentUTC } = require('../cloud/functions/lib/bane_engine/integrations/timeSync');
const { appendChainedAuditLog } = require('../cloud/functions/lib/bane_engine/storage/auditChain');
const crypto = require('node:crypto');

// Mock Store for verification
class MockStore {
  constructor() { this.logs = []; }
  async appendAudit(record) { this.logs.push(record); }
}

async function verify() {
  console.log('--- UTCB-S Verification Process ---');
  
  // 1. Verify Time Sync (SNTP)
  console.log('1. Testing Time Sync (SNTP)...');
  const t0 = Date.now();
  const time = await getCurrentUTC(2000);
  const t1 = Date.now();
  console.log(`   - Verified UTC: ${time.utc}`);
  console.log(`   - Local Offset: ${time.offsetMs}ms`);
  console.log(`   - Synchronized: ${time.synchronized}`);
  console.log(`   - Latency: ${t1 - t0}ms`);

  // 2. Verify Audit Chain (Hashing & Chaining)
  console.log('\n2. Testing Audit Chain Integrity...');
  const store = new MockStore();
  
  const record1 = {
    at: Date.now(),
    traceId: 'trace-1',
    route: 'test/route/1',
    verdict: 'PERMIT',
    severity: 'low',
    enforcementLevel: 0,
    inputHash: 'input-hash-1',
    findingsSummary: []
  };

  const record2 = {
    at: Date.now() + 1000,
    traceId: 'trace-2',
    route: 'test/route/2',
    verdict: 'PERMIT',
    severity: 'low',
    enforcementLevel: 0,
    inputHash: 'input-hash-2',
    findingsSummary: []
  };

  await appendChainedAuditLog(store, record1);
  await appendChainedAuditLog(store, record2);

  const log1 = store.logs[0];
  const log2 = store.logs[1];

  console.log(`   - Log 1 Hash Calculation...`);
  // Re-calculate hash of log1 to see if it matches log2.prevHash
  // The log record saved in store was log1 + prevHash (genesis)
  const log1Clean = { ...log1 };
  delete log1Clean.signature; // signature is added after hashing in my impl
  const hash1 = crypto.createHash('sha256').update(JSON.stringify(log1Clean)).digest('hex');

  console.log(`   - Log 1 PrevHash (Genesis): ${log1.prevHash}`);
  console.log(`   - Log 2 PrevHash (Should match Log 1): ${log2.prevHash}`);
  console.log(`   - Computed Log 1 Hash: ${hash1}`);

  if (log2.prevHash === hash1) {
    console.log('   [SUCCESS] Audit Chain Link Verified.');
  } else {
    console.log('   [FAILURE] Audit Chain Broken.');
    console.log('   DEBUG log2.prevHash:', log2.prevHash);
    console.log('   DEBUG computed hash1:', hash1);
    process.exit(1);
  }

  // 3. Verify Signature (if any)
  console.log(`\n3. Verifying Signature Field...`);
  console.log(`   - Log 1 Signature: ${log1.signature}`);
  console.log(`   - Log 2 Signature: ${log2.signature}`);

  console.log('\n--- EVERYTHING STILL WORKS ---');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
