
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido. Use o formato 000.000.000-00.' }),
  phone: z.string().min(10, { message: 'Telefone inválido.' }),
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
}

export async function createCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = customerSchema.safeParse({
    name: formData.get('name'),
    cpf: formData.get('cpf'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    // A validação do formulário no lado do cliente com useForm deve pegar isso primeiro,
    // mas mantemos a validação no servidor por segurança.
    return {
      message: "Dados inválidos. Por favor, corrija os erros e tente novamente.",
      isError: true,
      isSuccess: false,
    };
  }

  // Lógica para salvar o cliente (simulação)
  // Em uma aplicação real, aqui você faria a chamada para o seu banco de dados.
  console.log('Novo cliente a ser salvo:', validatedFields.data);

  // Como não temos um banco de dados, vamos simular o sucesso e redirecionar.
  // Em caso de erro ao salvar, você retornaria uma mensagem de erro.
  // ex: return { message: 'Não foi possível salvar o cliente.', isError: true };

  // Em vez de redirecionar aqui, retornamos um estado de sucesso.
  return {
    message: 'Cliente cadastrado com sucesso!',
    isError: false,
    isSuccess: true,
  };
}
