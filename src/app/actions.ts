
'use server';

import { wineRecommendation, type WineRecommendationInput, type WineRecommendationOutput } from '@/ai/flows/wine-recommendation';
import { z } from 'zod';

const wineRecommendationInputSchema = z.object({
  tastePreferences: z.string().min(3, { message: "Please describe your taste preferences in a bit more detail." }),
});

interface FormState {
  message: string;
  recommendation?: WineRecommendationOutput;
  isError: boolean;
}

export async function getWineRecommendation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = wineRecommendationInputSchema.safeParse({
    tastePreferences: formData.get('tastePreferences'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.tastePreferences?.[0] ?? "Invalid input.",
      isError: true,
    };
  }
  
  try {
    const result = await wineRecommendation(validatedFields.data);
    return {
      message: 'Here is your recommendation!',
      recommendation: result,
      isError: false,
    };
  } catch (error) {
    return {
      message: 'We had trouble getting a recommendation. Please try again later.',
      isError: true,
    };
  }
}
