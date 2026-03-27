'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileOverview Test suite for the SRT pipeline.
 * This file verifies the end-to-end flow, cryptographic hashing, and audit chaining.
 */
var srt_pipeline_1 = require("../lib/srt-pipeline");
// --- Test Data ---
var sampleSensorReading = {
    sensor_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    native_resolution_nm: 2500,
    dynamic_range: [100, 1000000],
    calibration_timestamp: new Date().toISOString(),
    error_margin_nm: 50,
};
// --- Test Execution ---
console.log("--- Running SRT Crypto-Audit Pipeline Test ---");
try {
    // 1. Execute First Run (Genesis)
    console.log("\n[TEST] Executing Run 1 (Genesis)...");
    var record1 = (0, srt_pipeline_1.executeSrtPipeline)(sampleSensorReading);
    // FIX: Updated property name to match UTCB 3.2 compliance
    if (record1.previous_hash !== 'GENESIS') {
        throw new Error("Test Failed: First record should link to GENESIS. Found: ".concat(record1.previous_hash));
    }
    if (!record1.audit_hash || record1.audit_hash.length !== 64) {
        throw new Error('Test Failed: Invalid SHA-256 hash format in record 1');
    }
    console.log("[TEST] Record 1 Hash: ".concat(record1.audit_hash));
    // 2. Execute Second Run (Chained)
    console.log("\n[TEST] Executing Run 2 (Chained)...");
    var record2 = (0, srt_pipeline_1.executeSrtPipeline)(sampleSensorReading, record1.audit_hash);
    // FIX: Updated property name to match UTCB 3.2 compliance
    if (record2.previous_hash !== record1.audit_hash) {
        throw new Error("Test Failed: Record 2 previous_hash (".concat(record2.previous_hash, ") does not match Record 1 hash (").concat(record1.audit_hash, ")"));
    }
    if (!record2.audit_hash || record2.audit_hash.length !== 64) {
        throw new Error('Test Failed: Invalid SHA-256 hash format in record 2');
    }
    console.log("[TEST] Record 2 Hash: ".concat(record2.audit_hash));
    console.log("\n--- SRT Crypto-Audit Pipeline Test Passed ---");
}
catch (error) {
    console.error("\n--- SRT Pipeline Test Failed ---");
    console.error(error);
    process.exit(1);
}
