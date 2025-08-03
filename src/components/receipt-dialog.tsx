
'use client';

import type { FC } from 'react';
import type { OrderItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Beer, Printer } from 'lucide-react';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const ReceiptDialog: FC<ReceiptDialogProps> = ({ isOpen, onClose, orderItems, subtotal, tax, total }) => {
  
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // To re-attach event listeners
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div id="receipt-content">
          <DialogHeader className="items-center">
            <Beer className="h-8 w-8 text-primary" />
            <DialogTitle className="font-headline text-2xl text-primary">Distribuidora</DialogTitle>
            <p className="text-sm text-muted-foreground">Recibo do Pedido</p>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
          </DialogHeader>
          <Separator className="my-4" />
          <div className="space-y-2">
            {orderItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground">
                    {quantity} x {formatCurrency(product.price)}
                  </p>
                </div>
                <p>{formatCurrency(product.price * quantity)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Impostos (8%)</p>
              <p>{formatCurrency(tax)}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <p>Total</p>
            <p>{formatCurrency(total)}</p>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Obrigado por sua compra!
          </p>
        </div>
        <DialogFooter className="mt-4 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
