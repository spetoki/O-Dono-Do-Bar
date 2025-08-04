
'use server';

import { z } from 'zod';

const customerSchema = z.object({
  id: z.number().optional(), // ID será gerado no cliente
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido. Use o formato 000.000.000-00.' }),
  phone: z.string().min(10, { message: 'Telefone inválido.' }),
  debt: z.number().optional(), // Dívida inicial é zero
});

export interface FormState {
  message: string;
  isError: boolean;
  isSuccess: boolean;
  customerData?: z.infer<typeof customerSchema>;
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
    return {
      message: "Dados inválidos. Por favor, corrija os erros e tente novamente.",
      isError: true,
      isSuccess: false,
    };
  }

  console.log('Novo cliente validado:', validatedFields.data);

  // Retornamos os dados validados para que o cliente possa salvá-los no localStorage
  return {
    message: 'Cliente cadastrado com sucesso!',
    isError: false,
    isSuccess: true,
    customerData: validatedFields.data,
  };
}
