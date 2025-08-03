
import type { FC } from 'react';
import type { Wine } from '@/types';
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

interface WineCatalogProps {
  wines: Wine[];
  onAddToOrder: (wine: Wine) => void;
}

const WineCatalog: FC<WineCatalogProps> = ({ wines, onAddToOrder }) => {

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div>
      <h2 className="font-headline text-3xl font-bold text-primary mb-6">Wine Catalog</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wines.map((wine) => (
          <Card key={wine.id} className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
               <Image
                  src={wine.imageUrl}
                  alt={wine.name}
                  width={400}
                  height={400}
                  className="h-48 w-full object-cover"
                  data-ai-hint="wine bottle"
                />
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="font-headline text-lg text-primary">{wine.name}</CardTitle>
              <CardDescription className="mt-1 h-20 overflow-hidden text-sm">
                {wine.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <p className="text-xl font-bold text-primary">{formatCurrency(wine.price)}</p>
              <Button size="sm" onClick={() => onAddToOrder(wine)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WineCatalog;
