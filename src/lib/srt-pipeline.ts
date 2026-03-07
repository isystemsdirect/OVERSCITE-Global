'use server';

/**
 * @fileOverview Orchestrates the end-to-end Secure Remote Telemetry (SRT) pipeline.
 * This file composes the functions defined in `precision-architecture.ts` into a
 * sequential flow, governed by the declarative configuration in `utcb.yaml`.
 */

import { z } from 'zod';
import {
  sensor_data_capture,
  unit_standardization_to_nm,
  apply_tolerance_schema,
  threshold_comparison_engine,
  smart_template_orchestration,
  immutable_audit_log,
  UniversalPrecisionMatrixSchema
} from './precision-architecture';

// --- UTCB Mock Loading ---

const MOCK_UTCB = {
  precision_architecture: {
    universal_precision_matrix: {
      base_unit: 'nanometer',
      hierarchical_scale: ['nm', 'micron', 'millimeter', 'centimeter', 'meter', 'kilometer'],
      normalization_required: true,
      floating_precision_standard: 'IEEE-754-double',
      tolerance_schema: {
        structural_default_nm: 500000,
        electrical_default_nm: 10000,
        thermal_default_nm: 5000,
        automotive_default_nm: 25000
      },
      propagation_rule: 'highest_precision_source_dominates'
    }
  }
};

export const loadUtcb = () => {
  return MOCK_UTCB;
};

// --- Execution Context ---

export interface PipelineContext {
    inspection_id: string;
    inspector_id: string;
    node_metadata: {
        node_id: string;
        region_code: string;
        deployment_version: string;
    }
}

const DEFAULT_NODE_METADATA = {
    node_id: 'node-central-01',
    region_code: 'us-east1',
    deployment_version: 'v5.0.0'
};

// --- End-to-End SRT Pipeline Execution ---

/**
 * Executes the full SRT pipeline for a given sensor reading.
 * 
 * @param sensorReading - The initial data from the sensor.
 * @param previousAuditHash - The hash of the previous audit record for chaining. Defaults to 'GENESIS'.
 * @param context - Execution context including inspection and node metadata.
 * @returns The final audit record after all pipeline stages are completed.
 */
export const executeSrtPipeline = (
    sensorReading: unknown, 
    previousAuditHash: string = 'GENESIS',
    context?: Partial<PipelineContext>
) => {
  console.log(`--- Initiating Distributed SRT Pipeline (PrevHash: ${previousAuditHash}) ---`);
  const utcb = loadUtcb();
  const toleranceSchema = utcb.precision_architecture.universal_precision_matrix.tolerance_schema;

  // 1. Ingest
  const stage1_output = sensor_data_capture(sensorReading);
  // 2. Normalize
  const stage2_output = unit_standardization_to_nm(stage1_output);
  // 3. Tolerance
  const stage3_output = apply_tolerance_schema(stage2_output, toleranceSchema);
  // 4. Compliance
  const stage4_output = threshold_comparison_engine(stage3_output);
  // 5. Templates
  const stage5_output = smart_template_orchestration(stage4_output);
  
  // 6. Audit (Distributed)
  const fullContext: PipelineContext = {
      inspection_id: context?.inspection_id || 'UNKNOWN_INSPECTION',
      inspector_id: context?.inspector_id || 'UNKNOWN_INSPECTOR',
      node_metadata: context?.node_metadata || DEFAULT_NODE_METADATA
  };

  const stage6_output = immutable_audit_log(stage5_output, previousAuditHash, fullContext);

  console.log("--- SRT Pipeline Execution Complete ---");
  return stage6_output;
};
