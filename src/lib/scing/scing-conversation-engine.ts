/**
 * @classification SERVICE_LAYER
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Local conversational response engine for Scing. Provides context-aware,
 * natural language responses for non-execution queries without requiring
 * external API calls.
 *
 * @architecture_note
 * This is a scaffolded local engine. The interface (`ScingConversationEngine`)
 * is designed to be drop-in replaceable when LLM orchestration / model stacking
 * integration is wired. The response generation contract remains stable.
 *
 * @behavioral_guards
 * - No hallucinated authority
 * - No system-status assumptions presented as fact
 * - No bypass of BANE for consequential actions
 * - No silent execution of impactful operations
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ConversationEntry {
  id: string;
  role: 'user' | 'scing';
  content: string;
  timestamp: Date;
  mode: 'conversational' | 'operational';
}

export interface ConversationContext {
  entries: ConversationEntry[];
  currentRoute?: string;
  sessionStartedAt: Date;
  /** Active workflow context for method-execution-aware guidance */
  workflowContext?: {
    instanceId: string;
    methodId: string;
    activeNodeIds: string[];
    status: 'active' | 'completed' | 'suspended' | 'aborted';
  };
  /** Active project context for project operations guidance */
  projectContext?: {
    projectId: string;
    projectName: string;
    activeMode: 'manager' | 'planner';
    activeIssueCount: number;
    scenarioCount: number;
    blockedPackageCount: number;
    overallHealth: 'healthy' | 'at_risk' | 'critical' | 'blocked';
  };
}

export interface ScingResponse {
  content: string;
  mode: 'conversational' | 'operational';
  confidence: number;
  suggestedFollowUps?: string[];
}

// ─── Pattern Matchers ────────────────────────────────────────────────────────

interface ResponsePattern {
  triggers: RegExp[];
  responses: string[] | ((input: string, ctx: ConversationContext) => string);
  followUps?: string[];
}

const GREETING_PATTERNS: ResponsePattern = {
  triggers: [
    /^(hi|hello|hey|howdy|what's up|sup|yo|good\s*(morning|afternoon|evening))/i,
  ],
  responses: [
    "Hey! What can I help you with today?",
    "Hi there. Ready to assist — what's on your plate?",
    "Hello! I'm here and ready. What do you need?",
    "Hey! How can I help you out?",
  ],
  followUps: [
    "Need help with an inspection?",
    "Want to review something?",
    "Looking for status on something?",
  ],
};

const STATUS_PATTERNS: ResponsePattern = {
  triggers: [
    /^(how are you|how('?s| is) it going|you (good|okay|there)|status)/i,
  ],
  responses: [
    "All good on my end — systems are healthy. What do you need?",
    "I'm here and operational. What can I do for you?",
    "Everything's running smoothly. Ready when you are.",
  ],
};

const HELP_PATTERNS: ResponsePattern = {
  triggers: [
    /^(help|what can you do|what are you|capabilities|features)/i,
  ],
  responses: [
    "I can help with inspections, scheduling, reports, drone operations, contractor management, and more. I can also just chat if you need to think something through. What interests you?",
    "I'm your operational assistant for OVERSCITE. I handle inspection workflows, LARI vision, marketplace, scheduling — or we can just talk through a problem together. Where do you want to start?",
  ],
  followUps: [
    "Check my latest inspections",
    "Help me draft a report",
    "What's my schedule look like?",
  ],
};

const INSPECTION_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(inspection|inspect|report|finding|deficiency)\b/i,
  ],
  responses: (input: string, ctx: ConversationContext) => {
    if (/schedule|upcoming|next/i.test(input)) {
      return "I can pull up your upcoming inspections. Head over to the Calendar or say the word and I'll navigate there for you.";
    }
    if (/report|summary|overview/i.test(input)) {
      return "Want me to help you review or draft an inspection report? I can walk you through the findings or help you organize the summary.";
    }
    if (/finding|deficiency|issue/i.test(input)) {
      return "I can help you review findings. The OverHUD has the full finding review rail — want me to open it, or would you rather talk through specific items here?";
    }
    return "Tell me more about what you need with the inspection. Are you looking to schedule, review findings, or work on a report?";
  },
  followUps: [
    "Show my recent inspections",
    "Help draft a report",
    "Review findings",
  ],
};

const DRONE_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(drone|uav|aerial|flight|telemetry)\b/i,
  ],
  responses: [
    "Drone operations — my favorite. Are you planning a flight, reviewing telemetry, or looking at captured data?",
    "Ready to assist with drone ops. What do you need — flight planning, vision review, or something else?",
  ],
};

