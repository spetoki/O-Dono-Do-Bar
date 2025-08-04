
'use client';

import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { loginUser, type FormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogIn, ShoppingCart } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'O nome de usuário é obrigatório.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, login, loading } = useAuth();
  
  const initialState: FormState = { message: '', isError: false };
  const [state, dispatch] = useActionState(loginUser, initialState);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (state.message) {
      if (state.isError) {
        toast({
            title: 'Erro de Login',
            description: state.message,
            variant: 'destructive',
        });
      }
    }
    if (state.user) {
        toast({
            title: 'Login bem-sucedido!',
            description: `Bem-vindo de volta, ${state.user.name}.`,
        });
        login(state.user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onSubmit = (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    dispatch(formData);
  };
  
  if (loading || user) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary">
          <ShoppingCart className="h-12 w-12 animate-pulse text-primary" />
        </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                 <ShoppingCart className="h-8 w-8" />
            </div>
          <CardTitle>O Dono Do Bar</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: yzidro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
