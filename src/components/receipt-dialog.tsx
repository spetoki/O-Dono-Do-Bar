
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
import type { OrderItem, Customer, Sale } from '@/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers as initialCustomers } from '@/data/customers';
import { Printer, XCircle, DollarSign, CreditCard, Landmark, ClipboardList, CheckCircle, UserPlus, Percent, RotateCw } from 'lucide-react';
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context';

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
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [localAmountPaid, setLocalAmountPaid] = useState(0);
  const [localAmountPaidDisplay, setLocalAmountPaidDisplay] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isFinalized, setIsFinalized] = useState(false);


  const [discountType, setDiscountType] = useState<DiscountType>('amount');
  const [discountValue, setDiscountValue] = useState('');

  const [appSettings, setAppSettings] = useState({
    companyName: 'O Dono Do Bar',
    companyCnpj: '00.000.000/0001-00',
    companyAddress: 'Rua da Cerveja, 123 - Cascavel, PR',
    companyPhone: '(45) 99999-8888',
    companyInstagram: '@odonodobar',
    taxRate: '0.00',
    receiptMessage: 'Obrigado pela preferência! Volte sempre!',
  });


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

  const tax = useMemo(() => {
    const taxRate = parseFloat(appSettings.taxRate.replace(',', '.')) || 0;
    return total * (taxRate / 100);
  }, [total, appSettings.taxRate]);


  const change = useMemo(() => {
    return localAmountPaid > total ? localAmountPaid - total : 0;
  }, [localAmountPaid, total]);

  useEffect(() => {
    if (isOpen) {
      saleId.current = String(Math.floor(Math.random() * 900000) + 100000);
      const now = new Date();
      saleDate.current = now.toLocaleDateString('pt-BR');
      saleTime.current = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const loadedSettings = localStorage.getItem('appSettings');
      if (loadedSettings) {
        setAppSettings(JSON.parse(loadedSettings));
      }

      const storedCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
      const allCustomerIds = new Set(initialCustomers.map(c => c.id));
      const uniqueStoredCustomers = storedCustomers.filter(c => !allCustomerIds.has(c.id));
      setCustomers([...initialCustomers, ...uniqueStoredCustomers].sort((a,b) => a.name.localeCompare(b.name)));

      setCpf('');
      setSelectedCustomer(null);
      setDiscountValue('');
      setLocalAmountPaid(0);
      setLocalAmountPaidDisplay('');
      setPaymentMethod('dinheiro');
      setIsFinalized(false);
    }
  }, [isOpen]);

   useEffect(() => {
    if (paymentMethod !== 'dinheiro') {
      setLocalAmountPaid(total);
      setLocalAmountPaidDisplay(formatPrice(total));
    } else {
        setLocalAmountPaid(0);
        setLocalAmountPaidDisplay('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, total]);

    
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  }
    
  const handlePrint = () => {
    window.print();
  };
  
  const handleFinalize = () => {
    if (!user) {
        toast({
            title: "Erro!",
            description: "Nenhum usuário logado. Não é possível finalizar a venda.",
            variant: "destructive"
        })
        return;
    }
    
    if (paymentMethod === 'fiado' && selectedCustomer) {
      const customerId = parseInt(selectedCustomer, 10);
      
      const storedCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
      const updatedCustomers = storedCustomers.map(c => {
        if (c.id === customerId) {
          return { ...c, debt: c.debt + total };
        }
        return c;
      });
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      
      const initialCustomerIndex = initialCustomers.findIndex(c => c.id === customerId);
      if (initialCustomerIndex !== -1) {
          initialCustomers[initialCustomerIndex].debt += total;
      }
    }

    const newSale: Sale = {
        id: saleId.current,
        date: new Date().toISOString(),
        items: orderItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        operatorId: user.id,
        operatorName: user.name,
    };

    const existingSales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
    const updatedSales = [...existingSales, newSale];
    localStorage.setItem('sales', JSON.stringify(updatedSales));

    toast({
        title: "Venda Finalizada!",
        description: `Venda ${saleId.current} concluída com sucesso.`,
    })
    setIsFinalized(true);
  };

  const handleNewSale = () => {
    onFinalize();
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAmountPaidDisplay(value);
    
    if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
       const numericValue = parseFloat(value.replace(',', '.')) || 0;
       if (numericValue <= 1000000) {
         setLocalAmountPaid(numericValue);
       }
    }
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
       if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
           setDiscountValue(value);
       }
  }
  
  const pad = (str: string | number, length: number, char = ' ') => String(str).padStart(length, char);
  const padEnd = (str: string | number, length: number, char = ' ') => String(str).padEnd(length, char);
  const formatCurrency = (val: number) => val.toFixed(2).replace('.', ',');


  const ReceiptContent = () => (
    <div className="printable-area bg-white text-black p-4 font-mono text-xs w-full max-w-[300px] mx-auto">
        <div className="text-center">
            <p className="font-bold">{appSettings.companyName}</p>
            <p>CNPJ: {appSettings.companyCnpj}</p>
            <p>{appSettings.companyAddress}</p>
            <p>Tel: {appSettings.companyPhone}</p>
            {appSettings.companyInstagram && <p>Instagram: {appSettings.companyInstagram}</p>}
        </div>
        <p className="border-t border-b border-dashed border-black my-1 py-0.5">
            Documento Auxiliar de Venda
        </p>
        <div className="flex justify-between">
            <span>{saleDate.current} {saleTime.current}</span>
            <span>Cupom: {saleId.current}</span>
        </div>
        <p>Vendedor: {user?.name}</p>
        {cpf && <p>CPF: {cpf}</p>}
        <div className="border-t border-dashed border-black mt-1 pt-1">
            <div className="flex font-bold">
                <span className="w-[10%]">ITEM</span>
                <span className="w-[40%]">DESC</span>
                <span className="w-[25%] text-right">QTDxVL.UN</span>
                <span className="w-[25%] text-right">TOTAL</span>
            </div>
            {orderItems.map((item, index) => (
                <div key={item.product.id} className="flex">
                    <span className="w-[10%]">{pad(index + 1, 3, '0')}</span>
                    <span className="w-[40%] truncate">{item.product.name}</span>
                    <span className="w-[25%] text-right">{item.quantity}x{formatCurrency(item.product.price)}</span>
                    <span className="w-[25%] text-right">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
            ))}
        </div>
        <div className="border-t border-dashed border-black mt-1 pt-1">
            <div className="flex justify-between">
                <span>Qtd. de Itens</span>
                <span>{orderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </div>
             <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span>Desconto</span>
                <span>R$ {formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm">
                <span>TOTAL</span>
                <span>R$ {formatCurrency(total)}</span>
            </div>
        </div>
         <div className="border-t border-dashed border-black mt-1 pt-1">
            <div className="flex justify-between">
                <span>Forma Pagto.</span>
                <span className="uppercase">{paymentMethod}</span>
            </div>
            {paymentMethod === 'dinheiro' && (
                <>
                <div className="flex justify-between">
                    <span>Valor Recebido</span>
                    <span>R$ {formatCurrency(localAmountPaid)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Troco</span>
                    <span>R$ {formatCurrency(change)}</span>
                </div>
                </>
            )}
        </div>
        <div className="border-t border-dashed border-black mt-1 pt-1 text-center">
           <p>Tributos aprox. R$ {formatCurrency(tax)} (Lei 12.741/12)</p>
           <p className="mt-2">{appSettings.receiptMessage}</p>
        </div>
    </div>
);


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            onClose();
        }
    }}>
      <DialogContent className="max-w-4xl h-[95vh] flex flex-col p-2 md:p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        {isFinalized ? (
             <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <DialogHeader className="items-center">
                    <DialogTitle className="text-3xl font-bold">Venda Concluída!</DialogTitle>
                </DialogHeader>
                
                <ReceiptContent />

                <div className="flex gap-2 w-full max-w-sm">
                    <Button onClick={handlePrint} variant="outline" className="h-12 text-base flex-1">
                        <Printer className="mr-2" /> Imprimir Recibo
                    </Button>
                    <Button onClick={handleNewSale} className="h-12 text-base flex-1">
                        <RotateCw className="mr-2" /> Nova Venda
                    </Button>
                </div>
             </div>
        ) : (
        <>
            <DialogHeader>
                <DialogTitle>Finalizar Venda</DialogTitle>
                <DialogDescription>
                    Confirme os detalhes da venda, aplique descontos e selecione a forma de pagamento.
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-hidden">
                {/* Left side: Receipt Preview */}
                <div className="bg-muted/30 p-2 md:p-4 rounded-lg flex flex-col items-center justify-center overflow-y-auto">
                   <ReceiptContent />
                </div>

                {/* Right side: Payment options */}
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Forma de Pagamento</Label>
                        <ToggleGroup type="single" value={paymentMethod} onValueChange={(value: PaymentMethod) => value && setPaymentMethod(value)} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <ToggleGroupItem value="dinheiro" className="flex-col h-14 sm:h-16 gap-1 text-xs sm:text-sm"><DollarSign className="h-5 w-5"/> Dinheiro</ToggleGroupItem>
                            <ToggleGroupItem value="cartao" className="flex-col h-14 sm:h-16 gap-1 text-xs sm:text-sm"><CreditCard className="h-5 w-5"/> Cartão</ToggleGroupItem>
                            <ToggleGroupItem value="pix" className="flex-col h-14 sm:h-16 gap-1 text-xs sm:text-sm"><Landmark className="h-5 w-5"/> Pix</ToggleGroupItem>
                            <ToggleGroupItem value="fiado" className="flex-col h-14 sm:h-16 gap-1 text-xs sm:text-sm"><ClipboardList className="h-5 w-5"/> Fiado</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    
                    {paymentMethod === 'fiado' ? (
                    <div className="space-y-2 animate-in fade-in-50">
                        <Label htmlFor="customer-select">Selecionar Cliente</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={setSelectedCustomer} value={selectedCustomer ?? undefined}>
                                <SelectTrigger id="customer-select" className="flex-1">
                                    <SelectValue placeholder="Escolha um cliente cadastrado..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id.toString()}>
                                            {customer.name} - {customer.cpf}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Link href="/clientes/novo" target="_blank">
                                <Button variant="outline" size="icon">
                                    <UserPlus className="h-4 w-4"/>
                                    <span className="sr-only">Adicionar Novo Cliente</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    ) : (
                    <div className="space-y-2 animate-in fade-in-50">
                        <Label htmlFor="cpf">CPF na Nota (Opcional)</Label>
                        <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                    </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label>Desconto</Label>
                        <div className="flex gap-2">
                            <ToggleGroup type="single" variant="outline" value={discountType} onValueChange={(value: DiscountType) => value && setDiscountType(value)} >
                            <ToggleGroupItem value="amount" aria-label="Desconto em R$"><DollarSign className="h-4 w-4"/></ToggleGroupItem>
                            <ToggleGroupItem value="percentage" aria-label="Desconto em %"><Percent className="h-4 w-4"/></ToggleGroupItem>
                            </ToggleGroup>
                            <Input 
                                placeholder={discountType === 'amount' ? 'R$ 0,00' : '0%'}
                                value={discountValue}
                                onChange={handleDiscountChange}
                                className="text-base"
                            />
                        </div>
                    </div>

                    {paymentMethod === 'dinheiro' && (
                        <div className="space-y-2 animate-in fade-in-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="amount-paid">Valor Recebido</Label>
                                <Input 
                                    id="amount-paid" 
                                    value={localAmountPaidDisplay} 
                                    onChange={handleAmountChange} 
                                    className="text-right font-mono text-xl sm:text-2xl h-14" 
                                    placeholder="0,00"
                                    autoFocus
                                />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="change">Troco</Label>
                                <Input id="change" value={`R$ ${formatCurrency(change)}`} readOnly className="text-right font-mono text-xl sm:text-2xl h-14 bg-muted" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
            
            <DialogFooter className="grid grid-cols-3 gap-2 pt-4 border-t flex-shrink-0">
                <Button variant="outline" onClick={onClose} className="h-12 md:h-14 text-sm md:text-lg">
                <XCircle className="mr-2" /> {isMobile ? "Fechar" : "Fechar"}
                </Button>
                <Button variant="outline" onClick={handlePrint} className="h-12 md:h-14 text-sm md:text-lg">
                <Printer className="mr-2" /> {isMobile ? "Imprimir" : "Imprimir"}
                </Button>
                <Button onClick={handleFinalize} className="h-12 md:h-14 text-sm md:text-lg" disabled={paymentMethod === 'fiado' && !selectedCustomer}>
                    <CheckCircle className="mr-2" /> {isMobile ? "Finalizar" : "Finalizar Venda"}
                </Button>
            </DialogFooter>
        </>
      )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
