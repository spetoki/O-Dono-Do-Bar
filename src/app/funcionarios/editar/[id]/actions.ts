
'use server';

import { z } from 'zod';
import type { User } from '@/types';

const userSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' }),
  password: z.string().min(3).optional().or(z.literal('')), // Optional, but if present, must be at least 3 chars
  role: z.enum(['admin', 'caixa'], { message: 'Função inválida.' }),
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
  errors?: {
    name?: string[];
    username?: string[];
    password?: string[];
    role?: string[];
  };
  userData?: z.infer<typeof userSchema>;
}

export async function updateUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = userSchema.safeParse({
      id: formData.get('id'),
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
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    // Return validated data to be saved on the client-side (localStorage)
    // The client will handle logic for updating password only if provided.
    return {
      message: 'Funcionário atualizado com sucesso!',
      isError: false,
      isSuccess: true,
      userData: validatedFields.data,
    };

  } catch (error) {
     console.error("Error in updateUser:", error);
     return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      isError: true,
      isSuccess: false,
    };
  }
}
