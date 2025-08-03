
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Beer, Cigarette, Cookie, ShoppingBasket, Sparkles, Sprout } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

interface ProductRecommenderProps {
  onAddToOrder: (product: Product) => void;
  onCategoryClick: (category: string) => void;
}

const categories = [
  { name: 'Bebidas', icon: <Beer className="h-10 w-10" /> },
  { name: 'Tabacaria', icon: <Cigarette className="h-10 w-10" /> },
  { name: 'Salgadinhos', icon: <Cookie className="h-10 w-10" /> },
  { name: 'Doces', icon: <Sparkles className="h-10 w-10" /> },
  { name: 'Diversos', icon: <ShoppingBasket className="h-10 w-10" /> },
  { name: 'Outros', icon: <Sprout className="h-10 w-10" /> },
];

const bestSellers: Product[] = products.slice(0, 10);

const ProductRecommender: FC<ProductRecommenderProps> = ({ onAddToOrder, onCategoryClick }) => {

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-headline text-2xl font-semibold text-primary">Categorias</h3>
        <p className="text-sm text-muted-foreground">
          Navegue pelas categorias de produtos.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 p-2 text-center bg-primary/5 hover:bg-primary/10 border-primary/20"
              onClick={() => onCategoryClick(category.name)}
            >
              {category.icon}
              <span className="text-xs font-semibold">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-headline text-2xl font-semibold text-primary">Mais Vendidos</h3>
        <p className="text-sm text-muted-foreground">
            Confira nossos produtos populares.
        </p>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mt-4"
        >
          <CarouselContent>
            {bestSellers.map((product) => (
              <CarouselItem key={product.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="p-1">
                  <Card 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onAddToOrder(product)}
                  >
                    <CardContent className="flex aspect-square items-center justify-center p-2 flex-col">
                       <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-md object-contain"
                          data-ai-hint={product.dataAiHint || "product"}
                        />
                      <span className="text-xs font-semibold mt-2 text-center">{product.name}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default ProductRecommender;
