/**
 * @classification COMPANION_DRY_LINK_CONTRACT
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Defines the Dry-Link contract for Companion Compute (Raspberry Pi/Jetson).
 * @warning DRY-LINK ONLY. No SSH, WebSocket, or process execution authorized.
 */

import { SCIMEGADryLinkAdapterContract } from '../scimega-drylink-types';

export class CompanionDryLinkContract {
  /**
   * Returns the static contract for Companion adapter readiness.
   */
  static getContract(): SCIMEGADryLinkAdapterContract {
    return {
      adapterId: 'ADAPT-COMPANION-X1',
      type: 'companion',
      description: 'Companion Computer Interface (Linux/Ubuntu RT) for Vision & LARI-Fi.',
      ports: ['ETH0_DHCP', 'WLAN0_ADHOC', 'USB_C_OTG'],
      commandFamilies: [
        'TELEPORT_SYNC_V1',
        'LARI_VISION_STREAM',
        'LIDAR_POINT_CLOUD_DATA',
        'SYSTEM_HEALTH_HEARTBEAT',
        'REMOTE_LOG_FLUSH',
        'SHELL_EXEC_COMMAND', // STRICTLY BLOCKED BY BANE
        'PROCESS_SPAWN'       // STRICTLY BLOCKED BY BANE
      ],
      safetyLimitations: [
        'NO_REMOTE_SHELL_AUTHORIZED',
        'SANDBOXED_SOCKET_MODEL',
        'NO_EXTERNAL_FETCH_ALLOWED',
        'PROCESS_ISOLATION_ENFORCED'
      ],
      isExecutionDisabled: true
    };
  }

  /**
   * Reports the dry-link diagnostic state for this contract.
   */
  static getDiagnosticMetadata(): string[] {
    return [
      'COMPANION_CONTRACT: LOADED (SCINGULAR Linux Profile)',
      'IO_LAYER: STUBBED (No net/http/websocket imports)',
      'AUTH_MODE: ARC-IDENTITY-GATED',
      'NOTICE: This contract defines the TelePort bridge interface only.'
    ];
  }
}
