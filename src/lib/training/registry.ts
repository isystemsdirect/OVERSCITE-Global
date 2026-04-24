/**
 * @fileOverview Training Registry — OVERSCITE™ Methodology Stack
 * @domain Training / Methodology
 * @canonical true
 * 
 * Registers tiered training modules linked to Inspection Methods.
 * Tiers: Beginner (Standard/Awareness), Operator (Active Execution), Advanced (Forensic/QA).
 */

import { MethodID } from '../inspections/methods/contracts';
import { getMethodPack } from '../inspections/methods/registry';

export type TrainingTier = 'beginner' | 'operator' | 'advanced';

export interface TrainingModule {
  moduleId: string;
  methodId: MethodID;
  tier: TrainingTier;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  /** Skills or certifications unlocked by this module */
  certificationLink?: string;
}

export const TRAINING_REGISTRY: TrainingModule[] = [
  // General Property Inspection Modules
  {
    moduleId: 'gen-prop-101',
    methodId: 'general-property',
    tier: 'beginner',
    title: 'General Property Fundamentals',
    description: 'Core concepts, safety protocols, and standard nomenclature for residential properties.',
    objectives: ['Identify primary building components', 'Understand site safety boundaries', 'Master intake procedures'],
    estimatedMinutes: 45
  },
  {
    moduleId: 'gen-prop-201',
    methodId: 'general-property',
    tier: 'operator',
    title: 'Active Property Execution',
    description: 'Phase-by-phase execution of a general property inspection using the DocuSCRIBE workstation.',
    objectives: ['Complete capture phase requirements', 'Validate required evidence', 'Generate baseline observations'],
    estimatedMinutes: 90
  },
  
  // Roof Inspection Modules
  {
    moduleId: 'roof-101',
    methodId: 'roof-inspection',
    tier: 'beginner',
    title: 'Roofing Systems & Access Safety',
    description: 'Introduction to roofing types, penetration systems, and ladder safety/access protocols.',
    objectives: ['Identify roof materials', 'Understand pitch/slope measurements', 'Master ladder tie-off safety'],
    estimatedMinutes: 60
  },
  {
    moduleId: 'roof-301',
    methodId: 'roof-inspection',
    tier: 'advanced',
    title: 'Forensic Roof Analysis',
    description: 'Advanced storm damage detection, thermal leak mapping, and forensic grain loss analysis.',
    objectives: ['Detect subtle storm impacts', 'Map moisture intrusion paths', 'Verify replacement necessity'],
    estimatedMinutes: 120
  },
  
  // Phase 2 Methodology Intelligence Expansion [UxCB]-[2]
  {
    moduleId: 'meth-int-201',
    methodId: 'general-property',
    tier: 'operator',
    title: 'Blockers, Inhibitors, and Execution Truth',
    description: 'Mastering the distinction between execution blockers and analysis inhibitors. Learning truthful reporting of limitations.',
    objectives: [
      'Classify execution blockers vs inhibitors', 
      'Identify confidence reducers', 
      'Understand safety stop protocols',
      'Document partial completion truth'
    ],
    estimatedMinutes: 45
  },
  {
    moduleId: 'meth-int-202',
    methodId: 'interior-condition',
    tier: 'operator',
    title: 'Obstruction Classification: Furniture & Objects',
    description: 'Advanced classification of interior obstructions (beds, couches, clutter) and their impact on method validity.',
    objectives: [
      'Identify first-class obstruction inhibitors', 
      'Document furniture-concealed wall/floor sections', 
      'Apply zero-false-clear reporting logic',
      'Manage tenant-clutter limitations'
    ],
    estimatedMinutes: 30
  }
];

/**
 * Returns training modules for a specific method and optionally filtered by tier.
 */
export function getTrainingForMethod(methodId: MethodID, tier?: TrainingTier): TrainingModule[] {
  return TRAINING_REGISTRY.filter(m => m.methodId === methodId && (!tier || m.tier === tier));
}
