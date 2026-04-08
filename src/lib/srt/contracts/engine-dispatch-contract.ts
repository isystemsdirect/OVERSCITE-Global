/**
 * Engine Dispatch Contract
 *
 * Implements the explicit payload definition required to hand jobs off to the
 * federation of LARI intelligence engines securely.
 */

export type SrtJobType = 
  | "vision_primary" 
  | "vision_secondary" 
  | "mapper_context" 
  | "report_projection" 
  | "bane_verification_support" 
  | "quality_audit_support";

export interface EngineDispatchContract {
  acceptedMediaId: string;
  sourceMediaId: string;
  sourceHash: string;
  derivativeUri?: string;
  projectId?: string;
  inspectionId?: string;
  subsystem: "overscite" | "rebel" | "contractor";
  jobType: SrtJobType;
  requestedByFunction: string;
  dispatchTimestamp: string;
  truthState: "accepted_for_analysis";
}
