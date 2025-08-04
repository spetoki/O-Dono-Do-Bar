
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
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const isMobile = useIsMobile();
  
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
    
    if (isMobile) {
      return (
        <div className="flex h-full flex-col text-foreground">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-4">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="font-headline text-lg text-muted-foreground">Caixa livre</p>
            <p className="text-sm text-muted-foreground">Adicione produtos para iniciar a venda.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="bg-muted/40 rounded-lg p-2 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-sans font-semibold text-sm flex-1 pr-2">{product.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive/80 hover:text-destructive shrink-0"
                      onClick={() => onRemoveItem(product.id as string)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center justify-center gap-2">
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(product.id as string, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(product.id as string, quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                       <p className="font-mono text-xs">{formatCurrency(product.price)} un.</p>
                       <p className="font-mono font-bold text-base">{formatCurrency(product.price * quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        </div>
      );
    }

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] p-2">Item</TableHead>
                  <TableHead className="p-2">Descrição</TableHead>
                  <TableHead className="w-[150px] text-center p-2">Qtd.</TableHead>
                  <TableHead className="text-right p-2">Vlr. Unit.</TableHead>
                  <TableHead className="text-right p-2">Total</TableHead>
                  <TableHead className="w-[50px] p-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(({ product, quantity }, index) => (
                  <TableRow key={product.id} className="font-mono">
                    <TableCell className="p-2">{(index + 1).toString().padStart(3, '0')}</TableCell>
                    <TableCell className="font-sans p-2">{product.name}</TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(product.id as string, quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-bold">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(product.id as string, quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right p-2">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right font-bold p-2">{formatCurrency(product.price * quantity)}</TableCell>
                    <TableCell className="p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive/80 hover:text-destructive"
                        onClick={() => onRemoveItem(product.id as string)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default OrderSummary;
