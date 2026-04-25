/**
 * @fileOverview Method Registry — OVERSCITE™ Methodology Stack
 * @domain Inspections / Methodology
 * @canonical true
 * 
 * Central registry for all governed inspection methods. 
 * Powers training, guidance, workflows, and templates.
 */

import { InspectionMethod, MethodGraph } from './contracts';

/**
 * Graph Definition for Roof Inspection.
 * Safety -> Setup -> (Drone Survey || Exterior Walkthrough) -> Moisture Scan
 */
const ROOF_INSPECTION_GRAPH: MethodGraph = {
  graphId: 'g-roof-001',
  methodId: 'roof-inspection',
  version: '1.0.0',
  entryNodeIds: ['node-safety'],
  nodes: [
    {
      nodeId: 'node-safety',
      nodeClass: 'setup',
      title: 'Safety and Access Check',
      description: 'Confirm safe roof access and personal safety equipment.',
      requiredEvidenceIds: ['ladder-access'],
      requiredResources: ['tall_ladder'],
      weight: 10
    },
    {
      nodeId: 'node-setup',
      nodeClass: 'setup',
      title: 'Equipment Calibration',
      description: 'Verify sensor calibration and tool readiness.',
      requiredEvidenceIds: [],
      requiredResources: [],
      weight: 5
    },
    {
      nodeId: 'node-drone-survey',
      nodeClass: 'capture',
      title: 'Drone Aerial Survey',
      description: 'Execute high-resolution nadir and oblique capture.',
      requiredEvidenceIds: [],
      requiredResources: ['drone_unit'],
      weight: 40
    },
    {
      nodeId: 'node-exterior-walkthrough',
      nodeClass: 'capture',
      title: 'Manual Exterior Walkthrough',
      description: 'Ground-level verification of envelope and drainage.',
      requiredEvidenceIds: [],
      requiredResources: [],
      weight: 30
    },
    {
      nodeId: 'node-moisture-scan',
      nodeClass: 'analysis',
      title: 'Thermal Moisture Scan',
      description: 'Analyze thermal anomalies for suspected intrusion.',
      requiredEvidenceIds: ['roof-leak-scan'],
      requiredResources: ['thermal_imager'],
      weight: 20
    }
  ],
  edges: [
    {
      edgeId: 'e1',
      fromNodeId: 'node-safety',
      toNodeId: 'node-setup',
      edgeType: 'hard_dependency'
    },
    {
      edgeId: 'e2',
      fromNodeId: 'node-setup',
      toNodeId: 'node-drone-survey',
      edgeType: 'parallel_branch'
    },
    {
      edgeId: 'e3',
      fromNodeId: 'node-setup',
      toNodeId: 'node-exterior-walkthrough',
      edgeType: 'parallel_branch'
    },
    {
      edgeId: 'e4',
      fromNodeId: 'node-drone-survey',
      toNodeId: 'node-moisture-scan',
      edgeType: 'hard_dependency'
    },
    {
      edgeId: 'e5',
      fromNodeId: 'node-exterior-walkthrough',
      toNodeId: 'node-moisture-scan',
      edgeType: 'soft_dependency'
    }
  ]
};

