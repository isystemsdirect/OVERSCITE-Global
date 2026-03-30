/**
 * LARI-Language: Natural Language Understanding Engine
 *
 * Conforms to LariEngineContract handler signature.
 * This engine does NOT access tools or databases directly.
 */

import type { LariRequest, LariResponse, LariEngineContract } from './lariTypes';

interface Intent {
  action: string;
  entities: Record<string, unknown>;
  confidence: number;
}

function extractInspectionType(text: string): string {
  const types = ['roofing', 'electrical', 'plumbing', 'structural'];

  for (const type of types) {
    if (text.includes(type)) {
      return type;
    }
  }

  return 'general';
}

function classifyIntent(text: string): Intent {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('start') && lowerText.includes('inspection')) {
    return {
      action: 'start_inspection',
      entities: {
        inspection_type: extractInspectionType(lowerText),
      },
      confidence: 0.85,
    };
  }

  if (lowerText.includes('capture') || lowerText.includes('photo')) {
    return {
      action: 'capture_photo',
      entities: {},
      confidence: 0.9,
    };
  }

  if (lowerText.includes('code') || lowerText.includes('regulation')) {
    return {
      action: 'lookup_code',
      entities: {
        query: text,
      },
      confidence: 0.75,
    };
  }

  return {
    action: 'unknown',
    entities: {},
    confidence: 0.3,
  };
}

/**
 * LARI engine handler for natural language understanding.
 */
export async function languageHandler(request: LariRequest): Promise<LariResponse> {
  const t0 = Date.now();
  const intent = classifyIntent(request.text);

  return {
    engineId: 'lari-language',
    result: intent.action,
    data: { intent },
    confidence: intent.confidence,
    durationMs: Date.now() - t0,
    traceId: request.traceId,
  };
}

/** Legacy export preserved for backward compatibility. */
export async function understandIntent(text: string): Promise<Intent> {
  return classifyIntent(text);
}

/** Engine contract for registration. */
export const languageEngine: LariEngineContract = {
  id: 'lari-language',
  description: 'Natural language understanding for intent classification.',
  capability: 'language',
  handler: languageHandler,
};
