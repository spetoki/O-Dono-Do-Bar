
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, PackagePlus, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/services/product-service';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
        setLoading(true);
        const productsFromDb = await getProducts();
        setProducts(productsFromDb);
        setLoading(false);
    }
    fetchProducts();
  }, []);

  const productsByCategory = useMemo(() => {
    const grouped = products.reduce((acc, product) => {
      const category = product.category || 'Sem Categoria';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    // Sort products within each category by name
    Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }, [products]);

  const sortedCategories = useMemo(() => Object.keys(productsByCategory).sort(), [productsByCategory]);

  const handleEdit = (productId: string) => {
    router.push(`/estoque/editar/${productId}`);
  };
  
  const PageSkeleton = () => (
     <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )

  if (loading) {
    return <PageSkeleton />;
  }


  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <CardTitle>Gerenciamento de Estoque</CardTitle>
            <CardDescription>Consulte, adicione e edite produtos por categoria.</CardDescription>
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
            <Link href="/cadastro" className="flex-1 md:flex-none">
                <Button className="w-full">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                </Button>
            </Link>
            <Link href="/" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
            {sortedCategories.length > 0 ? sortedCategories.map(category => (
                 <AccordionItem value={category} key={category}>
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                        <div className="flex items-center gap-3">
                            <span>{category}</span>
                            <Badge variant="secondary">{productsByCategory[category].length} itens</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Cód. Barras</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="text-right">Preço</TableHead>
                                    <TableHead className="text-right">Estoque</TableHead>
                                    <TableHead className="text-center w-[100px]">Ações</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {productsByCategory[category].map((product) => (
                                    <TableRow key={product.id}>
                                    <TableCell className="font-mono">{product.barcode || product.id}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {product.stock <= 3 ? (
                                        <Badge variant="destructive">
                                            {product.stock} (Baixo)
                                        </Badge>
                                        ) : (
                                        <span>{product.stock}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id as string)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                 </AccordionItem>
            )) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Nenhum produto encontrado.</p>
                    <p className="text-sm">Comece adicionando um novo produto para vê-lo aqui.</p>
                </div>
            )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
