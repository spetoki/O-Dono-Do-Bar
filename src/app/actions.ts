
'use server';

import { productRecommendation, type ProductRecommendationInput, type ProductRecommendationOutput } from '@/ai/flows/product-recommendation';
import { z } from 'zod';

const productRecommendationInputSchema = z.object({
  tastePreferences: z.string().min(3, { message: "Por favor, descreva suas preferências com um pouco mais de detalhe." }),
});

interface FormState {
  message: string;
  recommendation?: ProductRecommendationOutput;
  isError: boolean;
}

export async function getProductRecommendation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = productRecommendationInputSchema.safeParse({
    tastePreferences: formData.get('tastePreferences'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.tastePreferences?.[0] ?? "Entrada inválida.",
      isError: true,
    };
  }
  
  try {
    const result = await productRecommendation(validatedFields.data);
    return {
      message: 'Aqui está a sua recomendação!',
      recommendation: result,
      isError: false,
    };
  } catch (error) {
    return {
      message: 'Tivemos problemas para obter uma recomendação. Por favor, tente novamente mais tarde.',
      isError: true,
    };
  }
}
