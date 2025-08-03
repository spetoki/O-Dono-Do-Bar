
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { Product } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductCatalogProps {
  products: Product[];
  onAddToOrder: (product: Product) => void;
}

const ProductCatalog: FC<ProductCatalogProps> = ({ products, onAddToOrder }) => {

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  
  const categories = useMemo(() => {
    const allCategories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
    return allCategories;
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline text-3xl font-bold text-primary">Catálogo de Produtos</h2>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
              {filteredProducts.filter(p => selectedCategory === 'Todos' || p.category === category).map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                  <CardHeader className="p-0">
                     <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="h-16 w-full object-cover"
                        data-ai-hint={product.dataAiHint || "product"}
                      />
                  </CardHeader>
                  <CardContent className="flex-1 p-1">
                    <CardTitle className="font-headline text-[10px] leading-tight text-primary">{product.name}</CardTitle>
                    <CardDescription className="mt-1 h-8 overflow-hidden text-[9px]">
                      {product.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-1 pt-0">
                    <p className="text-xs font-bold text-primary">{formatCurrency(product.price)}</p>
                    <Button size="sm" onClick={() => onAddToOrder(product)} className="text-[10px] p-1 h-auto">
                      <PlusCircle className="mr-1 h-2 w-2" />
                      Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductCatalog;
