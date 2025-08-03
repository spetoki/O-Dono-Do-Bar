
import type { FC } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';

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
  
  return (
    <ScrollArea className="h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                 <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-md object-cover"
                    data-ai-hint={product.dataAiHint || "product"}
                  />
              </TableCell>
              <TableCell className="font-mono">{product.id}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(product.price)}</TableCell>
              <TableCell>
                 <Button size="sm" onClick={() => onAddToOrder(product)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ProductCatalog;
