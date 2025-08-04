
'use server';

import { z } from 'zod';
import type { Product } from '@/types';
// Note: We're not using initialProducts for validation anymore to avoid duplicates with localStorage
// import { products as initialProducts } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  costPrice: z.coerce.number().positive({ message: 'O custo deve ser um número positivo.' }),
  price: z.coerce.number().positive({ message: 'O preço de venda deve ser um número positivo.' }),
  stock: z.coerce.number().int().min(0, { message: 'O estoque não pode ser negativo.' }),
  category: z.string().min(3, { message: 'A categoria deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(), // imageUrl can be a data URL
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
}

// This function is not exported because it will be called by the server action
// and should not be directly exposed to the client.
// In a real app, this would be a database call.
async function getProductsFromStorage(): Promise<Product[]> {
    // This is a placeholder. In a real app, you'd fetch from a database.
    // For this demo, we can't access localStorage on the server.
    // The client will handle checking for duplicates before submitting if needed,
    // or the server can receive the full list for validation.
    return [];
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

    const newProductData = validatedFields.data;

    // Server-side duplicate check is complex without a database.
    // The client-side logic should handle preventing obvious duplicates.
    // We are trusting the client validation for now.

    const newProduct: Product = {
        ...newProductData,
        id: new Date().getTime(),
        imageUrl: newProductData.imageUrl || 'https://placehold.co/200x200', // fallback
        dataAiHint: 'product',
    };
    
    // NOTE: This approach is for demonstration purposes.
    // Server Actions can't directly manipulate client-side localStorage.
    // The client-side code (`useEffect` in the form) will listen for `isSuccess`
    // and then perform the localStorage operation with the complete product data.
    // To make this work, we need to pass the new product data back to the client.
    // However, for simplicity and to avoid sending a large image data URL back and forth,
    // we'll let the client construct the final object.
    
    // The client now handles creating the product object and saving to localStorage.
    return {
      message: 'Produto cadastrado com sucesso!',
      isError: false,
      isSuccess: true,
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
