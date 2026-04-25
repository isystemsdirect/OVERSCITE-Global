/**
 * @classification SCIMEGA_STANDARDS_MAP
 * @authority SCIMEGA Origin Unit
 * @purpose Defines the practical standards support matrix for SCIMEGA hardware targeting.
 */

export type HardwareCategory = 'FLIGHT_CONTROLLER' | 'ESC' | 'COMPANION_COMPUTER' | 'PROPRIETARY';

export interface HardwareTarget {
  id: string;
  name: string;
  category: HardwareCategory;
  protocols: string[];
  supported: boolean;
  notes: string;
}

export const SCIMEGA_STANDARDS_MAP: Record<HardwareCategory, HardwareTarget[]> = {
  FLIGHT_CONTROLLER: [
    {
      id: 'FC_BETAFLIGHT',
      name: 'Betaflight',
      category: 'FLIGHT_CONTROLLER',
      protocols: ['MSP', 'CRSF'],
      supported: true,
      notes: 'Primary supported FC via MSP telemetry bridging.'
    },
    {
      id: 'FC_CLEANFLIGHT',
      name: 'Cleanflight-family',
      category: 'FLIGHT_CONTROLLER',
      protocols: ['MSP'],
      supported: true,
      notes: 'Supported where MSP protocol remains compatible.'
    },
    {
      id: 'FC_ARDUPILOT',
      name: 'ArduPilot',
      category: 'FLIGHT_CONTROLLER',
      protocols: ['MAVLink'],
      supported: true,
      notes: 'Supported via MAVLink routing where practical.'
    },
    {
      id: 'FC_PX4',
      name: 'PX4',
      category: 'FLIGHT_CONTROLLER',
      protocols: ['MAVLink'],
      supported: true,
      notes: 'Supported via MAVLink routing where practical.'
    }
  ],
  ESC: [
    {
      id: 'ESC_DSHOT',
      name: 'DShot (150/300/600)',
      category: 'ESC',
      protocols: ['DShot'],
      supported: true,
      notes: 'Preferred digital protocol for low latency.'
    },
    {
      id: 'ESC_PWM',
      name: 'PWM / OneShot',
      category: 'ESC',
      protocols: ['PWM', 'OneShot125'],
      supported: true,
      notes: 'Legacy mapping supported.'
    },
    {
      id: 'ESC_BLHELI',
      name: 'BLHeli / Bluejay',
      category: 'ESC',
      protocols: ['DShot', 'ProShot'],
      supported: true,
      notes: 'Ecosystem mapping supported where practical.'
    }
  ],
  COMPANION_COMPUTER: [
    {
      id: 'CC_RPI_OS',
      name: 'Raspberry Pi OS Profile',
      category: 'COMPANION_COMPUTER',
      protocols: ['TCP/IP', 'I2C', 'UART'],
      supported: true,
      notes: 'Primary companion runtime target.'
    },
    {
      id: 'CC_CAMERA_SVC',
      name: 'Camera Service Profile',
      category: 'COMPANION_COMPUTER',
      protocols: ['RTSP', 'WebRTC'],
      supported: true,
      notes: 'Low-latency video encoding bridge.'
    },
    {
      id: 'CC_TELEMETRY',
      name: 'Telemetry Bridge Profile',
      category: 'COMPANION_COMPUTER',
      protocols: ['Serial', 'WebSocket'],
      supported: true,
      notes: 'Routes FC serial to OVERSCITE.'
    },
    {
      id: 'CC_TELEPORT',
      name: 'WebSocket TelePort Bridge',
      category: 'COMPANION_COMPUTER',
      protocols: ['WebSocket', 'WSS'],
      supported: true,
      notes: 'Real-time duplex HAL command gate.'
    },
    {
      id: 'CC_DAEMON',
      name: 'Sensor/Payload Daemon',
      category: 'COMPANION_COMPUTER',
      protocols: ['I2C', 'SPI'],
      supported: true,
      notes: 'Manages auxiliary SCIMEGA hardware.'
    }
  ],
  PROPRIETARY: [
    {
      id: 'PROP_DOS_SCHEMA',
      name: 'SCIMEGA™ DOS Profile Schema',
      category: 'PROPRIETARY',
      protocols: ['JSON', 'BANE-SIGNED'],
      supported: true,
      notes: 'Core OS envelope and identity.'
    },
    {
      id: 'PROP_ARCHIVE_PKG',
      name: 'ArcHive™ SCIMEGA™ Version Pkg',
      category: 'PROPRIETARY',
      protocols: ['TAR.GZ', 'CRYPTO-SIGNED'],
      supported: true,
      notes: 'Governed version package lineage.'
    },
    {
      id: 'PROP_DEVICE_ID',
      name: 'SCIMEGA™ Device Identity Manifest',
      category: 'PROPRIETARY',
      protocols: ['JWT', 'ARC-BOUND'],
      supported: true,
      notes: 'Hardware attestation root.'
    }
  ]
};
