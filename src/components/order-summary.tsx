
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import type { OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2, FileText, XCircle, Wine } from 'lucide-react';
import ReceiptDialog from './receipt-dialog';
import Image from 'next/image';

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (wineId: number, quantity: number) => void;
  onRemoveItem: (wineId: number) => void;
  onClearOrder: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  subtotal,
  tax,
  total,
}) => {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div className="flex h-full flex-col">
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Wine className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <p className="font-headline text-lg text-muted-foreground">Your order is empty</p>
          <p className="text-sm text-muted-foreground">Add wines from the catalog to get started.</p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
              {items.map(({ wine, quantity }) => (
                <div key={wine.id} className="flex items-center gap-4">
                  <Image
                    src={wine.imageUrl}
                    alt={wine.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                    data-ai-hint="wine bottle"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{wine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(wine.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(wine.id, quantity - 1)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-bold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(wine.id, quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive/80 hover:text-destructive"
                    onClick={() => onRemoveItem(wine.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 pt-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onClearOrder}>
                <XCircle /> Clear Order
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsReceiptOpen(true)}>
                <FileText /> Generate Receipt
              </Button>
            </div>
          </div>
          <ReceiptDialog
            isOpen={isReceiptOpen}
            onClose={() => setIsReceiptOpen(false)}
            orderItems={items}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </>
      )}
    </div>
  );
};

export default OrderSummary;
