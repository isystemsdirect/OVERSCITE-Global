/**
 * LARI Pipeline Engine — Context
 *
 * Enriches pipeline requests with session and domain context.
 * Wraps existing scing/lari/context/ modules into the pipeline facade.
 *
 * Canon constraints:
 * - Stateless per invocation (context is input, not stored).
 * - No tool execution, no database access, no governance authority.
 * - Returns enriched context; does NOT act on it.
 */

import type { LariPipelineRequest, LariStageTrace } from '../contracts';

// ---------------------------------------------------------------------------
// Context Output
// ---------------------------------------------------------------------------

export interface ContextEnrichment {
  /** Domain classification inferred from the request. */
  domain: 'inspection' | 'compliance' | 'reporting' | 'general';
  /** Keywords extracted for downstream engines. */
  keywords: string[];
  /** Session continuity summary (if history present). */
  sessionSummary: string;
  /** Any contextual warnings. */
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/**
 * Classify the domain of the request based on keyword presence.
 */
function classifyDomain(text: string): ContextEnrichment['domain'] {
  const lower = text.toLowerCase();
  if (lower.includes('inspect') || lower.includes('defect') || lower.includes('finding')) {
    return 'inspection';
  }
  if (lower.includes('code') || lower.includes('regulation') || lower.includes('compliance')) {
    return 'compliance';
  }
  if (lower.includes('report') || lower.includes('summary') || lower.includes('generate')) {
    return 'reporting';
  }
  return 'general';
}

/**
 * Extract significant keywords from text.
 */
function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'shall',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'and', 'or', 'not', 'but', 'if', 'then', 'this', 'that',
    'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w))
    .slice(0, 20);
}

/**
 * Summarize session history for downstream reasoning.
 */
function summarizeHistory(
  history?: Array<{ role: string; content: string }>
): string {
  if (!history || history.length === 0) return 'No prior conversation context.';
  const turns = history.length;
  const lastMsg = history[history.length - 1];
  return `${turns} prior turns. Last: [${lastMsg.role}] ${lastMsg.content.slice(0, 100)}`;
}

/**
 * Run the context enrichment engine.
 */
export function runContextEngine(
  request: LariPipelineRequest
): { enrichment: ContextEnrichment; trace: LariStageTrace } {
  const t0 = Date.now();

  const domain = classifyDomain(request.text);
  const keywords = extractKeywords(request.text);
  const sessionSummary = summarizeHistory(request.history);
  const warnings: string[] = [];

  if (!request.text || request.text.trim().length === 0) {
    warnings.push('EMPTY_INPUT_TEXT');
  }

  const enrichment: ContextEnrichment = {
    domain,
    keywords,
    sessionSummary,
    warnings,
  };

  return {
    enrichment,
    trace: {
      stage: 'context',
      engineId: 'lari-context',
      durationMs: Date.now() - t0,
      inputSummary: `text=${request.text.slice(0, 80)}`,
      outputSummary: `domain=${domain}, keywords=${keywords.length}`,
    },
  };
}
