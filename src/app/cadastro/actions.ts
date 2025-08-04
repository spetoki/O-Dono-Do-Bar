
'use server';

import { z } from 'zod';
import type { Product } from '@/types';
import { products as initialProducts } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  costPrice: z.coerce.number().positive({ message: 'O custo deve ser um número positivo.' }),
  price: z.coerce.number().positive({ message: 'O preço de venda deve ser um número positivo.' }),
  stock: z.coerce.number().int().min(0, { message: 'O estoque não pode ser negativo.' }),
  category: z.string().min(3, { message: 'A categoria deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
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
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            message: "Dados inválidos. Por favor, corrija os erros e tente novamente.",
            isError: true,
            isSuccess: false,
        };
    }

    const newProductData = validatedFields.data;

    const existingProducts: Product[] = []; // In a real app, you would fetch this.
    
    const isDuplicate = [...initialProducts, ...existingProducts].some(
        p => p.name.toLowerCase() === newProductData.name.toLowerCase()
    );

    if (isDuplicate) {
        return {
            message: 'Já existe um produto com este nome.',
            isError: true,
            isSuccess: false,
        };
    }
    
    // The client will handle adding the product to localStorage upon success.
    // We return a success state so the client-side can trigger the save.
    return {
      message: 'Produto cadastrado com sucesso!',
      isError: false,
      isSuccess: true,
    };

  } catch (error) {
     return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      isError: true,
      isSuccess: false,
    };
  }
}
