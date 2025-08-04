
'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createProduct, type FormState } from '@/app/cadastro/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Save, X } from 'lucide-react';
import { products } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  price: z.coerce.number().positive({ message: 'O preço deve ser um número positivo.' }),
  stock: z.coerce.number().int().min(0, { message: 'O estoque não pode ser negativo.' }),
  category: z.string().min(3, { message: 'A categoria deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();

  const initialState: FormState = { message: '', isError: false, isSuccess: false };
  const [state, dispatch] = useFormState(createProduct, initialState);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
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
      const timer = setTimeout(() => {
        router.push('/estoque');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, toast, router]);

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
             formData.append(key, String(value));
        }
    });
    dispatch(formData);
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
          <CardDescription>Preencha os dados abaixo para cadastrar um novo item no estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cerveja Skol 350ml" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 3.50" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quantidade em Estoque</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Ex: 24" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                            <>
                                <Input list="category-list" placeholder="Ex: Bebidas" {...field} />
                                <datalist id="category-list">
                                    {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
                                </datalist>
                            </>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o produto..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Link href="/estoque" passHref>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Produto
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
