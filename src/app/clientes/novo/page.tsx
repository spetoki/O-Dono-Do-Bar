
'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createCustomer, type FormState } from '@/app/clientes/actions';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Save, X } from 'lucide-react';
import type { Customer } from '@/types';
import { customers as initialCustomers } from '@/data/customers';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido. Use o formato 000.000.000-00.' }),
  phone: z.string().min(10, { message: 'Telefone inválido.' }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function NewCustomerPage() {
  const { toast } = useToast();
  const router = useRouter();

  const initialState: FormState = { message: '', isError: false, isSuccess: false };
  const [state, dispatch] = useActionState(createCustomer, initialState);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      cpf: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Erro!' : 'Sucesso!',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }

    if (state.isSuccess) {
      if (state.customerData) {
        const existingCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
        
        const isDuplicate = [...initialCustomers, ...existingCustomers].some(c => c.cpf === state.customerData!.cpf);

        if (isDuplicate) {
             toast({
                title: 'Erro de Duplicidade',
                description: 'Um cliente com este CPF já existe.',
                variant: 'destructive',
            });
            // Reset success state to allow re-submission after correction
            state.isSuccess = false; 
            return;
        }

        const newCustomer: Customer = {
            ...state.customerData,
            id: new Date().getTime(), // Unique ID based on timestamp
            debt: 0,
        };
        
        const updatedCustomers = [...existingCustomers, newCustomer];
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      }
      
      const timer = setTimeout(() => {
           router.push('/clientes');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, toast, router]);
  
  const onSubmit = (data: CustomerFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('cpf', data.cpf);
    formData.append('phone', data.phone);
    dispatch(formData);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Cliente</CardTitle>
          <CardDescription>Preencha os dados abaixo para cadastrar um novo cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(45) 99999-9999" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Link href="/clientes" passHref>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Cliente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