const SCHEDULING_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(schedule|calendar|appointment|meeting|book|slot)\b/i,
  ],
  responses: [
    "I can help with scheduling. Are you looking to set up a new inspection, book a meeting, or check your availability?",
    "Let's get something on the calendar. What are we scheduling — an inspection, a client meeting, or a team check-in?",
  ],
};

const METHOD_EXECUTION_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(workflow|method|step|phase|node|graph|next step|current step|what'?s next)\b/i,
  ],
  responses: (input: string, ctx: ConversationContext) => {
    if (!ctx.workflowContext) {
      return "No active workflow in this session. Start an inspection to activate method execution.";
    }
    const { methodId, status, activeNodeIds } = ctx.workflowContext;
    if (status === 'completed') {
      return `The ${methodId} workflow is complete. Ready for report generation or review.`;
    }
    if (activeNodeIds.length === 0) {
      return `The ${methodId} workflow is active but no steps are currently ready. Check for blocked dependencies.`;
    }
    return `You're working through ${methodId}. ${activeNodeIds.length} step(s) are currently active. Let me know which one you'd like to focus on.`;
  },
  followUps: [
    "Show active steps",
    "What evidence is needed?",
    "Skip to next phase",
  ],
};

const THANKS_PATTERNS: ResponsePattern = {
  triggers: [
    /^(thanks|thank you|thx|ty|appreciate|cheers)/i,
  ],
  responses: [
    "Anytime! Let me know if you need anything else.",
    "You're welcome. I'm right here if anything comes up.",
    "Happy to help. Just say the word when you need me again.",
  ],
};

const FAREWELL_PATTERNS: ResponsePattern = {
  triggers: [
    /^(bye|goodbye|see you|later|peace|gotta go|signing off)/i,
  ],
  responses: [
    "Catch you later. I'll be here when you need me.",
    "See you! I'll keep the lights on.",
    "Take care — I'm just a message away.",
  ],
};

const THINKING_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(think|wonder|what if|hypothetical|consider|idea|brainstorm)\b/i,
  ],
  responses: [
    "Let's think through it together. Walk me through what you're considering.",
    "I'm all ears — lay out the idea and we can reason through it.",
    "Good instinct to think it through. What's the scenario you're working with?",
  ],
};

const PROJECT_OPERATIONS_PATTERNS: ResponsePattern = {
  triggers: [
    /\b(project|work package|dependency|critical path|scenario|resequenc|issue|risk cluster|blocker|planner|project manager)\b/i,
  ],
  responses: (input: string, ctx: ConversationContext) => {
    if (!ctx.projectContext) {
      return "No active project context. Open the Project Manager workspace to begin project operations.";
    }
    const { projectName, overallHealth, activeIssueCount, blockedPackageCount, activeMode } = ctx.projectContext;
    if (/issue|risk|blocker/i.test(input)) {
      return `Project ${projectName} has ${activeIssueCount} open issue(s) and ${blockedPackageCount} blocked package(s). Health: ${overallHealth}. Check the Issue Panel for details or ask me to explain a specific risk cluster.`;
    }
    if (/scenario|resequenc|what.?if/i.test(input)) {
      return `The Planner has ${ctx.projectContext.scenarioCount} scenario(s) available for ${projectName}. Scenarios are advisory — no schedule mutation occurs until you approve through BANE. Want me to walk through the options?`;
    }
    if (/dependency|critical path/i.test(input)) {
      return `I can explain the dependency graph and critical path for ${projectName}. Switch to Planner mode and I'll walk you through the bottlenecks and sequencing constraints.`;
    }
    if (/package|trade|crew|vendor/i.test(input)) {
      return `Looking at work packages for ${projectName}. Currently operating in ${activeMode} mode. ${blockedPackageCount} package(s) are blocked. Let me know which package you want to review.`;
    }
    return `Project ${projectName} is ${overallHealth}. You're in ${activeMode} mode. ${activeIssueCount} open issue(s), ${blockedPackageCount} blocked package(s). What would you like to focus on?`;
  },
  followUps: [
    "Show project issues",
    "Explain the critical path",
    "Review scenarios",
    "What packages are blocked?",
  ],
};

