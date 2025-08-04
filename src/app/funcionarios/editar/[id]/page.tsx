
'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { updateUser, type FormState } from './actions';
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
import { Skeleton } from '@/components/ui/skeleton';


const userSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' }),
  password: z.string().optional(), // Not required
  role: z.enum(['admin', 'caixa'], { required_error: 'Por favor, selecione uma função.' }),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initialState: FormState = { message: '', isError: false, isSuccess: false };
  const [state, dispatch] = useActionState(updateUser, initialState);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (!userId) return;

    const allUsers = [...initialUsers, ...JSON.parse(localStorage.getItem('users') || '[]')];
    const userToEdit = allUsers.find(u => u.id === userId);

    if (userToEdit) {
        setUser(userToEdit);
        form.reset({
            ...userToEdit,
            password: '', // Never pre-fill password
        });
    } else {
        toast({ title: 'Erro', description: 'Funcionário não encontrado.', variant: 'destructive' });
        router.push('/funcionarios');
    }
    setLoading(false);
  }, [userId, form, router, toast]);


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

        // Update in localStorage
        const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        
        const isDuplicate = [...initialUsers, ...storedUsers].some(
            u => u.username === state.userData!.username && u.id !== state.userData!.id
        );

        if (isDuplicate) {
            toast({
                title: 'Erro de Duplicidade',
                description: 'Já existe um funcionário com este nome de usuário.',
                variant: 'destructive',
            });
            state.isSuccess = false;
            return;
        }

        const updatedUsers = storedUsers.map(u => {
            if (u.id === state.userData!.id) {
                const updatedUser = { ...u, ...state.userData };
                // Only update password if a new one was provided
                if (!state.userData.password) {
                    delete updatedUser.password;
                }
                return updatedUser;
            }
            return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Also update the initialUsers if it's one of them
        const initialUserIndex = initialUsers.findIndex(u => u.id === state.userData!.id);
        if (initialUserIndex > -1) {
            const updatedUser = { ...initialUsers[initialUserIndex], ...state.userData };
            if (!state.userData.password) {
              updatedUser.password = initialUsers[initialUserIndex].password;
            }
            Object.assign(initialUsers[initialUserIndex], updatedUser);
        }

        const timer = setTimeout(() => {
            router.push('/funcionarios');
        }, 1000);
        return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router, toast]);

   if (loading) {
    return (
       <div className="mx-auto max-w-2xl">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardContent>
        </Card>
       </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Editar Funcionário</CardTitle>
          <CardDescription>Atualize os dados do funcionário. Deixe a senha em branco para não alterá-la.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={dispatch} className="space-y-4">
               <FormField name="id" control={form.control} render={({ field }) => <Input type="hidden" {...field} />} />

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
                        <FormLabel>Nova Senha (Opcional)</FormLabel>
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
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
