
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { salesData, type Sale } from '@/data/sales';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Printer, Calculator, Scale, CreditCard, ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export default function CloseoutPage() {
  const [countedCash, setCountedCash] = useState('');

  const todaysSales = useMemo(() => {
    const now = new Date();
    return salesData.filter(sale => new Date(sale.date).toDateString() === now.toDateString());
  }, []);

  const totalsByPaymentMethod = useMemo(() => {
    return todaysSales.reduce((acc, sale) => {
      const key = sale.paymentMethod;
      if (key === 'cartao' || key === 'pix') {
          acc['cartao_pix'] = (acc['cartao_pix'] || 0) + sale.total;
      } else {
          acc[key] = (acc[key] || 0) + sale.total;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [todaysSales]);

  const totalRevenue = useMemo(() => todaysSales.reduce((acc, sale) => acc + sale.total, 0), [todaysSales]);

  const expectedCash = useMemo(() => totalsByPaymentMethod['dinheiro'] || 0, [totalsByPaymentMethod]);
  
  const cashDifference = useMemo(() => {
      const counted = parseFloat(countedCash.replace(',', '.')) || 0;
      if (counted === 0 && expectedCash > 0) return -expectedCash;
      return counted - expectedCash;
  }, [countedCash, expectedCash]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 printable-area">
       <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-area, .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
                display: none;
            }
          }
        `}
      </style>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
          <div>
            <CardTitle>Fechamento de Caixa</CardTitle>
            <CardDescription>Relatório de vendas e conferência do caixa do dia de hoje.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Relatório
            </Button>
            <Link href="/">
                <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Voltar
                </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">{todaysSales.length} vendas hoje</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas em Dinheiro</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalsByPaymentMethod['dinheiro'] || 0)}</div>
                     <p className="text-xs text-muted-foreground">Total esperado no caixa</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cartão / Pix</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalsByPaymentMethod['cartao_pix'] || 0)}</div>
                     <p className="text-xs text-muted-foreground">Pagamentos eletrônicos</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas Fiado</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalsByPaymentMethod['fiado'] || 0)}</div>
                     <p className="text-xs text-muted-foreground">Total pendente de clientes</p>
                </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
                <CardTitle>Conferência do Caixa</CardTitle>
                <CardDescription>Insira o valor total em dinheiro contado no caixa para verificar a diferença.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="expected-cash">Valor Esperado (Dinheiro)</Label>
                        <Input id="expected-cash" value={formatCurrency(expectedCash)} readOnly className="font-mono text-lg" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="counted-cash">Valor Contado no Caixa</Label>
                        <Input 
                            id="counted-cash" 
                            type="text"
                            placeholder="R$ 0,00"
                            value={countedCash}
                            onChange={(e) => setCountedCash(e.target.value)}
                            className="font-mono text-lg border-2 border-primary"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Diferença</Label>
                         <div className={cn(
                            "h-10 flex items-center justify-center rounded-md border text-lg font-bold",
                            cashDifference === 0 && "bg-muted",
                            cashDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50",
                            cashDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50",
                         )}>
                            {formatCurrency(cashDifference)}
                        </div>
                    </div>
                     <Card className={cn(
                        "border-2 h-full flex flex-col justify-center",
                        cashDifference > 0 && "border-blue-500",
                        cashDifference < 0 && "border-destructive"
                     )}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            <div className={cn(
                                "text-lg font-bold",
                                cashDifference > 0 && "text-blue-500",
                                cashDifference < 0 && "text-destructive"
                            )}>
                                {cashDifference > 0 ? "Sobra" : cashDifference < 0 ? "Falta" : "Caixa Correto"}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
          </Card>

           <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Vendas Realizadas Hoje</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-auto">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Horário</TableHead>
                                <TableHead>Itens</TableHead>
                                <TableHead>Pagamento</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {todaysSales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-mono text-xs">{formatDate(new Date(sale.date))}</TableCell>
                                        <TableCell className="truncate max-w-[200px] text-xs">{sale.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}</TableCell>
                                        <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-base">Total do Dia</TableCell>
                                    <TableCell className="text-right font-bold font-mono text-base">{formatCurrency(totalRevenue)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
