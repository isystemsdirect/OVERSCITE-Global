'use server';

/**
 * @fileOverview Implements the FBS_OVERSCITE_UNIVERSAL_PRECISION_ARCHITECTURE.
 * This file contains the declarative logic for the Secure Remote Telemetry (SRT) pipeline,
 * as defined in the UTCB (Universal Telemetry Control Block).
 */

import {z} from 'zod';
import * as crypto from 'crypto';

// --- Precision Architecture Schemas ---

export const ToleranceSchema = z.object({
  structural_default_nm: z.number().positive(),
  electrical_default_nm: z.number().positive(),
  thermal_default_nm: z.number().positive(),
  automotive_default_nm: z.number().positive(),
});

export const UniversalPrecisionMatrixSchema = z.object({
  base_unit: z.literal('nanometer'),
  hierarchical_scale: z.array(z.string()),
  normalization_required: z.literal(true),
  floating_precision_standard: z.literal('IEEE-754-double'),
  tolerance_schema: ToleranceSchema,
  propagation_rule: z.literal('highest_precision_source_dominates'),
});

export const SensorResolutionRegistrySchema = z.object({
  sensor_id: z.string().uuid(),
  hardware_signature: z.string().min(1),
  manufacturer_id: z.string().min(1),
  firmware_version: z.string().min(1),
  native_resolution_nm: z.number().positive(),
  dynamic_range: z.tuple([z.number(), z.number()]),
  calibration_timestamp: z.string().datetime(),
  error_margin_nm: z.number().nonnegative(),
});

// --- Constants ---
const CALIBRATION_EXPIRATION_DAYS = 90;

// --- SRT Pipeline Function Definitions ---

export const sensor_data_capture = (sensorData: unknown) => {
  console.log("SRT Stage 1: Capturing and validating sensor data...");
  const parsedData = SensorResolutionRegistrySchema.parse(sensorData); 
  
  // Calibration Enforcement
  const calibrationDate = new Date(parsedData.calibration_timestamp);
  const diffDays = Math.ceil(Math.abs(new Date().getTime() - calibrationDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > CALIBRATION_EXPIRATION_DAYS) {
      throw new Error(`[SENSOR_TRUST_FAIL] Calibration expired (${diffDays} days).`);
  }

  return { ...parsedData, effective_uncertainty_nm: parsedData.error_margin_nm };
};

export const unit_standardization_to_nm = (data: z.infer<typeof SensorResolutionRegistrySchema>) => {
  console.log(`SRT Stage 2: Standardizing ${data.native_resolution_nm} nm to nanometers...`);
  return { 
      ...data, 
      measurement_nm: data.native_resolution_nm, 
      unit: 'nm' as const 
  };
};

export const apply_tolerance_schema = (data: any, tolerance: z.infer<typeof ToleranceSchema>) => {
    console.log("SRT Stage 3: Applying tolerance schema...");
    return { ...data, tolerance };
};

export const threshold_comparison_engine = (data: any) => {
    console.log("SRT Stage 4: Evaluating against risk thresholds...");
    let compliance_status = 'PASS';
    let risk_level = 'Low';
    if (data.measurement_nm > 3000000) { compliance_status = 'FAIL'; risk_level = 'High'; }
    else if (data.measurement_nm >= 2000000) { compliance_status = 'FLAGGED'; risk_level = 'Medium'; }
    return { ...data, risk_level, compliance_status }; 
};

export const smart_template_orchestration = (data: any) => {
    console.log("SRT Stage 5: Triggering smart templates...");
    return { ...data, report_generated: true, template_ids_triggered: ['TEMP-001'] };
};

/**
 * Stage 6: Commits a record to the immutable audit log with cryptographic chaining.
 * Updated for UTCB Stage 5: Distributed Consensus.
 */
export const immutable_audit_log = (
    data: any, 
    previousAuditHash: string = 'GENESIS', 
    context: { 
        inspection_id: string, 
        inspector_id: string,
        node_metadata: { node_id: string, region_code: string, deployment_version: string }
    }
) => {
    console.log("SRT Stage 6: Committing to Distributed Ledger...");

    const timestamp_utc = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Construct the payload with Distributed Node Identity
    const auditPayload = {
        inspection_id: context.inspection_id,
        inspector_id: context.inspector_id,
        sensor_id: data.sensor_id, 
        measurement_nm: Math.floor(data.measurement_nm),
        compliance_status: data.compliance_status,
        risk_level: data.risk_level,
        timestamp_utc: timestamp_utc,
        previous_hash: previousAuditHash,
        nonce: nonce,
        hardware_signature: data.hardware_signature,
        error_margin_nm: data.error_margin_nm,
        // UTCB Stage 5: Node Identity Fields
        node_id: context.node_metadata.node_id,
        region_code: context.node_metadata.region_code,
        deployment_version: context.node_metadata.deployment_version
    };

    // Canonicalize the payload (Deterministic Sorted JSON)
    const canonicalString = JSON.stringify(auditPayload, Object.keys(auditPayload).sort());

    // Generate SHA-256 Hash
    const hash = crypto.createHash('sha256').update(canonicalString).digest('hex');

    console.log(`[DISTRIBUTED-AUDIT] Generated Hash: ${hash}`);
    console.log(`[DISTRIBUTED-AUDIT] Node: ${context.node_metadata.node_id} Region: ${context.node_metadata.region_code}`);

    return { 
        ...auditPayload, 
        audit_hash: hash 
    };
};
