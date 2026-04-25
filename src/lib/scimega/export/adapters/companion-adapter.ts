/**
 * @classification SCIMEGA_COMPANION_ADAPTER
 * @authority SCIMEGA Export Boundary Unit
 * @purpose Generates draft-only companion computer service intent payloads.
 * @warning ZERO HARDWARE MUTATION. NO SHELL SCRIPTS EXECUTED. NO IMAGES BURNED.
 */

import type { SCIMEGAExportArtifact, SCIMEGAExportTarget } from '../scimega-export-types';
import type { SCIMEGA_Capabilities } from '../../capability-map';

export class CompanionAdapter {
  static generateProposal(
    target: 'companion_raspberry_pi' | 'companion_jetson',
    capabilities: SCIMEGA_Capabilities,
    buildId: string
  ): SCIMEGAExportArtifact {
    const payload = {
      _warning: "DRAFT SERVICE PAYLOAD ONLY. NOT A BOOTABLE IMAGE OR EXECUTABLE INSTALL SCRIPT.",
      _target: target,
      _buildId: buildId,
      _capabilities_hash: "calculated_hash", // mock
      service_intent: {
        teleport_bridge: {
          enabled: true,
          endpoint: "wss://teleport.overscite.local",
          auth: "token_required"
        },
        telemetry_bridge: {
          enabled: true,
          source: "serial_ttyAMA0",
          baud: 115200
        },
        camera_bridge: {
          enabled: capabilities.payloads.visual || capabilities.payloads.thermal,
          streams: [
            capabilities.payloads.visual ? "video0" : null,
            capabilities.payloads.thermal ? "video1" : null
          ].filter(Boolean)
        },
        sensor_bridge: {
          enabled: capabilities.payloads.lidar,
          type: "lidar_node"
        },
        scimega_dos: {
          manifest_ref: `DOS_MANIFEST_${buildId}`
        }
      }
    };

    return {
      id: `COMPANION-${Date.now()}`,
      target: target as SCIMEGAExportTarget,
      status: 'draft',
      payloadType: 'json',
      payloadContent: JSON.stringify(payload, null, 2),
      generatedAt: new Date().toISOString(),
      warningFlag: 'SCIMEGA_NO_FLASH_DRAFT_ONLY',
      noFlashBoundary: true,
      hardwareMutationAuthorized: false
    };
  }
}
