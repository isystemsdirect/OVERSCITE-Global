/**
 * @classification GOVERNANCE
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 *
 * @purpose
 * Formalizes the Explicit Execution-Trigger Doctrine.
 * Defines the approved lexicon that grants Scing the authority to execute UI 
 * mutations behind the panel.
 */

export const APPROVED_EXECUTION_TRIGGERS = [
  'go',
  'execute',
  'proceed',
  'confirm',
  'apply',
  'submit',
  'run'
];

export interface ExecutionTriggerAudit {
  detected: boolean;
  word?: string;
}

/**
 * Parses user input to ensure an approved trigger word exists.
 * Matches exact words bounded by whitespace or punctuation to prevent substring false-positives.
 */
export function detectExecutionTrigger(command: string): ExecutionTriggerAudit {
  if (!command) return { detected: false };

  // Normalize command for scanning
  const normalized = command.toLowerCase().trim();

  // Create boundary regex for the array of triggers
  const regexPattern = new RegExp(`\\b(${APPROVED_EXECUTION_TRIGGERS.join('|')})\\b`, 'i');
  
  const match = normalized.match(regexPattern);

  if (match) {
    return {
      detected: true,
      word: match[0].toLowerCase()
    };
  }

  return { detected: false };
}
