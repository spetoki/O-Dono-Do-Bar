
'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { updateProduct, type FormState } from '@/app/estoque/editar/[id]/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Save, X, Percent, Upload, Barcode } from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const productSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  barcode: z.string().optional(),
  costPrice: z.coerce.number().positive({ message: 'O custo deve ser um número positivo.' }),
  profitMargin: z.coerce.number().min(0, { message: 'A margem de lucro não pode ser negativa.'}),
  price: z.coerce.number().positive({ message: 'O preço de venda deve ser positivo.' }),
  stock: z.coerce.number().int().min(0, { message: 'O estoque não pode ser negativo.' }),
  category: z.string().min(3, { message: 'A categoria deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  image: z.any().optional(),
  imageUrl: z.string().optional(), // Used to hold existing image url
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const initialState: FormState = { message: '', isError: false, isSuccess: false };
  const [state, dispatch] = useActionState(updateProduct, initialState);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });
  
  useEffect(() => {
    if (!productId) return;
    
    const allProducts = [...initialProducts, ...JSON.parse(localStorage.getItem('products') || '[]')];
    const productToEdit = allProducts.find(p => p.id === productId);

    if (productToEdit) {
      setProduct(productToEdit);
      const profitMargin = productToEdit.costPrice && productToEdit.price > productToEdit.costPrice
        ? ((productToEdit.price / productToEdit.costPrice) - 1) * 100
        : 0;

      form.reset({
        ...productToEdit,
        costPrice: productToEdit.costPrice || 0,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
      });
      setImagePreview(productToEdit.imageUrl);
    } else {
        toast({ title: 'Erro', description: 'Produto não encontrado.', variant: 'destructive' });
        router.push('/estoque');
    }
    setLoading(false);
  }, [productId, form, router, toast]);

  const costPrice = form.watch('costPrice');
  const profitMargin = form.watch('profitMargin');
  const price = form.watch('price');
  const imageFile = form.watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);


  // Calculate price when cost or margin changes
  useEffect(() => {
    if (form.getFieldState('price').isDirty) return;

    const cost = parseFloat(String(costPrice)) || 0;
    const margin = parseFloat(String(profitMargin)) || 0;
    if (cost > 0) {
      const finalPrice = cost * (1 + margin / 100);
      form.setValue('price', parseFloat(finalPrice.toFixed(2)));
    } else {
      form.setValue('price', 0);
    }
  }, [costPrice, profitMargin, form]);

  // Calculate margin when price or cost changes
  useEffect(() => {
     if (form.getFieldState('profitMargin').isDirty && !form.getFieldState('price').isDirty) return;

    const cost = parseFloat(String(costPrice)) || 0;
    const finalPrice = parseFloat(String(price)) || 0;
    if (cost > 0 && finalPrice > cost) {
      const margin = ((finalPrice / cost) - 1) * 100;
      form.setValue('profitMargin', parseFloat(margin.toFixed(2)));
    } else {
      form.setValue('profitMargin', 0);
    }
  }, [price, costPrice, form]);

  useEffect(() => {
    if (state.message && !state.isSuccess) { // Only show toast on error
      toast({
        title: state.isError ? 'Erro!' : 'Aviso',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }

    if (state.isSuccess && state.productData) {
        toast({
            title: 'Sucesso!',
            description: state.message,
        });

        // Update in localStorage
        const storedProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
        const updatedProducts = storedProducts.map(p => 
            p.id === state.productData!.id ? { ...p, ...state.productData, dataAiHint: 'product' } : p
        );
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        // Also update the initialProducts if it's one of them (for demo purposes)
        const initialProductIndex = initialProducts.findIndex(p => p.id === state.productData!.id);
        if (initialProductIndex > -1) {
            console.warn("Editing initial products is for demo purposes and won't persist on page reload.");
            Object.assign(initialProducts[initialProductIndex], state.productData);
        }

        const timer = setTimeout(() => {
            router.push('/estoque');
        }, 1000);
        return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router, toast]);
  
  const fileRef = form.register('image');

  const onSubmit = (formData: FormData) => {
    const data = form.getValues();
    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Image = reader.result as string;
        formData.set('imageUrl', base64Image); // new base64 image
        dispatch(formData);
      };

      reader.onerror = (error) => {
        console.error("Error converting image to base64:", error);
        toast({
          title: 'Erro de Imagem',
          description: 'Não foi possível processar a imagem. Tente novamente.',
          variant: 'destructive',
        });
      };

      reader.readAsDataURL(file);
    } else {
      formData.set('imageUrl', data.imageUrl || 'https://placehold.co/200x200'); // keep old image
      dispatch(formData);
    }
  };


  const uniqueCategories = useMemo(() => [...new Set(initialProducts.map(p => p.category))], []);

  if (loading) {
    return (
       <div className="mx-auto max-w-2xl">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                         <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-full w-full aspect-square" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Skeleton className="h-10 w-full md:col-span-1 col-span-2" />
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
          <CardTitle>Editar Produto: {product?.name}</CardTitle>
          <CardDescription>Atualize os dados do produto abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={dispatch} className="space-y-4">
               {/* Hidden ID field */}
               <FormField name="id" control={form.control} render={({ field }) => <Input type="hidden" {...field} />} />

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-4">
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
                  </div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center justify-center space-y-2">
                             <FormLabel htmlFor="picture" className="cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 w-full flex flex-col items-center justify-center text-center hover:bg-muted/50 aspect-square">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" width={150} height={150} className="rounded-md object-contain h-full w-full" />
                                ) : (
                                    <>
                                        <Upload className="h-12 w-12 text-muted-foreground" />
                                        <span className="text-muted-foreground mt-2">Carregar Imagem</span>
                                    </>
                                )}
                             </FormLabel>
                             <FormControl>
                                <Input type="file" id="picture" accept="image/*" className="sr-only" {...fileRef} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor de Custo (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 2.50" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="profitMargin"
                    render={({ field }) => (
                     <FormItem>
                        <FormLabel>Margem de Lucro (%)</FormLabel>
                        <FormControl>
                           <div className="relative">
                              <Input type="number" placeholder="Ex: 20" {...field} className="pl-8" />
                              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Preço de Venda (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Código de Barras</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="text" placeholder="Escanear ou digitar" {...field} />
                            <Barcode className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           </div>
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
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Link href="/estoque" passHref>
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

    