import { SplashCardSchema } from "@/types/guidance";

export interface GuidanceEntry {
  id: string;
  tooltip: string; // <= 120 chars
  splashCard: SplashCardSchema;
  scingPrompt: string; // Prompt injected into Scing
}


export const GUIDANCE_REGISTRY: Record<string, GuidanceEntry> = {
  'scing-panel': {
    id: 'scing-panel',
    tooltip: 'Your conversational interface to OVERSCITE. Ask questions, issue commands, review responses.',
    splashCard: {
      whatItIs: 'The live conversational surface for interacting with the SCINGULAR ecosystem.',
      whatItDoes: 'Interprets your intent, provides context-aware assistance, answers operational questions, and routes commands to LARI engines.',
      whatItDoesNotDo: 'It does not make decisions on your behalf, self-act, or execute actions autonomously. The user retains control.',
      whyItMatters: 'It bridges the gap between what you need to achieve and the complex systems that execute the work, keeping you in full control.'
    },
    scingPrompt: 'Explain the Scing Panel in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'overhud': {
    id: 'overhud',
    tooltip: 'Passive intelligence panel showing security status, system health, and BANE enforcement activity.',
    splashCard: {
      whatItIs: 'The Operational Verification Heads-Up Display for passive system monitoring.',
      whatItDoes: 'Displays real-time security events, BANE policy decisions, threat levels, and module health in an organized, non-intrusive flyout.',
      whatItDoesNotDo: 'It does not accept user commands, interpret conversational intent, self-act, or execute workflows.',
      whyItMatters: 'It provides immediate peripheral awareness of system integrity and audit activity without interrupting your primary workflow.'
    },
    scingPrompt: 'Explain the OverHUD in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'environment-safety': {
    id: 'environment-safety',
    tooltip: 'Real-time atmospheric intelligence and inspection risk assessment for field operations.',
    splashCard: {
      whatItIs: 'A consolidated dashboard for environmental telemetry and risk modeling.',
      whatItDoes: 'Aggregates weather data, calculates the Inspection Risk Index (IRI), models surface temperatures, and determines the Guangel Safety Strip classification.',
      whatItDoesNotDo: 'It does not automatically cancel inspections, self-act, reroute vehicles, or lock out your ability to perform an inspection.',
      whyItMatters: 'It arms you with localized, defensible environmental data so you can make informed decisions about field deployment safety.'
    },
    scingPrompt: 'Explain the Environment & Safety module in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'weather-command': {
    id: 'weather-command',
    tooltip: 'Live weather data, IRI risk scoring, roof temperature modeling, and safety classification.',
    splashCard: {
      whatItIs: 'The hyper-local atmospheric tracking component of the Environment & Safety module.',
      whatItDoes: 'Provides current conditions, minute-by-minute forecasting, live radar tracking, and targeted environmental risk feeds.',
      whatItDoesNotDo: 'It does not override BANE enforcement policies or change the truth-state of existing data records. Data is informational unless approved.',
      whyItMatters: 'It transitions weather from a standalone app into a fully integrated dimension of your operational intelligence.'
    },
    scingPrompt: 'Explain Weather Command in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'locations-overscite': {
    id: 'locations-overscite',
    tooltip: 'Geospatial intelligence surface with seven toggleable operational map layers.',
    splashCard: {
      whatItIs: 'A map-based workspace integrating physical coordinates with OVERSCITE relational data.',
      whatItDoes: 'Visualizes the near real-time position of clients, inspections, devices, team members, weather hazards, and operational boundaries.',
      whatItDoesNotDo: 'It does not continuously track personnel without explicit device permission, nor does it automatically geofence inspection completions.',
      whyItMatters: 'It provides crucial spatial context, allowing managers and operators to see the physical proximity of their live operations and potential risks.'
    },
    scingPrompt: 'Explain Locations OverSCITE in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'inspections': {
    id: 'inspections',
    tooltip: 'Core workflow surface for managing, documenting, and authorizing field compliance inspections.',
    splashCard: {
      whatItIs: 'The tactical engine for conducting structural and safety audits.',
      whatItDoes: 'Guides you through the seven-stage lifecycle: Create, Configure, Capture, Analyze, Report, Authorize, and Deliver.',
      whatItDoesNotDo: 'It does not generate findings autonomously or allow submission of non-auditable records without human signature. Data is informational unless approved.',
      whyItMatters: 'It ensures maximum defensibility and compliance through BANE-governed progression and immutability controls.'
    },
    scingPrompt: 'Explain the Inspections Module in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'action-approval': {
    id: 'action-approval',
    tooltip: 'All consequential actions require your explicit approval before execution; you retain control.',
    splashCard: {
      whatItIs: 'The final human gate in the SCINGULAR authority model.',
      whatItDoes: 'Presents AI-generated computations, reports, and risk scores for your mandatory review and cryptographic signature.',
      whatItDoesNotDo: 'It does not allow the system to self-authorize, self-act, automatically approve findings, or skip the human review phase.',
      whyItMatters: 'It legally and operationally anchors accountability to the licensed professional, not the assisting algorithms.'
    },
    scingPrompt: 'Explain Action Approvals in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'truth-states': {
    id: 'truth-states',
    tooltip: 'Truth states represent data maturity: live, partial, mock, candidate, accepted, blocked, archived.',
    splashCard: {
      whatItIs: 'The systemic UI labeling convention that defines the authenticity and maturity of data.',
      whatItDoes: 'Explicitly marks whether you are viewing live operational data, structural scaffolding, synthetic mocks, or unapproved AI drafts.',
      whatItDoesNotDo: 'It does not attempt to disguise unfinished features or present AI suggestions as absolute facts.',
      whyItMatters: 'It enforces complete honesty about system capabilities, ensuring you never rely on placeholder data for consequential decisions.'
    },
    scingPrompt: 'Explain Truth States in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'contractor-division': {
    id: 'contractor-division',
    tooltip: 'Manage compliance, licensing, and hierarchical relationships for third-party operations.',
    splashCard: {
      whatItIs: 'The governance module for bringing third-party vendors into the OVERSCITE audit perimeter.',
      whatItDoes: 'Tracks credentials, identifies prime/sub relationships, enforces compliance requirements, and validates insurance records.',
      whatItDoesNotDo: 'It does not allow subordinate compliance inheritance—each contractor node must be independently verified.',
      whyItMatters: 'It protects the operation from cascading liability by ensuring strict adherence to vendor qualification policies.'
    },
    scingPrompt: 'Explain the Contractor Division in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  },
  'smart-scheduler': {
    id: 'smart-scheduler',
    tooltip: 'Weather-aware scheduling intelligence capable of proposing optimized deployment logistics.',
    splashCard: {
      whatItIs: 'The foundational calendar and resource allocation engine of the platform.',
      whatItDoes: 'Analyzes travel times, weather risks (IRI), and operator availability to propose optimal scheduling windows.',
      whatItDoesNotDo: 'It does not autonomously book, cancel, self-act, or dispatch personnel without an operator explicitly confirming the action.',
      whyItMatters: 'It drastically reduces logistical friction while ensuring human operators retain total control over the operational tempo.'
    },
    scingPrompt: 'Explain the Smart Scheduler in OVERSCITE:\n- what it is\n- what it does\n- what it does not do\n- why it matters'
  }
};
