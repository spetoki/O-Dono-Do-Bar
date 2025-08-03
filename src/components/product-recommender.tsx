
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Beer, Cigarette, Cookie, ShoppingBasket, Sparkles, Sprout } from 'lucide-react';

const categories = [
  { name: 'Bebidas', icon: <Beer className="h-10 w-10" /> },
  { name: 'Tabacaria', icon: <Cigarette className="h-10 w-10" /> },
  { name: 'Salgadinhos', icon: <Cookie className="h-10 w-10" /> },
  { name: 'Doces', icon: <Sparkles className="h-10 w-10" /> },
  { name: 'Diversos', icon: <ShoppingBasket className="h-10 w-10" /> },
  { name: 'Outros', icon: <Sprout className="h-10 w-10" /> },
];

const ProductRecommender: FC = () => {

  const handleCategoryClick = (category: string) => {
    // Futuramente, podemos abrir o catálogo na categoria selecionada.
    console.log(`Category clicked: ${category}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-2xl font-semibold text-primary">Categorias</h3>
      <p className="text-sm text-muted-foreground">
        Selecione uma categoria para ver os produtos.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="h-28 flex flex-col items-center justify-center gap-2 p-2 text-center bg-primary/5 hover:bg-primary/10 border-primary/20"
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.icon}
            <span className="text-sm font-semibold">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommender;
