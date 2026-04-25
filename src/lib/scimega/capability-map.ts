/**
 * @classification SCIMEGA_CAPABILITY_MAP
 * @authority SCIMEGA Origin Unit
 * @purpose Defines the SCIMEGA™ capabilities matrix for drone build classes.
 */

export interface SCIMEGA_Capabilities {
  flightTimeMinutes: number;
  maxRangeMeters: number;
  payloads: {
    visual: boolean;
    thermal: boolean;
    lidar: boolean;
  };
  stabilityClass: 'LOW' | 'MEDIUM' | 'HIGH' | 'PRECISION';
  inspectionUseCases: string[];
  environmentalLimits: {
    windMaxMph: number;
    tempMinF: number;
    tempMaxF: number;
  };
}

export const SCIMEGA_BUILD_CAPABILITIES: Record<string, SCIMEGA_Capabilities> = {
  'INSPECTION_QUAD_5': {
    flightTimeMinutes: 20,
    maxRangeMeters: 500,
    payloads: {
      visual: true,
      thermal: true,
      lidar: false
    },
    stabilityClass: 'HIGH',
    inspectionUseCases: ['roof-inspection', 'drone-exterior-survey', 'exterior-envelope'],
    environmentalLimits: {
      windMaxMph: 20,
      tempMinF: 14,
      tempMaxF: 110
    }
  },
  'SURVEY_HEX_10': {
    flightTimeMinutes: 40,
    maxRangeMeters: 2000,
    payloads: {
      visual: true,
      thermal: true,
      lidar: true
    },
    stabilityClass: 'PRECISION',
    inspectionUseCases: ['drone-exterior-survey', 'site-mapping'],
    environmentalLimits: {
      windMaxMph: 35,
      tempMinF: 0,
      tempMaxF: 120
    }
  },
  'INDOOR_CINELOOP': {
    flightTimeMinutes: 12,
    maxRangeMeters: 100,
    payloads: {
      visual: true,
      thermal: false,
      lidar: false
    },
    stabilityClass: 'MEDIUM',
    inspectionUseCases: ['interior-condition', 'confined-space'],
    environmentalLimits: {
      windMaxMph: 5,
      tempMinF: 32,
      tempMaxF: 100
    }
  }
};
