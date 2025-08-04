
'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createUser, type FormState } from '@/app/funcionarios/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Save, X, KeyRound, UserRound, CaseSensitive } from 'lucide-react';
import type { User } from '@/types';
import { users as initialUsers } from '@/data/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const userSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' }),
  password: z.string().min(3, { message: 'A senha deve ter pelo menos 3 caracteres.' }),
  role: z.enum(['admin', 'caixa'], { required_error: 'Por favor, selecione uma função.' }),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function NewUserPage() {
  const { toast } = useToast();
  const router = useRouter();

  const initialState: FormState = { message: '', isError: false, isSuccess: false };
  const [state, dispatch] = useActionState(createUser, initialState);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'caixa',
    },
  });

  useEffect(() => {
    if (state.message && !state.isSuccess) { 
      toast({
        title: state.isError ? 'Erro!' : 'Aviso',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }

    if (state.isSuccess && state.userData) {
        toast({
            title: 'Sucesso!',
            description: state.message,
        });

        const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        
        const isDuplicate = [...initialUsers, ...existingUsers].some(u => u.username === state.userData!.username);

        if (isDuplicate) {
            toast({
                title: 'Erro de Duplicidade',
                description: 'Já existe um funcionário com este nome de usuário.',
                variant: 'destructive',
            });
            // Reset success state to allow re-submission
            state.isSuccess = false;
            return;
        }

        const newUser: User = {
            ...state.userData,
            id: new Date().getTime(),
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        const timer = setTimeout(() => {
            router.push('/funcionarios');
        }, 1000);
        return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router, toast]);
  
  const onSubmit = (data: UserFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });
    dispatch(formData);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Funcionário</CardTitle>
          <CardDescription>Preencha os dados abaixo para cadastrar um novo usuário no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Ex: José da Silva" {...field} className="pl-8" />
                            <UserRound className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de Usuário</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Ex: josesilva" {...field} className="pl-8" />
                            <CaseSensitive className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                           <div className="relative">
                              <Input type="password" placeholder="••••••••" {...field} className="pl-8" />
                               <KeyRound className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="caixa">Caixa</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Link href="/funcionarios" passHref>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Funcionário
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
