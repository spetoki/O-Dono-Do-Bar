'use client';

import { type FC, useState, useEffect } from 'react';
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Printer, XCircle, DollarSign, CreditCard, Landmark, ClipboardList } from 'lucide-react';
import React from 'react';


type PaymentMethod = 'dinheiro' | 'cartao' | 'pix' | 'fiado';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onAmountPaidChange: (amount: number) => void;
  change: number;
}

const ReceiptDialog: FC<ReceiptDialogProps> = ({
  isOpen,
  onClose,
  orderItems,
  subtotal,
  total,
  tax,
  onAmountPaidChange,
  change
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [localAmountPaid, setLocalAmountPaid] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalAmountPaid(total.toFixed(2));
      onAmountPaidChange(total);
    }
  }, [isOpen, total, onAmountPaidChange]);
  
  useEffect(() => {
     if(paymentMethod !== 'dinheiro') {
        onAmountPaidChange(total);
        setLocalAmountPaid(total.toFixed(2));
     }
  }, [paymentMethod, total, onAmountPaidChange]);


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  const handlePrint = () => {
    window.print();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAmountPaid(value);
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    onAmountPaidChange(numericValue);
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

        <ScrollArea className="max-h-40">
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
        
         <div>
            <Label className="text-sm font-medium">Forma de Pagamento</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(['dinheiro', 'cartao', 'pix', 'fiado'] as PaymentMethod[]).map(method => (
                  <Button 
                    key={method}
                    variant={paymentMethod === method ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod(method)}
                    className="flex-1"
                  >
                    {method === 'dinheiro' && <DollarSign />}
                    {method === 'cartao' && <CreditCard />}
                    {method === 'pix' && <Landmark />}
                    {method === 'fiado' && <ClipboardList />}
                    <span className="capitalize ml-2">{method}</span>
                  </Button>
              ))}
            </div>
        </div>

        {paymentMethod === 'dinheiro' && (
          <div className="space-y-2 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-paid">Valor Pago</Label>
                  <Input id="amount-paid" value={localAmountPaid} onChange={handleAmountChange} className="text-right font-mono text-lg h-12" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="change">Troco</Label>
                   <Input id="change" value={formatCurrency(change)} readOnly className="text-right font-mono text-lg h-12 bg-muted" />
                </div>
              </div>
          </div>
        )}
        

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
