
'use server';

/**
 * @fileOverview Fornece recomendações de produtos com base nas preferências de gosto do cliente.
 *
 * - productRecommendation - Uma função que fornece recomendações de produtos.
 * - ProductRecommendationInput - O tipo de entrada para a função productRecommendation.
 * - ProductRecommendationOutput - O tipo de retorno para a função productRecommendation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationInputSchema = z.object({
  tastePreferences: z
    .string()
    .describe('Preferências de gosto do cliente para bebidas ou tabaco, ex: \'amargo, frutado, suave\'.'),
});
export type ProductRecommendationInput = z.infer<typeof ProductRecommendationInputSchema>;

const ProductRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Recomendação de produto com base nas preferências de gosto.'),
  reasoning: z.string().describe('Explicação de por que o produto é recomendado.'),
});
export type ProductRecommendationOutput = z.infer<typeof ProductRecommendationOutputSchema>;

export async function productRecommendation(input: ProductRecommendationInput): Promise<ProductRecommendationOutput> {
  return productRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationPrompt',
  input: {schema: ProductRecommendationInputSchema},
  output: {schema: ProductRecommendationOutputSchema},
  prompt: `Você é um especialista em bebidas e produtos de tabacaria.

  Com base nas preferências de gosto do cliente, recomende um produto específico (cerveja, refrigerante, tabaco, etc.) e explique por que ele corresponde às preferências.

  Preferências de Gosto: {{{tastePreferences}}}
  \n  Recomendação:`,
});

const productRecommendationFlow = ai.defineFlow(
  {
    name: 'productRecommendationFlow',
    inputSchema: ProductRecommendationInputSchema,
    outputSchema: ProductRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