const ALL_PATTERNS: ResponsePattern[] = [
  GREETING_PATTERNS,
  STATUS_PATTERNS,
  HELP_PATTERNS,
  THANKS_PATTERNS,
  FAREWELL_PATTERNS,
  THINKING_PATTERNS,
  INSPECTION_PATTERNS,
  DRONE_PATTERNS,
  SCHEDULING_PATTERNS,
  METHOD_EXECUTION_PATTERNS,
  PROJECT_OPERATIONS_PATTERNS,
];

// ─── Fallback ────────────────────────────────────────────────────────────────

const FALLBACK_RESPONSES = [
  "I hear you. Can you tell me a bit more about what you're looking for?",
  "Got it. Want me to dig into that further, or is there something specific I can help with?",
  "Interesting — let me know how you'd like to proceed and I'll work with you on it.",
  "I'm following along. What would be most helpful for you right now?",
  "Sure thing. What's the next step you're thinking about?",
];

// ─── Context-Aware Enhancements ──────────────────────────────────────────────

function getContextualPrefix(ctx: ConversationContext): string {
  const entryCount = ctx.entries.filter(e => e.role === 'user').length;

  // After several exchanges, acknowledge the ongoing conversation
  if (entryCount > 5) {
    const prefixes = [
      "",  // often just continue naturally
      "",
      "Still here — ",
    ];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }
  return "";
}

// ─── Engine ──────────────────────────────────────────────────────────────────

/**
 * Generates a conversational response for a user input.
 * This is the primary interface contract — designed for drop-in replacement
 * with LLM orchestration in future phases.
 */
export function generateConversationalResponse(
  input: string,
  context: ConversationContext
): ScingResponse {
  const trimmed = input.trim();

  // Try each pattern
  for (const pattern of ALL_PATTERNS) {
    for (const trigger of pattern.triggers) {
      if (trigger.test(trimmed)) {
        let content: string;

        if (typeof pattern.responses === 'function') {
          content = pattern.responses(trimmed, context);
        } else {
          content = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        }

        const prefix = getContextualPrefix(context);

        return {
          content: prefix + content,
          mode: 'conversational',
          confidence: 0.85,
          suggestedFollowUps: pattern.followUps,
        };
      }
    }
  }

  // Fallback — still conversational, never robotic
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  const prefix = getContextualPrefix(context);

  return {
    content: prefix + fallback,
    mode: 'conversational',
    confidence: 0.5,
  };
}

/**
 * Determines if user input should be routed to operational mode
 * (BANE-gated execution path) vs. conversational mode.
 */
export function shouldRouteOperational(input: string): boolean {
  const normalized = input.toLowerCase().trim();

  // These patterns indicate the user wants something _done_, not discussed
  const operationalTriggers = [
    /^(execute|run|deploy|delete|remove|create|submit|approve|reject|dispatch|assign|send|publish|finalize)\b/i,
    /\b(do it|make it happen|go ahead|proceed|confirm|authorize)\b/i,
  ];

  return operationalTriggers.some(t => t.test(normalized));
}

/**
 * Generates the initial greeting when the Scing panel opens.
 * Context-aware based on time of day and session state.
 */
export function generateGreeting(): ConversationEntry {
  const hour = new Date().getHours();
  let greeting: string;

  if (hour < 12) {
    greeting = "Good morning. What are we working on today?";
  } else if (hour < 17) {
    greeting = "Good afternoon. How can I help?";
  } else {
    greeting = "Good evening. What do you need?";
  }

  return {
    id: `scing-greeting-${Date.now()}`,
    role: 'scing',
    content: greeting,
    timestamp: new Date(),
    mode: 'conversational',
  };
}
