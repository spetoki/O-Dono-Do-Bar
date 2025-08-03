
import type { FC } from 'react';
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

interface ProductCatalogProps {
  products: Product[];
  onAddToOrder: (product: Product) => void;
}

const ProductCatalog: FC<ProductCatalogProps> = ({ products, onAddToOrder }) => {

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div>
      <h2 className="font-headline text-3xl font-bold text-primary mb-6">Catálogo de Produtos</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
               <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-48 w-full object-cover"
                  data-ai-hint="product bottle can"
                />
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="font-headline text-lg text-primary">{product.name}</CardTitle>
              <CardDescription className="mt-1 h-20 overflow-hidden text-sm">
                {product.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
              <Button size="sm" onClick={() => onAddToOrder(product)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
