
'use client';

import type { FC } from 'react';
import type { OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  return (
    <div className="flex h-full flex-col text-foreground">
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <ShoppingCart className="mb-4 h-24 w-24 text-muted-foreground/30" />
          <p className="font-headline text-xl text-muted-foreground">Caixa livre</p>
          <p className="text-md text-muted-foreground">Adicione produtos para iniciar a venda.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Item</TableHead>
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[150px] text-center">Qtd.</TableHead>
                <TableHead className="text-right">Vlr. Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ product, quantity }, index) => (
                <TableRow key={product.id} className="font-mono">
                  <TableCell>{(index + 1).toString().padStart(3, '0')}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-sans">{product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{quantity}</span>
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(product.price * quantity)}</TableCell>
                  <TableCell>
                     <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive/80 hover:text-destructive"
                      onClick={() => onRemoveItem(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default OrderSummary;
