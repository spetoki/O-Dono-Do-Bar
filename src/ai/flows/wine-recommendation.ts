'use server';

/**
 * @fileOverview Provides wine recommendations based on customer taste preferences.
 *
 * - wineRecommendation - A function that provides wine recommendations.
 * - WineRecommendationInput - The input type for the wineRecommendation function.
 * - WineRecommendationOutput - The return type for the wineRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WineRecommendationInputSchema = z.object({
  tastePreferences: z
    .string()
    .describe('Customer taste preferences for wine, e.g., \'dry, fruity, oaky\'.'),
});
export type WineRecommendationInput = z.infer<typeof WineRecommendationInputSchema>;

const WineRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Wine recommendation based on taste preferences.'),
  reasoning: z.string().describe('Explanation of why the wine is recommended.'),
});
export type WineRecommendationOutput = z.infer<typeof WineRecommendationOutputSchema>;

export async function wineRecommendation(input: WineRecommendationInput): Promise<WineRecommendationOutput> {
  return wineRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wineRecommendationPrompt',
  input: {schema: WineRecommendationInputSchema},
  output: {schema: WineRecommendationOutputSchema},
  prompt: `You are an expert sommelier providing wine recommendations.

  Based on the customer's taste preferences, recommend a specific wine and explain why it matches their preferences.

  Taste Preferences: {{{tastePreferences}}}
  \n  Recommendation:`,
});

const wineRecommendationFlow = ai.defineFlow(
  {
    name: 'wineRecommendationFlow',
    inputSchema: WineRecommendationInputSchema,
    outputSchema: WineRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
