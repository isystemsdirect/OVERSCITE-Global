'use server';

/**
 * @fileOverview Test suite for the SRT pipeline.
 * This file verifies the end-to-end flow, cryptographic hashing, audit chaining,
 * and sensor sovereignty enforcement (UTCB Stage 4).
 */

import { executeSrtPipeline } from '../lib/srt-pipeline';

// --- Test Data (Updated for UTCB Stage 4) ---

const sampleSensorReading = {
  sensor_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  hardware_signature: 'sig_x9283748234',
  manufacturer_id: 'mfr_velodyne',
  firmware_version: 'v2.1.0',
  native_resolution_nm: 2500,
  dynamic_range: [100, 1000000],
  calibration_timestamp: new Date().toISOString(), // Valid timestamp (now)
  error_margin_nm: 50,
};

// --- Test Execution ---

console.log("--- Running SRT Crypto-Audit Pipeline Test ---");

try {
  // 1. Execute First Run (Genesis)
  console.log("\n[TEST] Executing Run 1 (Genesis)...");
  const record1 = executeSrtPipeline(sampleSensorReading);
  
  if (record1.previous_hash !== 'GENESIS') {
      throw new Error(`Test Failed: First record should link to GENESIS. Found: ${record1.previous_hash}`);
  }
  if (!record1.audit_hash || record1.audit_hash.length !== 64) {
      throw new Error('Test Failed: Invalid SHA-256 hash format in record 1');
  }
  // Verify UTCB 4 fields propagated
  if (!record1.hardware_signature) {
      throw new Error('Test Failed: Hardware signature lost in pipeline');
  }

  console.log(`[TEST] Record 1 Hash: ${record1.audit_hash}`);

  // 2. Execute Second Run (Chained)
  console.log("\n[TEST] Executing Run 2 (Chained)...");
  const record2 = executeSrtPipeline(sampleSensorReading, record1.audit_hash);

  if (record2.previous_hash !== record1.audit_hash) {
      throw new Error(`Test Failed: Record 2 previous_hash (${record2.previous_hash}) does not match Record 1 hash (${record1.audit_hash})`);
  }
  if (!record2.audit_hash || record2.audit_hash.length !== 64) {
      throw new Error('Test Failed: Invalid SHA-256 hash format in record 2');
  }
  console.log(`[TEST] Record 2 Hash: ${record2.audit_hash}`);
  
  console.log("\n--- SRT Crypto-Audit Pipeline Test Passed ---");

} catch (error) {
  console.error("\n--- SRT Pipeline Test Failed ---");
  console.error(error);
  process.exit(1);
}
