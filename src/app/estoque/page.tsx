
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
import { Button } from '@/components/ui/button';
import { X, PackagePlus, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load products from localStorage and merge with initial products
    // This creates a unified list for display
    const storedProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Create a map of initial products for easy lookup
    const initialProductsMap = new Map(initialProducts.map(p => [p.id, p]));

    // Merge stored products with initial products. 
    // If a product from localStorage has the same ID as an initial one,
    // the one from localStorage (potentially edited) is used.
    const mergedProducts = initialProducts.map(p => {
        const storedVersion = storedProducts.find(sp => sp.id === p.id);
        return storedVersion || p;
    });

    // Add new products from localStorage that are not in the initial list
    const newProducts = storedProducts.filter(p => !initialProductsMap.has(p.id));

    setProducts([...mergedProducts, ...newProducts].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const handleEdit = (productId: number) => {
    router.push(`/estoque/editar/${productId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <CardTitle>Gerenciamento de Estoque</CardTitle>
            <CardDescription>Consulte, adicione e edite produtos.</CardDescription>
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
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Cód. Barras</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.barcode || product.id}</TableCell>
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
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