export const METHOD_REGISTRY: Record<string, InspectionMethod> = {
  'general-property': {
    methodId: 'general-property',
    methodName: 'General Property Inspection',
    methodClass: 'residential',
    version: '1.0.0',
    purpose: 'Standard baseline assessment of property condition and safety.',
    useCases: ['General walkthrough', 'Pre-inspection assessment', 'Standard maintenance check'],
    requiredTools: ['Digital Camera', 'Flashlight', 'Measuring Tape'],
    protectedSections: ['Governed Disclosures', 'Property Metadata'],
    workflowPhases: [
      {
        phaseId: 'intake',
        phaseName: 'Intake and Setup',
        phaseOrder: 1,
        phasePurpose: 'Verify site identity and inspector readiness.',
        requiredSteps: [
          { stepId: 'safety-check', label: 'Safety Check', instruction: 'Confirm site is safe for inspection.', required: true }
        ],
        requiredEvidenceRefs: ['site-photo'],
        completionRules: ['Job confirmed', 'Inspector present']
      }
    ],
    requiredEvidence: [
      { evidenceId: 'site-photo', evidenceType: 'photo', label: 'Overall Site View', description: 'Photo showing the property from the front/access point.', required: true }
    ],
    templateBindings: [
      { templateSectionId: 'disclosures', sectionName: 'Governed Disclosures', required: true, isProtected: true, fixedContent: 'Standard OVERSCITE Compliance Disclosure v1.0' }
    ],
    qaAcceptanceCriteria: {
      minimumEvidenceCount: 5,
      criticalPhotoRequirements: ['site-photo'],
      mandatorySectionsFilled: true
    },
    analysisProfile: {
      analysisObjectives: ['Identify primary building systems', 'Determine overall maintenance level', 'Detect obvious safety hazards'],
      expectedEvidencePatterns: ['Envelope coherence', 'Structural alignment', 'Site drainage flow'],
      contradictionRules: ['Integrity claim without supporting imagery', 'Conflicting system ages'],
      confidenceConstraints: ['Low light reduction', 'Limited access constraints'],
      escalationTriggers: ['Structural failure indicators', 'Life safety violations'],
      qaFlags: ['Insufficient site coverage', 'Blurry evidence'],
      reportMappingHints: ['Map to Executive Summary', 'Map to Safety Section']
    },
    blockerProfile: {
      executionBlockers: ['Denied site access', 'Unsafe conditions (Hostile)', 'Natural disaster active'],
      executionInhibitors: ['Inclement weather', 'Limited daylight'],
      evidenceInhibitors: ['Dust/debris', 'Partial system concealment'],
      confidenceReducers: ['Indirect observation', 'Non-calibrated tools'],
      safetyStops: ['Gas leak suspected', 'Structural instability'],
      rescheduleTriggers: ['Access key failure', 'Major system blackout'],
      partialCompletionRules: ['Document per inaccessible area', 'Mark as "Site Restricted"'],
      overrideRequirements: ['Director approval for unsafe bypass'],
      qaFailureFlags: ['Missing exterior baseline'],
      obstructionInhibitors: ['Stored materials blocking perimeter', 'Unsecured pets']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 60,
      requiredIRIThreshold: 70, // Moderate risk allowed for general walkthrough
      daylightRequirement: 'preferred',
      environmentalRestrictions: [],
      requiredResources: [],
      crewRequirements: 1
    },
    guidanceHooks: [
      { triggerType: 'phase_entry', phaseId: 'intake', prompt: 'Welcome to General Property Inspection. Begin by confirming site safety.' }
    ],
    workflowGraph: {
      graphId: 'g-general-001',
      methodId: 'general-property',
      version: '1.0.0',
      entryNodeIds: ['g1'],
      nodes: [
        { nodeId: 'g1', nodeClass: 'intake', title: 'Site Intake', description: 'Photo documentation of site arrival.', requiredEvidenceIds: ['site-photo'], requiredResources: [] }
      ],
      edges: []
    }
  },
  'roof-inspection': {
    methodId: 'roof-inspection',
    methodName: 'Roof Inspection',
    methodClass: 'residential',
    version: '1.0.0',
    purpose: 'Specialized assessment of roof surfaces, penetrations, and drainage.',
    useCases: ['Storm damage assessment', 'Replacement verification', 'Standard roof audit'],
    requiredTools: ['Ladder', 'Pitch Gauge', 'Moisture Meter', 'Camera'],
    protectedSections: ['Roof Safety Disclaimer', 'Factual Observation Matrix'],
    workflowPhases: [
      {
        phaseId: 'safety',
        phaseName: 'Safety and Access',
        phaseOrder: 1,
        phasePurpose: 'Confirm roof access safety and equipment status.',
        requiredSteps: [
          { stepId: 'ladder-safety', label: 'Ladder Tie-Off', instruction: 'Confirm ladder is tied off or secured.', required: true }
        ],
        requiredEvidenceRefs: ['ladder-access'],
        completionRules: ['Tie-off verified']
      }
    ],
    requiredEvidence: [
      { evidenceId: 'ladder-access', evidenceType: 'photo', label: 'Ladder/Access Setup', description: 'Verification of safe roof access.', required: true },
      { evidenceId: 'roof-leak-scan', evidenceType: 'thermal', label: 'Thermal Leak Scan', description: 'Thermal scan of suspected leak areas.', required: false }
    ],
    templateBindings: [
      { templateSectionId: 'safety-disclaimer', sectionName: 'Roof Safety Disclaimer', required: true, isProtected: true }
    ],
    qaAcceptanceCriteria: {
      minimumEvidenceCount: 10,
      criticalPhotoRequirements: ['ladder-access', 'pitch-check'],
      mandatorySectionsFilled: true
    },
    analysisProfile: {
      analysisObjectives: ['Detect storm impact signatures', 'Assess age-related degradation', 'Verify penetration integrity'],
      expectedEvidencePatterns: ['Uniform shingle wear', 'Linear flashing alignment', 'Thermal anomalies (wet insulation)'],
      contradictionRules: ['New shingle claim on rusted vents', 'Leak claim with dry substrate imagery'],
      confidenceConstraints: ['Sun glare obstruction', 'Steep slope limitation'],
      escalationTriggers: ['Active leak in progress', 'Missing structural decking'],
      qaFlags: ['Insufficient close-up macros', 'Missing pitch verification'],
      reportMappingHints: ['Map to Roof System Analysis', 'Map to Storm Damage Detail']
    },
    blockerProfile: {
      executionBlockers: ['Ice/Snow accumulation', 'Active lightning', 'Unstable roof structure'],
      executionInhibitors: ['Wet surface (Slip risk)', 'High wind (>25mph)', 'Steep pitch (>10/12)'],
      evidenceInhibitors: ['Heavy tree cover', 'Solar panel concealment', 'Heavy debris/leaves'],
      confidenceReducers: ['Ground-only observation', 'Drone-only (No tactile)'],
      safetyStops: ['Fragile material (Slate/Clay) without specialized access', 'Power line proximity'],
      rescheduleTriggers: ['Rain in progress', 'Lack of appropriate ladder height'],
      partialCompletionRules: ['Ground-only survey allowed with disclaimer', 'Mark steep facets as "Visual Only"'],
      overrideRequirements: ['Specialized climbing gear certification'],
      qaFailureFlags: ['No tie-off evidence'],
      obstructionInhibitors: ['Tree branches contacting surface', 'Bird nesting obstruction']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 45,
      requiredIRIThreshold: 40, // High sensitivity to wind and wet surfaces
      daylightRequirement: 'mandatory',
      environmentalRestrictions: ['Rain', 'Snow', 'High Wind', 'Ice'],
      requiredResources: ['tall_ladder'],
      crewRequirements: 1,
      requiredCapabilities: {
        visual: true,
        thermal: true,
        minimumRangeMeters: 50,
        minimumFlightTimeMinutes: 15,
        minimumStabilityClass: 'HIGH'
      }
    },
    guidanceHooks: [
      { triggerType: 'phase_entry', phaseId: 'safety', prompt: 'Safety First: Confirm ladder tie-off before ascending.' }
    ],
    workflowGraph: ROOF_INSPECTION_GRAPH
  },
  'exterior-envelope': {
    methodId: 'exterior-envelope',
    methodName: 'Exterior Envelope Inspection',
    methodClass: 'residential',
    version: '1.0.0',
    purpose: 'Comprehensive audit of building exterior: siding, windows, and drainage.',
    useCases: ['Envelope integrity check', 'Window leak investigation'],
    requiredTools: ['Camera', 'Moisture Meter'],
    protectedSections: ['Envelope Truth State'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 15, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Verify water shedding capacity', 'Detect window seal failures', 'Assess siding adhesion'],
      expectedEvidencePatterns: ['Proper flashing laps', 'Unobstructed weep holes'],
      contradictionRules: ['Sealant failure claim on new windows'],
      confidenceConstraints: ['Vegetation concealment', 'High elevation limitation'],
      escalationTriggers: ['Rotting structural members', 'Widespread moisture intrusion'],
      qaFlags: ['Missing corner detail', 'Inconsistent lighting'],
      reportMappingHints: ['Envelope Integrity', 'Opening Failures']
    },
    blockerProfile: {
      executionBlockers: ['Locked perimeter access', 'Dangerous pets'],
      executionInhibitors: ['Heavy rain', 'Scaffolding requirements'],
      evidenceInhibitors: ['Lush vegetation', 'Stored equipment against walls', 'Exterior finishes (IVY)'],
      confidenceReducers: ['Binocular-only observation'],
      safetyStops: ['Wasp/Hornet nesting', 'Loose overhead hazards'],
      rescheduleTriggers: ['Gate locked', 'Aggressive dog present'],
      partialCompletionRules: ['Exclude inaccessible elevations', 'Note vegetation-driven concealment'],
      overrideRequirements: ['Client provided access authorization'],
      qaFailureFlags: ['Missing foundation-to-siding transition detail'],
      obstructionInhibitors: ['Stored vehicles', 'Firewood stacks blocking walls']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 90,
      requiredIRIThreshold: 50,
      daylightRequirement: 'preferred',
      environmentalRestrictions: ['Heavy Rain'],
      requiredResources: [],
      crewRequirements: 1,
      requiredCapabilities: {
        visual: true,
        minimumStabilityClass: 'MEDIUM'
      }
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-env-001',
      methodId: 'exterior-envelope',
      version: '1.0.0',
      entryNodeIds: ['e1'],
      nodes: [{ nodeId: 'e1', nodeClass: 'capture', title: 'Perimeter Audit', description: 'Walkthrough of property perimeter.', requiredEvidenceIds: [], requiredResources: [] }],
      edges: []
    }
  },
  'interior-condition': {
    methodId: 'interior-condition',
    methodName: 'Interior Condition Inspection',
    methodClass: 'residential',
    version: '1.0.0',
    purpose: 'Detailed room-by-room condition assessment.',
    useCases: ['Lease turnover', 'Loss assessment', 'Standard interior audit'],
    requiredTools: ['Camera', 'Flashlight'],
    protectedSections: ['Interior Coverage Summary'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 20, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Identify tenant-induced damage', 'Detect environmental issues (Mold)', 'Assess finish condition'],
      expectedEvidencePatterns: ['Normal wear and tear signatures', 'Moisture stain patterns'],
      contradictionRules: ['"New" flooring claim with visible scratches'],
      confidenceConstraints: ['Heavy clutter/furniture', 'Poor illumination'],
      escalationTriggers: ['Active mold growth', 'Utility system failure'],
      qaFlags: ['Missing ceiling photos', 'Insufficient wall coverage'],
      reportMappingHints: ['Room-by-Room Detail', 'Maintenance Recommendations']
    },
    blockerProfile: {
      executionBlockers: ['Refusal of entry', 'Unsafe hygiene conditions'],
      executionInhibitors: ['Tenant presence interference', 'Lack of utilities'],
      evidenceInhibitors: ['Furniture obscuring walls/outlets', 'Beds against walls', 'Large rugs covering floors', 'Clutter-filled rooms'],
      confidenceReducers: ['Low-light imagery', 'Concealed storage areas'],
      safetyStops: ['Fumes/Chemical odors', 'Unsecured dangerousสัตว์ (pets)'],
      rescheduleTriggers: ['No power/water', 'Eviction in progress'],
      partialCompletionRules: ['Exclude "Hoarding" or "Heavy Clutter" rooms', 'Document furniture-excluded areas'],
      overrideRequirements: ['Manager-assisted entry'],
      qaFailureFlags: ['No photo of master electrical panel'],
      obstructionInhibitors: ['Clothing stacks', 'Stored boxes', 'Couches/Beds blocking baseboards']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 120,
      requiredIRIThreshold: 100, // Interior methods are less sensitive to weather
      daylightRequirement: 'optional',
      environmentalRestrictions: [],
      requiredResources: [],
      crewRequirements: 1
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-int-001',
      methodId: 'interior-condition',
      version: '1.0.0',
      entryNodeIds: ['i1'],
      nodes: [{ nodeId: 'i1', nodeClass: 'capture', title: 'Interior Scan', description: 'Room-by-room documention.', requiredEvidenceIds: [], requiredResources: [] }],
      edges: []
    }
  },
  'moisture-leak': {
    methodId: 'moisture-leak',
    methodName: 'Moisture / Leak Investigation',
    methodClass: 'residential',
    version: '1.0.0',
    purpose: 'Forensic investigation of moisture intrusion and leak paths.',
    useCases: ['Active leak tracking', 'Historical leak verification'],
    requiredTools: ['Moisture Meter', 'Thermal Camera', 'Borescope'],
    protectedSections: ['Forensic Moisture Map'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 12, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Identify moisture source', 'Determine extent of damage', 'Track migration path'],
      expectedEvidencePatterns: ['Spreading stain circularity', 'Thermal delta (Evaporative cooling)'],
      contradictionRules: ['Dry moisture reading on "active" leak', 'Cold thermal signature on warm heating pipe'],
      confidenceConstraints: ['Finish depth (Plaster)', 'Ambient temperature normalization'],
      escalationTriggers: ['Standing water in structural cavities', 'Biohazard presence'],
      qaFlags: ['Missing meter-verification photos', 'Inconsistent thermal scaling'],
      reportMappingHints: ['Moisture Source Analysis', 'Damage Quantification']
    },
    blockerProfile: {
      executionBlockers: ['Hazardous mold levels', 'Electrified wet area'],
      executionInhibitors: ['Recent repair concealment', 'Lack of thermal contrast'],
      evidenceInhibitors: ['Concealed finishes (Tiled walls)', 'Built-in cabinetry', 'Furniture-covered staining'],
      confidenceReducers: ['Pinless-only measurement', 'Old thermal sensors'],
      safetyStops: ['Asbestos-containing materials suspected in cavity'],
      rescheduleTriggers: ['Intermittent leak (No active evidence)'],
      partialCompletionRules: ['Document known inaccessible cavities', 'Mark "Concealed Source"'],
      overrideRequirements: ['Destructive testing authorization'],
      qaFailureFlags: ['No dry baseline reading provided'],
      obstructionInhibitors: ['Washing machines/Dryers blocking pipes', 'Vanities concealing supply lines']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 90,
      requiredIRIThreshold: 90,
      daylightRequirement: 'optional',
      environmentalRestrictions: [],
      requiredResources: ['moisture_meter', 'thermal_imager'],
      crewRequirements: 1,
      requiredCapabilities: {
        thermal: true
      }
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-moist-001',
      methodId: 'moisture-leak',
      version: '1.0.0',
      entryNodeIds: ['m1'],
      nodes: [{ nodeId: 'm1', nodeClass: 'capture', title: 'Thermal Audit', description: 'Thermal scanning of suspected areas.', requiredEvidenceIds: [], requiredResources: ['thermal_imager'] }],
      edges: []
    }
  },
  'drone-exterior-survey': {
    methodId: 'drone-exterior-survey',
    methodName: 'Drone-Assisted Exterior Survey',
    methodClass: 'site',
    version: '1.0.0',
    purpose: 'Aerial capture and survey of structures and property site.',
    useCases: ['High-reach inspection', 'Site mapping', 'Roof survey'],
    requiredTools: ['Drone', 'Controller', 'Safety Kit'],
    protectedSections: ['Flight Log Compliance', 'Airspace Metadata'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 30, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Map structural coverage', 'Detect high-elevation anomalies', 'Assess site drainage patterns'],
      expectedEvidencePatterns: ['Nadir view consistency', 'Oblique coverage overlap'],
      contradictionRules: ['"Clear" roof claim with blurry drone zoom'],
      confidenceConstraints: ['GPS interference', 'Obstacle proximity'],
      escalationTriggers: ['Restricted airspace violation', 'Battery failure warning'],
      qaFlags: ['Insufficient overlap (%)', 'Motion blur'],
      reportMappingHints: ['Aerial Perspective', 'Site Map Context']
    },
    blockerProfile: {
      executionBlockers: ['Rain/Snow', 'Winds >20mph', 'Restricted Airspace (TFR)'],
      executionInhibitors: ['Low satellite count', 'Interference zones'],
      evidenceInhibitors: ['Tree canopy', 'Power lines', 'Shadow depth'],
      confidenceReducers: ['Digital zoom usage', 'Poor lighting (Dusk)'],
      safetyStops: ['Close proximity to people', 'Hardware malfunction'],
      rescheduleTriggers: ['Compass calibration failure', 'High K-index (Solar)'],
      partialCompletionRules: ['Exclude "Signal No-Go" zones', 'Switch to ground-manual for obscured areas'],
      overrideRequirements: ['Remote Pilot certification current'],
      qaFailureFlags: ['Missing launch/recovery telemetry'],
      obstructionInhibitors: ['Overhead foliage', 'Cell towers', 'Magnetic interference']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 30,
      requiredIRIThreshold: 30, // Extremely sensitive to wind/precip
      daylightRequirement: 'mandatory',
      environmentalRestrictions: ['High Wind', 'Rain', 'Snow', 'Low Visibility'],
      requiredResources: ['drone_unit'],
      crewRequirements: 1, // 1 Pilot (VO preferred but not mandatory for first test)
      requiredCapabilities: {
        visual: true,
        minimumRangeMeters: 200,
        minimumFlightTimeMinutes: 20,
        minimumStabilityClass: 'HIGH'
      }
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-drone-001',
      methodId: 'drone-exterior-survey',
      version: '1.0.0',
      entryNodeIds: ['d1'],
      nodes: [
        { nodeId: 'd1', nodeClass: 'setup', title: 'Airspace Verification', description: 'Confirm LAANC and safety.', requiredEvidenceIds: [], requiredResources: [] },
        { nodeId: 'd2', nodeClass: 'capture', title: 'Aerial Survey', description: 'Active flight mission.', requiredEvidenceIds: [], requiredResources: ['drone_unit'] }
      ],
      edges: [
        { edgeId: 'de1', fromNodeId: 'd1', toNodeId: 'd2', edgeType: 'hard_dependency' }
      ]
    }
  },
  'environment-safety': {
    methodId: 'environment-safety',
    methodName: 'Environment & Safety Precheck',
    methodClass: 'safety',
    version: '1.0.0',
    purpose: 'Atmospheric and logistical pre-job safety assessment.',
    useCases: ['Pre-job safety meeting', 'Site hazard audit'],
    requiredTools: ['Anemometer', 'Thermometer'],
    protectedSections: ['BANE Safety Verdict'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 5, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Identify life-safety risks', 'Determine PPE requirements', 'Verify environmentals'],
      expectedEvidencePatterns: ['Stable atmospheric readings', 'Clear egress paths'],
      contradictionRules: ['"Safe" claim with active fire alarm'],
      confidenceConstraints: ['Sensor calibration drift', 'Localized hazards'],
      escalationTriggers: ['Toxic gas detection', 'Live wire exposure'],
      qaFlags: ['Incomplete hazard scan', 'Timed-out safety log'],
      reportMappingHints: ['Field Safety Assessment', 'Risk Mitigation']
    },
    blockerProfile: {
      executionBlockers: ['Immediate Life Safety Threat', 'Gas leak detected'],
      executionInhibitors: ['Poor lighting', 'Extreme temperatures'],
      evidenceInhibitors: ['Inaccessible hazardous areas', 'Fog/Steam'],
      confidenceReducers: ['Guested readings', 'Non-calibrated sensors'],
      safetyStops: ['PPE failure', 'Emergency signal detected'],
      rescheduleTriggers: ['Site lockdown', 'Emergency services active'],
      partialCompletionRules: ['Abort and escalate', 'Secure perimeter only'],
      overrideRequirements: ['Incident commander approval'],
      qaFailureFlags: ['Missing signature/timestamp'],
      obstructionInhibitors: ['Debris blocking exit', 'Corroded safety valves']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 20,
      requiredIRIThreshold: 60,
      daylightRequirement: 'mandatory',
      environmentalRestrictions: ['Active gas leak', 'High atmospheric toxins'],
      requiredResources: ['atmospheric_sensor'],
      crewRequirements: 1
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-safety-001',
      methodId: 'environment-safety',
      version: '1.0.0',
      entryNodeIds: ['s1'],
      nodes: [{ nodeId: 's1', nodeClass: 'verification', title: 'Atmospheric Check', description: 'Monitor for toxins and gas.', requiredEvidenceIds: [], requiredResources: ['atmospheric_sensor'] }],
      edges: []
    }
  },
  'forensic-photo-doc': {
    methodId: 'forensic-photo-doc',
    methodName: 'Forensic Photo Documentation Method',
    methodClass: 'insurance',
    version: '1.0.0',
    purpose: 'Evidence-first documentation for claims and compliance.',
    useCases: ['Claims support', 'Legal documentation', 'Compliance evidence'],
    requiredTools: ['High-res Camera', 'Scale/Reference Marker'],
    protectedSections: ['Chain of Custody', 'Tamper Verification'],
    workflowPhases: [],
    requiredEvidence: [],
    templateBindings: [],
    qaAcceptanceCriteria: { minimumEvidenceCount: 25, criticalPhotoRequirements: [], mandatorySectionsFilled: true },
    analysisProfile: {
      analysisObjectives: ['Provide immutable scene evidence', 'Scale verification', 'Verify temporal context'],
      expectedEvidencePatterns: ['Establishing-to-Detail progression', 'Standard scale reference'],
      contradictionRules: ['Scale mismatch', 'Lighting inconsistency (Shadow angle)'],
      confidenceConstraints: ['Metadata stripping', 'Low resolution'],
      escalationTriggers: ['Evidence tampering suspected', 'Inconsistent metadata'],
      qaFlags: ['Missing reference marker', 'Poor focal depth'],
      reportMappingHints: ['Forensic Evidence Gallery', 'Chain of Custody Log']
    },
    blockerProfile: {
      executionBlockers: ['Active crime scene lockout', 'Legal stay'],
      executionInhibitors: ['Material disturbance', 'Poor lighting condition'],
      evidenceInhibitors: ['Reflective surfaces', 'Object clutter', 'Incomplete framing'],
      confidenceReducers: ['Off-angle capture', 'Missing scale'],
      safetyStops: ['Suspected hazardous contaminants (Fentanyl/Bio)'],
      rescheduleTriggers: ['Equipment failure (Custom flash/lens)'],
      partialCompletionRules: ['Document "Disturbed Condition"', 'Mark as "Limited Visibility"'],
      overrideRequirements: ['Legal counsel supervision'],
      qaFailureFlags: ['Missing location establishing shot'],
      obstructionInhibitors: ['Fingerprints on lens', 'Object contamination (Inspector shadow)']
    },
    schedulingConstraints: {
      estimatedDurationMinutes: 120,
      requiredIRIThreshold: 75,
      daylightRequirement: 'preferred',
      environmentalRestrictions: [],
      requiredResources: ['forensic_kit'],
      crewRequirements: 1
    },
    guidanceHooks: [],
    workflowGraph: {
      graphId: 'g-foren-001',
      methodId: 'forensic-photo-doc',
      version: '1.0.0',
      entryNodeIds: ['f1'],
      nodes: [{ nodeId: 'f1', nodeClass: 'capture', title: 'Scene Capture', description: 'High-res documentation.', requiredEvidenceIds: [], requiredResources: ['forensic_kit'] }],
      edges: []
    }
  }
};

/**
 * Returns a method pack by ID. 
 * Falls back to general-property if not found (Migration Safety).
 */
export function getMethodPack(methodId: string): InspectionMethod {
  return METHOD_REGISTRY[methodId] || METHOD_REGISTRY['general-property'];
}
