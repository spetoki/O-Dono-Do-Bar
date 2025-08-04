
'use server';

import { z } from 'zod';
import { users } from '@/data/users';
import type { User } from '@/types';

const loginSchema = z.object({
  username: z.string().min(1, 'O nome de usuário é obrigatório.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export interface FormState {
  message: string;
  isError: boolean;
  user?: User;
}

export async function loginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = loginSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Por favor, preencha todos os campos.',
        isError: true,
      };
    }
    
    const { username, password } = validatedFields.data;

    const user = users.find((u) => u.username === username);

    // In a real app, you would compare a hashed password.
    // This is for demonstration purposes ONLY.
    if (!user || user.password !== password) {
       return {
        message: 'Usuário ou senha inválidos.',
        isError: true,
      };
    }

    return {
      message: 'Login bem-sucedido!',
      isError: false,
      user: user,
    };

  } catch (error) {
     console.error("Login error:", error);
     return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      isError: true,
    };
  }
}
