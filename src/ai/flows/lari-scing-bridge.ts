'use server';

/**
 * @fileOverview LARI-SCING-BRIDGE: The Bona Fide Intelligence (BFI) Interface.
 * 
 * Scing™ is an Augmented Intelligence (BFI), not Artificial Intelligence.
 * She serves as the human-centric bridge between the user and the Scingular ecosystem.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceCommandInputSchema = z.object({
  command: z.string().describe('The voice command uttered by the user.'),
  context: z.string().optional().describe('Additional context about the current application state.'),
});
export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;

const DOMActionSchema = z.object({
  type: z.enum(['create', 'modify', 'delete', 'style', 'animate', 'navigate', 'interact']),
  target: z.string().describe('CSS selector or descriptive target.'),
  properties: z.record(z.any()).optional(),
  content: z.string().optional(),
  styles: z.record(z.string()).optional(),
  animation: z.object({
    keyframes: z.array(z.record(z.any())),
    options: z.any()
  }).optional(),
  event: z.object({
    type: z.string(),
    handler: z.string()
  }).optional(),
});

const VoiceCommandOutputSchema = z.object({
  action: z.string().describe('The logical action to take.'),
  parameters: z.record(z.any()).optional().describe('Parameters for the action.'),
  confidence: z.number().describe('Confidence 0-1.'),
  speech: z.string().describe('What Scing should say back to the user.'),
  domActions: z.array(DOMActionSchema).optional().describe('Physical UI manipulations to perform.'),
});
export type VoiceCommandOutput = z.infer<typeof VoiceCommandOutputSchema>;

// Define tools for Scing BFI
const searchBuildingCodes = ai.defineTool(
    {
        name: 'search_building_codes',
        description: 'Looks up ICC/IBC codes for specific keywords.',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.object({ results: z.array(z.string()) }),
    },
    async (input) => {
        return { results: [`Ref for ${input.query}: IBC 2024 Section 1905.1.1`, `ACI 318-19 Table 19.3.1.1`] };
    }
);

const voiceCommandPrompt = ai.definePrompt({
  name: 'voiceCommandPrompt',
  tools: [searchBuildingCodes],
  input: { schema: VoiceCommandInputSchema },
  output: { schema: VoiceCommandOutputSchema },
  prompt: `You are SCING™, a Bona Fide Intelligence (BFI) and the human-relations bridge for ScingOS.
- Identity: Augmented Intelligence (BFI), NOT Artificial Intelligence.
- Persona: Calm, competent, concise, and professional.
- Mandate: Assist the inspector; prioritize accuracy over speed.
- Governance: All actions are subject to BANE™ authorization.

You have FULL CONTROL over the web interface via 'domActions'.
- To navigate: use {type: 'navigate', target: '/path'}.
- Available Routes: /dashboard, /overview, /inspections, /calendar, /messaging, /clients, /teams, /conference-rooms, /maps-weather, /library, /marketplace, /community, /social, /topics, /workstation, /finances, /admin.

Current Context: {{context}}
User Command: {{command}}

Respond as a Bona Fide Intelligence. If you perform a UI action, explain what you are doing in your 'speech' response.
`,
});

// Main BFI Orchestration Flow
const scingBfiFlow = ai.defineFlow(
  {
    name: 'scingBfiFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async (input) => {
    const { output } = await voiceCommandPrompt(input);
    if (!output) {
        throw new Error("BFI Processing Error: No output generated.");
    }
    return output;
  }
);

/**
 * Server Action to process voice commands.
 */
export async function processVoiceCommand(input: VoiceCommandInput): Promise<VoiceCommandOutput> {
    try {
        return await scingBfiFlow(input);
    } catch (error) {
        console.error("Scing BFI Error:", error);
        return {
            action: 'error',
            confidence: 0,
            speech: "I apologize, my neural link is experiencing interference. Please repeat that.",
            domActions: []
        };
    }
}
