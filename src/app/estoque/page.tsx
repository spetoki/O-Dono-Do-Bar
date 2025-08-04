
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products as initialProducts } from '@/data/products';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, PackagePlus } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    const allProductIds = new Set(initialProducts.map(p => p.id));
    const uniqueStoredProducts = storedProducts.filter(p => !allProductIds.has(p.id));

    setProducts([...initialProducts, ...uniqueStoredProducts].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Gerenciamento de Estoque</CardTitle>
            <CardDescription>Consulte e adicione novos produtos.</CardDescription>
        </div>
        <div className='flex gap-2'>
            <Link href="/cadastro">
                <Button>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                </Button>
            </Link>
            <Link href="/">
                <Button variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
