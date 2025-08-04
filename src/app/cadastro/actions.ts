
'use server';

import { z } from 'zod';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  costPrice: z.coerce.number().positive({ message: 'O custo deve ser um número positivo.' }),
  price: z.coerce.number().positive({ message: 'O preço de venda deve ser um número positivo.' }),
  stock: z.coerce.number().int().min(0, { message: 'O estoque não pode ser negativo.' }),
  category: z.string().min(3, { message: 'A categoria deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
  productData?: z.infer<typeof productSchema>;
}

export async function createProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = productSchema.safeParse({
      name: formData.get('name'),
      costPrice: formData.get('costPrice'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      category: formData.get('category'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
    });

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            message: "Dados inválidos. Por favor, corrija os erros e tente novamente.",
            isError: true,
            isSuccess: false,
        };
    }
    
    // Return validated data to be saved on the client-side (localStorage)
    return {
      message: 'Produto cadastrado com sucesso!',
      isError: false,
      isSuccess: true,
      productData: validatedFields.data,
    };

  } catch (error) {
     console.error("Error in createProduct:", error);
     return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      isError: true,
      isSuccess: false,
    };
  }
}
