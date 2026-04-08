/**
 * Engine Dispatch Registry
 *
 * Defines the canonical map of recognized analysis engines available for 
 * routing from the SRT Edge Spine.
 */

import { SrtJobType } from "./contracts/engine-dispatch-contract";

export interface EngineEndpoint {
  id: string;
  name: string;
  jobType: SrtJobType;
  requiresDerivative: boolean;
  timeoutMs: number;
}

export const ENGINE_DISPATCH_REGISTRY: Record<string, EngineEndpoint> = {
  "lari-vision-primary": {
    id: "lari-vision-primary",
    name: "LARI Primary Vision Extractor",
    jobType: "vision_primary",
    requiresDerivative: true,
    timeoutMs: 30000
  },
  "lari-vision-secondary": {
    id: "lari-vision-secondary",
    name: "LARI Secondary Context Extractor",
    jobType: "vision_secondary",
    requiresDerivative: true,
    timeoutMs: 45000
  },
  "overscite-mapper": {
    id: "overscite-mapper",
    name: "OVERSCITE Mapper AI",
    jobType: "mapper_context",
    requiresDerivative: false,
    timeoutMs: 15000
  },
  "bane-auditor": {
    id: "bane-auditor",
    name: "BANE Image Auditor",
    jobType: "bane_verification_support",
    requiresDerivative: false,
    timeoutMs: 20000
  }
};
