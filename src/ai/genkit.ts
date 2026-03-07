import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import * as dotprompt from '@genkit-ai/dotprompt';

export const ai = genkit({
  plugins: [
    googleAI({
        apiKey: process.env.GEMINI_API_KEY,
    }),
    dotprompt.dotprompt(),
  ],
  model: 'googleai/gemini-1.5-flash',
});
