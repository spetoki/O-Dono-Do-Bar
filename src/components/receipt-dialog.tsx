'use client';

import { type FC, useState, useEffect, useMemo, ChangeEvent, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { OrderItem, Customer } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers } from '@/data/customers';
import { Printer, XCircle, DollarSign, CreditCard, Landmark, ClipboardList, CheckCircle, UserPlus, Percent } from 'lucide-react';
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = 'dinheiro' | 'cartao' | 'pix' | 'fiado';
type DiscountType = 'amount' | 'percentage';

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
  // tax is passed but not used after discount feature was added
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountPaidDisplay, setAmountPaidDisplay] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const [discountType, setDiscountType] = useState<DiscountType>('amount');
  const [discountValue, setDiscountValue] = useState('');

  const saleId = useRef('');
  const saleDate = useRef('');
  const saleTime = useRef('');
  const { toast } = useToast();

  const discountAmount = useMemo(() => {
    const value = parseFloat(discountValue.replace(',', '.')) || 0;
    if (discountType === 'percentage') {
      return (subtotal * value) / 100;
    }
    return value;
  }, [discountValue, discountType, subtotal]);

  const total = useMemo(() => {
    const newTotal = subtotal - discountAmount;
    return newTotal > 0 ? newTotal : 0;
  }, [subtotal, discountAmount]);

  const tax = useMemo(() => total * 0.08, [total]);

  const change = useMemo(() => {
    return amountPaid > total ? amountPaid - total : 0;
  }, [amountPaid, total]);

  useEffect(() => {
    if (isOpen) {
      // Generate mock sale details
      saleId.current = Math.random().toString(36).substring(2, 10).toUpperCase();
      const now = new Date();
      saleDate.current = now.toLocaleDateString('pt-BR');
      saleTime.current = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Reset state on open
      setCpf('');
      setSelectedCustomer(null);
      setDiscountValue('');
      setAmountPaid(0);
      setAmountPaidDisplay('');
      setPaymentMethod('dinheiro');
    }
  }, [isOpen]);

   useEffect(() => {
    if (paymentMethod !== 'dinheiro') {
      setAmountPaid(total);
      setAmountPaidDisplay(formatPrice(total));
    } else {
        setAmountPaid(0);
        setAmountPaidDisplay('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, total]);


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
    console.log(`Venda finalizada com CPF: ${cpf}, Cliente: ${selectedCustomer}, ID: ${saleId.current}`);
    toast({
        title: "Venda Finalizada!",
        description: `Venda ${saleId.current} concluída com sucesso.`,
    })
    onFinalize();
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountPaidDisplay(value);
    
    if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
       const numericValue = parseFloat(value.replace(',', '.')) || 0;
       if (numericValue <= 1000000) {
         setAmountPaid(numericValue);
       }
    }
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
       if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
           setDiscountValue(value);
       }
  }

  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            onClose();
        }
    }}>
      <DialogContent className="max-w-md max-h-[95vh] flex flex-col p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex-shrink-0 flex justify-center">
            <div className="printable-area font-mono text-xs p-2 bg-white text-black border border-dashed border-black/50 rounded-sm w-full" style={{ transform: 'scale(0.5)', transformOrigin: 'top', height: '620px' }}>
                <header className="text-center space-y-1">
                    <p className="font-bold">DISTRIBUIDORA DE BEBIDAS SANTA FELICIDADE</p>
                    <p>CNPJ: 45.878.700/0001-44 DISTRIBUIDORA SANTA LTDA</p>
                    <p>Rua Sarjento Jose Das Quantas, 6589, Santa felicidade - Cascavel PR</p>
                    <p>Fone 45 99969-6969 e 45 99966-9966</p>
                    <Separator className="border-dashed border-black my-1"/>
                    <p>Documento auxiliar da nota fiscal de consumidor eletronica</p>
                    <div className="flex justify-between">
                        <span>{saleDate.current}</span>
                        <span>ID da Venda: {saleId.current}</span>
                        <span>{saleTime.current}</span>
                    </div>
                    <Separator className="border-dashed border-black my-1"/>
                    <p className="font-bold">CUPOM FISCAL</p>
                </header>

                <main>
                    <div className="grid grid-cols-12 my-2 font-bold">
                        <div className="col-span-6">ITEM</div>
                        <div className="col-span-3 text-center">QTD x VL.UN</div>
                        <div className="col-span-3 text-right">TOTAL</div>
                    </div>
                    <Separator className="border-dashed border-black" />
                    <div className="max-h-28 my-1 overflow-y-auto">
                        {orderItems.map((item) => (
                            <div key={item.product.id} className="grid grid-cols-12 gap-1 my-1">
                                <div className="col-span-6 truncate">{item.product.name}</div>
                                <div className="col-span-3 text-center">{item.quantity} x {formatPrice(item.product.price)}</div>
                                <div className="col-span-3 text-right">{formatPrice(item.product.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>
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
                            <span>- {formatCurrency(discountAmount)}</span>
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
                            <span className="capitalize">{paymentMethod === 'fiado' ? `Fiado - ${customers.find(c => c.id.toString() === selectedCustomer)?.name || 'N/A'}` : paymentMethod}</span>
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
        </div>

        <ScrollArea className="flex-1 -mr-4 pr-4">
            <div className="space-y-4 pt-2">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Forma de Pagamento</Label>
                    <ToggleGroup type="single" value={paymentMethod} onValueChange={(value: PaymentMethod) => value && setPaymentMethod(value)} className="grid grid-cols-4 gap-2">
                        <ToggleGroupItem value="dinheiro" className="flex-col h-14 gap-1"><DollarSign /> Dinheiro</ToggleGroupItem>
                        <ToggleGroupItem value="cartao" className="flex-col h-14 gap-1"><CreditCard /> Cartão</ToggleGroupItem>
                        <ToggleGroupItem value="pix" className="flex-col h-14 gap-1"><Landmark /> Pix</ToggleGroupItem>
                        <ToggleGroupItem value="fiado" className="flex-col h-14 gap-1"><ClipboardList /> Fiado</ToggleGroupItem>
                    </ToggleGroup>
                </div>
                
                {paymentMethod === 'fiado' ? (
                <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="customer-select">Selecionar Cliente</Label>
                    <div className="flex gap-2">
                        <Select onValueChange={setSelectedCustomer} value={selectedCustomer ?? undefined}>
                            <SelectTrigger id="customer-select" className="flex-1">
                                <SelectValue placeholder="Escolha um cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                        {customer.name} - {customer.cpf}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <UserPlus className="h-4 w-4"/>
                            <span className="sr-only">Adicionar Cliente</span>
                        </Button>
                    </div>
                </div>
                ) : (
                <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="cpf">CPF na Nota (Opcional)</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                </div>
                )}
                
                <div className="space-y-2">
                    <Label>Desconto</Label>
                    <div className="flex gap-2">
                        <ToggleGroup type="single" value={discountType} onValueChange={(value: DiscountType) => value && setDiscountType(value)} >
                           <ToggleGroupItem value="amount" aria-label="Desconto em R$"><DollarSign className="h-4 w-4"/></ToggleGroupItem>
                           <ToggleGroupItem value="percentage" aria-label="Desconto em %"><Percent className="h-4 w-4"/></ToggleGroupItem>
                        </ToggleGroup>
                        <Input 
                            placeholder={discountType === 'amount' ? 'R$ 0,00' : '0%'}
                            value={discountValue}
                            onChange={handleDiscountChange}
                        />
                    </div>
                </div>


                {paymentMethod === 'dinheiro' && (
                    <div className="space-y-2 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Label htmlFor="amount-paid">Valor Recebido</Label>
                            <Input 
                                id="amount-paid" 
                                value={amountPaidDisplay} 
                                onChange={handleAmountChange} 
                                className="text-right font-mono text-lg h-12" 
                                placeholder="0,00"
                                autoFocus
                            />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="change">Troco</Label>
                            <Input id="change" value={formatCurrency(change)} readOnly className="text-right font-mono text-lg h-12 bg-muted" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        

        <DialogFooter className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={onClose} className="h-12">
              <XCircle className="mr-2" /> Fechar
            </Button>
            <Button variant="outline" onClick={handlePrint} className="h-12">
              <Printer className="mr-2" /> Imprimir
            </Button>
            <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700 text-white h-12" disabled={paymentMethod === 'fiado' && !selectedCustomer}>
                <CheckCircle className="mr-2" /> Finalizar Venda
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
