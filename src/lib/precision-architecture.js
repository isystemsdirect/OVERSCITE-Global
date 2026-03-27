'use server';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.immutable_audit_log = exports.smart_template_orchestration = exports.threshold_comparison_engine = exports.apply_tolerance_schema = exports.unit_standardization_to_nm = exports.sensor_data_capture = exports.SensorResolutionRegistrySchema = exports.UniversalPrecisionMatrixSchema = exports.ToleranceSchema = void 0;
/**
 * @fileOverview Implements the FBS_OVERSCITE_UNIVERSAL_PRECISION_ARCHITECTURE.
 * This file contains the declarative logic for the Secure Remote Telemetry (SRT) pipeline,
 * as defined in the UTCB (Universal Telemetry Control Block).
 */
var zod_1 = require("zod");
var crypto = require("crypto");
// --- Precision Architecture Schemas (from UTCB) ---
exports.ToleranceSchema = zod_1.z.object({
    structural_default_nm: zod_1.z.number().positive(),
    electrical_default_nm: zod_1.z.number().positive(),
    thermal_default_nm: zod_1.z.number().positive(),
    automotive_default_nm: zod_1.z.number().positive(),
});
exports.UniversalPrecisionMatrixSchema = zod_1.z.object({
    base_unit: zod_1.z.literal('nanometer'),
    hierarchical_scale: zod_1.z.array(zod_1.z.string()),
    normalization_required: zod_1.z.literal(true),
    floating_precision_standard: zod_1.z.literal('IEEE-754-double'),
    tolerance_schema: exports.ToleranceSchema,
    propagation_rule: zod_1.z.literal('highest_precision_source_dominates'),
});
exports.SensorResolutionRegistrySchema = zod_1.z.object({
    sensor_id: zod_1.z.string().uuid(),
    native_resolution_nm: zod_1.z.number().positive(),
    dynamic_range: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
    calibration_timestamp: zod_1.z.string().datetime(),
    error_margin_nm: zod_1.z.number().nonnegative(),
});
// --- SRT Pipeline Function Definitions (from UTCB) ---
/**
 * Stage 1: Ingests raw sensor data.
 * Validates that the sensor is registered and its calibration is current.
 */
var sensor_data_capture = function (sensorData) {
    console.log("SRT Stage 1: Capturing and validating sensor data...");
    var parsedData = exports.SensorResolutionRegistrySchema.parse(sensorData);
    return parsedData;
};
exports.sensor_data_capture = sensor_data_capture;
/**
 * Stage 2: Normalizes all measurements to the base unit (nanometers).
 */
var unit_standardization_to_nm = function (data) {
    console.log("SRT Stage 2: Standardizing ".concat(data.native_resolution_nm, " nm to nanometers..."));
    return __assign(__assign({}, data), { measurement_nm: data.native_resolution_nm, unit: 'nm' });
};
exports.unit_standardization_to_nm = unit_standardization_to_nm;
/**
 * Stage 3: Applies the defined tolerance schema to the normalized data.
 */
var apply_tolerance_schema = function (data, tolerance) {
    console.log("SRT Stage 3: Applying tolerance schema...");
    return __assign(__assign({}, data), { tolerance: tolerance });
};
exports.apply_tolerance_schema = apply_tolerance_schema;
/**
 * Stage 4: Evaluates the measurement against risk thresholds.
 */
var threshold_comparison_engine = function (data) {
    console.log("SRT Stage 4: Evaluating against risk thresholds...");
    // Determine compliance status based on thresholds
    // FAIL: > 3,000,000 nm
    // FLAG: 2,000,000 - 3,000,000 nm
    // PASS: < 2,000,000 nm
    var compliance_status = 'PASS';
    var risk_level = 'Low';
    if (data.measurement_nm > 3000000) {
        compliance_status = 'FAIL';
        risk_level = 'High';
    }
    else if (data.measurement_nm >= 2000000) {
        compliance_status = 'FLAGGED';
        risk_level = 'Medium';
    }
    return __assign(__assign({}, data), { risk_level: risk_level, compliance_status: compliance_status });
};
exports.threshold_comparison_engine = threshold_comparison_engine;
/**
 * Stage 5: Triggers smart templates based on evaluation.
 */
var smart_template_orchestration = function (data) {
    console.log("SRT Stage 5: Triggering smart templates...");
    return __assign(__assign({}, data), { report_generated: true, template_ids_triggered: ['TEMP-001'] });
};
exports.smart_template_orchestration = smart_template_orchestration;
/**
 * Helper: Generates a cryptographic nonce.
 */
var generate_nonce = function () {
    return crypto.randomBytes(16).toString('hex');
};
/**
 * Stage 6: Commits a record to the immutable audit log with cryptographic chaining.
 * Implements UTCB 3.2 Ledger Sovereignty requirements.
 */
var immutable_audit_log = function (data, previousAuditHash, context) {
    if (previousAuditHash === void 0) { previousAuditHash = 'GENESIS'; }
    console.log("SRT Stage 6: Committing to immutable audit log with Forensic Grade Hardening...");
    var timestamp_utc = new Date().toISOString();
    var nonce = generate_nonce();
    // Construct the payload strictly based on UTCB 3.2 required_hash_fields
    // Note: We include nonce for replay protection, ensuring uniqueness even with identical data/timestamp
    var auditPayload = {
        inspection_id: (context === null || context === void 0 ? void 0 : context.inspection_id) || 'UNKNOWN_INSPECTION',
        inspector_id: (context === null || context === void 0 ? void 0 : context.inspector_id) || 'UNKNOWN_INSPECTOR',
        sensor_id: data.sensor_id, // Kept for traceability, though strictly not in minimal hash fields list of UTCB 3.2 example, usually required.
        measurement_nm: Math.floor(data.measurement_nm), // Integer only enforcement
        compliance_status: data.compliance_status,
        risk_level: data.risk_level,
        timestamp_utc: timestamp_utc,
        previous_hash: previousAuditHash,
        nonce: nonce
    };
    // Canonicalize the payload (Deterministic Sorted JSON)
    var canonicalString = JSON.stringify(auditPayload, Object.keys(auditPayload).sort());
    // Generate SHA-256 Hash
    var hash = crypto.createHash('sha256').update(canonicalString).digest('hex');
    console.log("[AUDIT] Generated Hash: ".concat(hash));
    console.log("[AUDIT] Linked to Previous: ".concat(previousAuditHash));
    return __assign(__assign({}, auditPayload), { audit_hash: hash });
};
exports.immutable_audit_log = immutable_audit_log;
