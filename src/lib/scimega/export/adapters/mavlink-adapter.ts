/**
 * @classification SCIMEGA_MAVLINK_ADAPTER
 * @authority SCIMEGA Export Boundary Unit
 * @purpose Generates draft-only MAVLink parameter intent.
 * @warning ZERO HARDWARE MUTATION. NO SERIAL/USB/TELEMETRY WRITE INTENT.
 */

import type { SCIMEGAExportArtifact, SCIMEGAExportTarget } from '../scimega-export-types';
import type { SCIMEGA_Capabilities } from '../../capability-map';

export class MavlinkAdapter {
  static generateProposal(
    target: 'ardupilot_mavlink' | 'px4_mavlink',
    capabilities: SCIMEGA_Capabilities,
    buildId: string
  ): SCIMEGAExportArtifact {
    const payload = {
      _warning: "DRAFT PROPOSAL ONLY. NOT A FLASH OR PARAMETER WRITE OPERATION.",
      _target: target,
      _buildId: buildId,
      _capabilities_hash: "calculated_hash", // mock
      configuration_intent: {
        frame_class: "HEXA",
        failsafe: {
          battery: "rtl",
          rc_loss: "rtl",
          gcs_loss: "continue"
        },
        telemetry: {
          telem1_baud: 57,
          telem1_protocol: "mavlink2"
        },
        gps: {
          type: "uavcan",
          gnss_blend: true
        },
        geofence: {
          enabled: true,
          action: "rtl",
          radius_max: capabilities.maxRangeMeters
        },
        mission_capability: true,
        payload_notes: "Camera trigger mapped to RC_AUX_1"
      }
    };

    return {
      id: `MAVLINK-${Date.now()}`,
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
