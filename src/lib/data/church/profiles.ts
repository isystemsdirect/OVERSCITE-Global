/**
 * SCINGULAR — Grounded Test Object: True Spirit Church
 * 
 * This data block represents a high-stakes religious assembly client
 * used for system validation and forensic workflow testing.
 * 
 * Truth Classes: CIP, EECIP, PIP, EEPIP
 */

import { EECIP_Status } from '@/lib/types/client-intelligence';

export const CHURCH_CIP = {
  id: 'CIP-CHURCH-001',
  name: 'True Spirit Church',
  entityType: 'Religious Organization',
  status: 'Active',
  cip_version: '1.0',
  truthClass: 'accepted_baseline',
  profileType: 'CIP',
  contactStructure: {
    primaryContact: {
      role: 'Pastor / Facility Authority',
      name: 'PENDING',
      phone: 'UNKNOWN',
      email: 'UNKNOWN'
    }
  },
  governanceNotes: [
    'Authority structure may include board oversight',
    'Decision-making may not be single-point authority',
    'Potential multi-stakeholder approval required'
  ],
  riskPosture: [
    'Public assembly occupancy',
    'Life safety relevance',
    'Aging infrastructure likely'
  ]
};

export const CHURCH_EECIP = {
  eecip_id: 'EECIP-CHURCH-001',
  eecip_version: '1.0',
  truthClass: 'external_enhancement_candidate',
  profileType: 'EECIP',
  organizationInsights: [
    'Possible nonprofit registration',
    'May have board governance structure',
    'Potential external funding/donation dependency'
  ],
  sources: ['Public-Records', 'Business-Registry']
};

export const CHURCH_PIP = {
  id: 'PIP-CHURCH-001',
  clientId: 'CIP-CHURCH-001',
  propertyIdentity: {
    name: 'True Spirit Church Building',
    propertyType: 'Assembly',
    occupancyType: 'Religious Gathering',
    estimatedAge: 'OLDER STRUCTURE (VISUAL ASSUMPTION)'
  },
  address: '123 Sanctuary Way, Unity City, CA 90001',
  siteContext: {
    environment: 'Urban / Semi-Urban',
    accessPoints: 'STANDARD',
    parking: 'LIKELY ONSITE'
  },
  complianceContext: [
    'Assembly occupancy triggers life safety scrutiny',
    'ADA considerations likely applicable'
  ],
  status: 'Inspection Pending'
};

export const CHURCH_EEPIP = {
  propertyId: 'PIP-CHURCH-001',
  profileVersion: '1.0',
  truthClass: 'external_enhancement_candidate',
  profileType: 'EEPIP',
  researchFindings: [
    'Building likely older construction',
    'Potential legacy plumbing system',
    'Unknown renovation history'
  ],
  potentialRiskZones: [
    'Roof drainage system',
    'Basement / foundation moisture',
    'Assembly egress compliance'
  ]
};
