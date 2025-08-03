
'use client';

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { OrderItem } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Printer, XCircle } from 'lucide-react';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const ReceiptDialog: FC<ReceiptDialogProps> = ({
  isOpen,
  onClose,
  orderItems,
  subtotal,
  total,
  tax,
}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center font-mono text-2xl">DOMTEC</DialogTitle>
          <DialogDescription className="text-center font-mono">
            Rua Exemplo, 123 - Cidade, Estado<br />
            CNPJ: 00.000.000/0001-00 <br />
            CUPOM NÃO FISCAL
          </DialogDescription>
        </DialogHeader>
        
        <Separator />

        <ScrollArea className="max-h-60">
          <div className="text-xs font-mono space-y-2 my-2">
            <div className="grid grid-cols-12">
                <div className="col-span-6 font-bold">PRODUTO</div>
                <div className="col-span-2 text-center font-bold">QTD</div>
                <div className="col-span-4 text-right font-bold">TOTAL</div>
            </div>
            <Separator />
            {orderItems.map((item) => (
              <div key={item.product.id} className="grid grid-cols-12 gap-1">
                <div className="col-span-6 truncate">{item.product.name}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-4 text-right">{formatCurrency(item.product.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />

        <div className="font-mono text-sm space-y-2 my-2">
           <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa (8%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
           <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Separator />

        <DialogFooter className="sm:justify-between gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            <XCircle className="mr-2" /> Fechar
          </Button>
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2" /> Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
