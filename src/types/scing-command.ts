export type CommandIntentType = 'Navigate' | 'Search' | 'Analyze' | 'Act' | 'Summarize';

export interface ScingCommandContext {
  activeWorkspaceId?: string;
  activeThreadId?: string;
  currentRoute?: string;
  entityId?: string;
}

export interface ScingCommandInterpretation {
  command_type: CommandIntentType;
  intent: string;
  parameters: Record<string, unknown>;
  governance_required: boolean;
  required_permission?: string;
}

export interface ScingCommandPayload {
  raw_input: string;
  context: ScingCommandContext;
}

export interface ScingCommandResult {
  ok: boolean;
  action_taken: string;
  interpretation?: ScingCommandInterpretation;
  error?: string;
  data?: unknown;
}
