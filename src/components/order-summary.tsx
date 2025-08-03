
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import type { OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2, FileText, XCircle, Beer } from 'lucide-react';
import ReceiptDialog from './receipt-dialog';
import Image from 'next/image';

interface OrderSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
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
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  return (
    <div className="flex h-full flex-col">
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Beer className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <p className="font-headline text-lg text-muted-foreground">Seu pedido está vazio</p>
          <p className="text-sm text-muted-foreground">Adicione produtos do catálogo para começar.</p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                    data-ai-hint={product.dataAiHint || "product"}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-bold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive/80 hover:text-destructive"
                    onClick={() => onRemoveItem(product.id)}
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
                <span>Impostos (8%)</span>
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
                <XCircle /> Limpar Pedido
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsReceiptOpen(true)}>
                <FileText /> Gerar Recibo
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
