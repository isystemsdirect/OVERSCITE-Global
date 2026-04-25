/**
 * @classification DOS_VERSION_MODEL
 * @authority SCIMEGA™ Origin Unit
 * @purpose Defines the SCIMEGA™ DOS versioning model and artifacts.
 */

export type SCIMEGADosVersion = `v${number}.${number}`;

export interface SCIMEGADosManifest {
  version: SCIMEGADosVersion;
  buildId: string;
  releaseDate: string;
  targetClass: string;
  signature: string;
}

export interface SCIMEGAComponentMap {
  flightControllerId: string;
  escArrayId: string;
  companionComputerId: string;
  cameraSensors: string[];
  payloadModules: string[];
}

export interface SCIMEGAHalProfile {
  protocol: 'MSP' | 'MAVLink' | 'Serial' | 'WebSocket';
  baudRate: number;
  telemetryRateHz: number;
  bridgeEnabled: boolean;
}

export interface SCIMEGAArcAuthority {
  ownerArcId: string;
  certifiedTechnicians: string[];
  governanceLevel: string;
}

export interface SCIMEGATelemetryContract {
  requiredStreams: string[];
  refreshRates: Record<string, number>;
  encryption: 'AES-256' | 'NONE';
}

/**
 * The unified ArchHive™ SCIMEGA™ version package.
 */
export interface ArcHiveScimegaPackage {
  manifest: SCIMEGADosManifest;
  componentMap: SCIMEGAComponentMap;
  halProfile: SCIMEGAHalProfile;
  banePolicyId: string; // References a defined BANE policy
  arcAuthority: SCIMEGAArcAuthority;
  telemetryContract: SCIMEGATelemetryContract;
}

export class SCIMEGADOSVersionController {
  static createDefaultManifest(targetClass: string): SCIMEGADosManifest {
    return {
      version: 'v1.0',
      buildId: `BLD-${Date.now()}`,
      releaseDate: new Date().toISOString(),
      targetClass,
      signature: 'UNSIGNED'
    };
  }
}
