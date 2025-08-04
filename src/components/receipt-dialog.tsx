'use client';

import { type FC, useState, useEffect, ChangeEvent, useRef } from 'react';
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
import { Printer, XCircle, DollarSign, CreditCard, Landmark, ClipboardList, CheckCircle } from 'lucide-react';
import React from 'react';

type PaymentMethod = 'dinheiro' | 'cartao' | 'pix' | 'fiado';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFinalize: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onAmountPaidChange: (amount: number) => void;
  amountPaid: number;
  change: number;
}

const ReceiptDialog: FC<ReceiptDialogProps> = ({
  isOpen,
  onClose,
  onFinalize,
  orderItems,
  subtotal,
  total,
  tax,
  onAmountPaidChange,
  amountPaid,
  change
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [amountPaidDisplay, setAmountPaidDisplay] = useState('');
  const [cpf, setCpf] = useState('');
  const saleId = useRef('');
  const saleDate = useRef('');
  const saleTime = useRef('');


  useEffect(() => {
    if (isOpen) {
        // Generate mock sale details
        saleId.current = Math.random().toString(36).substring(2, 10).toUpperCase();
        const now = new Date();
        saleDate.current = now.toLocaleDateString('pt-BR');
        saleTime.current = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // If the payment method is not cash, set amountPaid to total
      if (paymentMethod !== 'dinheiro') {
        onAmountPaidChange(total);
        setAmountPaidDisplay(formatPrice(total));
      } else {
        // If it's cash and an amount has been passed from the main page, use it.
        if (amountPaid > 0) {
          setAmountPaidDisplay(formatPrice(amountPaid));
        } else {
          onAmountPaidChange(0);
          setAmountPaidDisplay('');
        }
      }
      setCpf(''); // Reset CPF on open
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, paymentMethod, total]);

  useEffect(() => {
    // Sync the dialog's local display state if the prop changes (e.g., from main page input)
    if (paymentMethod === 'dinheiro') {
       if (amountPaid === 0) {
        setAmountPaidDisplay('');
      } else if (amountPaid.toString() !== amountPaidDisplay.replace(',', '.')) {
        // Update display only if it's different to avoid overwriting user input
        // setAmountPaidDisplay(formatPrice(amountPaid));
      }
    } else {
       onAmountPaidChange(total); // Ensure amount paid is total for other methods
       setAmountPaidDisplay(formatPrice(total));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[amountPaid, paymentMethod]);


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
    
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  }
    
  const handlePrint = () => {
    window.print();
  };
  
  const handleFinalize = () => {
    // Here you could add logic to save the sale, CPF, etc.
    console.log(`Venda finalizada com CPF: ${cpf}, ID: ${saleId.current}`);
    onFinalize();
  };


  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountPaidDisplay(value);
    
    // Allow empty string or valid number format up to 1,000,000
    if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
       const numericValue = parseFloat(value.replace(',', '.')) || 0;
       if (numericValue <= 1000000) {
         onAmountPaidChange(numericValue);
       }
    }
  };

  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            onClose();
        }
    }}>
      <DialogContent className="max-w-sm" onOpenAutoFocus={(e) => {
          e.preventDefault();
          const input = document.getElementById('amount-paid');
          if (input && paymentMethod === 'dinheiro') {
            (input as HTMLInputElement).focus();
            (input as HTMLInputElement).select();
          }
      }}>
         <div className="printable-area font-mono text-xs p-2 bg-white text-black">
            <header className="text-center space-y-1">
                <p className="font-bold">DISTRIBUIDORA DE BEBIDAS SANTA FELICIDADE</p>
                <p>CNPJ: 45.878.700/0001-44 DISTRIBUIDORA SANTA LTDA</p>
                <p>Rua Sarjento Jose Das Quantas, 6589, Santa felicidade - Cascavel PR</p>
                <p>Fone 45 99969-6969 e 45 99966-9966</p>
                <Separator className="border-dashed border-black"/>
                <p>Documento auxiliar da nota fiscal de consumidor eletronica</p>
                 <div className="flex justify-between">
                    <span>{saleDate.current}</span>
                    <span>ID da Venda: {saleId.current}</span>
                    <span>{saleTime.current}</span>
                </div>
                 <Separator className="border-dashed border-black"/>
                <p className="font-bold">CUPOM FISCAL</p>
            </header>

            <main>
                <div className="grid grid-cols-12 my-2 font-bold">
                    <div className="col-span-6">ITEM</div>
                    <div className="col-span-3 text-center">QTD x VL.UN</div>
                    <div className="col-span-3 text-right">TOTAL</div>
                </div>
                <Separator className="border-dashed border-black" />
                <ScrollArea className="max-h-32 my-1">
                     {orderItems.map((item) => (
                        <div key={item.product.id} className="grid grid-cols-12 gap-1 my-1">
                            <div className="col-span-6 truncate">{item.product.name}</div>
                            <div className="col-span-3 text-center">{item.quantity} x {formatPrice(item.product.price)}</div>
                            <div className="col-span-3 text-right">{formatPrice(item.product.price * item.quantity)}</div>
                        </div>
                     ))}
                </ScrollArea>
                <Separator className="border-dashed border-black"/>

                <div className="my-2 space-y-1">
                    <div className="flex justify-between">
                        <span>Qtd. de Itens</span>
                        <span>{totalItems}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Desconto</span>
                        <span>- {formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base">
                        <span>TOTAL</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
                 <Separator className="border-dashed border-black"/>
                
                <div className="my-2 space-y-1">
                     <div className="flex justify-between">
                        <span>Método Pagto.</span>
                        <span className="capitalize">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Valor Recebido</span>
                        <span>{formatCurrency(amountPaid)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Troco</span>
                        <span>{formatCurrency(change)}</span>
                    </div>
                </div>

            </main>

            <footer className="text-center space-y-1 mt-2">
                 <p>Emitido conforme o Ajuste SINIEF 07/05.</p>
                 <p>Tributos totais aproximados conforme Lei Federal 12.741/12: {formatCurrency(tax)}</p>
                 <div className="space-y-0">
                    <p>Obrigado pela preferência!</p>
                    <p>Volte sempre!</p>
                 </div>
            </footer>
        </div>

         <div className="space-y-2">
            <Label htmlFor="cpf">CPF na Nota (Opcional)</Label>
            <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
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
                      <Input 
                        id="amount-paid" 
                        value={amountPaidDisplay} 
                        onChange={handleAmountChange} 
                        className="text-right font-mono text-lg h-12" 
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="change">Troco</Label>
                       <Input id="change" value={formatCurrency(change)} readOnly className="text-right font-mono text-lg h-12 bg-muted" />
                    </div>
                  </div>
              </div>
        )}
        

        <DialogFooter className="grid grid-cols-3 gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              <XCircle className="mr-2" /> Fechar
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2" /> Imprimir
            </Button>
            <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2" /> Finalizar Venda
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
