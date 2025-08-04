
'use server';

import { z } from 'zod';
import type { Product } from '@/types';
import { products as initialProducts } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  price: z.coerce.number().positive({ message: 'O preço deve ser um número positivo.' }),
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

    // This logic should be in the client-side useEffect, but since we are simulating it here:
    const existingProducts: Product[] = []; // In a real app, you would fetch this from localStorage on the client.
    
    const isDuplicate = [...initialProducts, ...existingProducts].some(
        p => p.name.toLowerCase() === validatedFields.data.name.toLowerCase()
    );

    if (isDuplicate) {
        return {
            message: 'Já existe um produto com este nome.',
            isError: true,
            isSuccess: false,
        };
    }
    
    // Create new product data (client-side would handle saving to localStorage)
    const newProduct: Product = {
      ...validatedFields.data,
      id: new Date().getTime(), // A simple unique ID
      description: validatedFields.data.description || '',
      imageUrl: 'https://placehold.co/200x200',
      dataAiHint: 'product',
    };

    console.log('Novo produto validado (simulação de salvamento):', newProduct);
    
    // We can't directly manipulate localStorage here as it's a server action.
    // The client will handle adding the product to localStorage upon success.
    // We return a success state so the client-side can trigger the save.
    // For now, let's just log it and return success.

    // A better approach for this demo: let's just return success
    // and the client side `useEffect` on `NewProductPage` will handle redirection.
    // The actual storage will be handled by the `InventoryPage` reading from localStorage
    // after the user adds a product via the form, which submits to this action,
    // and upon success, the client `NewProductPage` will add to localStorage.
    // Whoops, actions cannot return data to the client that easily with useFormState.
    // Let's do the localstorage logic on the client instead.

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
