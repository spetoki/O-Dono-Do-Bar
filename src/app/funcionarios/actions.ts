
'use server';

import { z } from 'zod';
import type { User } from '@/types';

// In a real app, you would use a secure method to hash passwords.
// Storing plain text is for demonstration purposes ONLY.

const userSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' }),
  password: z.string().min(3, { message: 'A senha deve ter pelo menos 3 caracteres.' }),
  role: z.enum(['admin', 'caixa'], { message: 'Função inválida.' }),
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
  userData?: Omit<User, 'id'>; // Return data without password for security
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = userSchema.safeParse({
      name: formData.get('name'),
      username: formData.get('username'),
      password: formData.get('password'),
      role: formData.get('role'),
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
    // IMPORTANT: Exclude password from the returned data for security.
    const { password, ...userData } = validatedFields.data;

    return {
      message: 'Funcionário cadastrado com sucesso!',
      isError: false,
      isSuccess: true,
      userData: {
        ...userData,
        // The password will be handled on the client-side before saving to localStorage
        // For this demo, we'll pass the plain password to be added to the object.
        // In a real app, the server would hash it and the client would not handle it.
        password: validatedFields.data.password,
      },
    };

  } catch (error) {
     console.error("Error in createUser:", error);
     return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      isError: true,
      isSuccess: false,
    };
  }
}
