
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
import { useAuth } from '@/context/auth-context';

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
    }).format(date)
}

export default function CloseoutPage() {
  const [countedCash, setCountedCash] = useState('');
  const [countedCardPix, setCountedCardPix] = useState('');
  const [countedFiado, setCountedFiado] = useState('');
  
  const { user } = useAuth();

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
  const expectedCardPix = useMemo(() => totalsByPaymentMethod['cartao_pix'] || 0, [totalsByPaymentMethod]);
  const expectedFiado = useMemo(() => totalsByPaymentMethod['fiado'] || 0, [totalsByPaymentMethod]);
  
  const cashDifference = useMemo(() => {
      const counted = parseFloat(countedCash.replace(',', '.')) || 0;
      if (counted === 0 && expectedCash > 0 && countedCash.trim() === '') return 0;
      return counted - expectedCash;
  }, [countedCash, expectedCash]);

  const cardPixDifference = useMemo(() => {
    const counted = parseFloat(countedCardPix.replace(',', '.')) || 0;
    if (counted === 0 && expectedCardPix > 0 && countedCardPix.trim() === '') return 0;
    return counted - expectedCardPix;
  }, [countedCardPix, expectedCardPix]);

  const fiadoDifference = useMemo(() => {
    const counted = parseFloat(countedFiado.replace(',', '.')) || 0;
    if (counted === 0 && expectedFiado > 0 && countedFiado.trim() === '') return 0;
    return counted - expectedFiado;
  }, [countedFiado, expectedFiado]);

  const handlePrint = () => {
    window.print();
  };
  
  const isAdmin = user?.role === 'admin';

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
          <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
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
            {isAdmin && (
              <>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendas em Dinheiro</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(expectedCash)}</div>
                        <p className="text-xs text-muted-foreground">Total esperado no caixa</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cartão / Pix</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(expectedCardPix)}</div>
                        <p className="text-xs text-muted-foreground">Pagamentos eletrônicos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendas Fiado</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(expectedFiado)}</div>
                        <p className="text-xs text-muted-foreground">Total pendente de clientes</p>
                    </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <Card>
            <CardHeader>
                <CardTitle>Conferência de Caixa</CardTitle>
                <CardDescription>Insira os valores totais apurados para cada forma de pagamento para conferência.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Dinheiro */}
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1">
                        <Label htmlFor="counted-cash" className="font-semibold">DINHEIRO</Label>
                        {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(expectedCash)}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="counted-cash" className="sr-only">Valor Contado (Dinheiro)</Label>
                        <Input 
                            id="counted-cash" 
                            type="text"
                            placeholder="R$ 0,00"
                            value={countedCash}
                            onChange={(e) => setCountedCash(e.target.value)}
                            className="font-mono text-lg"
                        />
                    </div>
                    {isAdmin && (
                        <div className="space-y-2">
                            <Label className="text-xs">Diferença</Label>
                            <div className={cn(
                                "h-10 flex items-center justify-center rounded-md border text-lg font-bold",
                                cashDifference === 0 && "bg-muted",
                                cashDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50",
                                cashDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50",
                            )}>
                                {formatCurrency(cashDifference)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cartão / PIX */}
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1">
                        <Label htmlFor="counted-card-pix" className="font-semibold">CARTÃO / PIX</Label>
                        {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(expectedCardPix)}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="counted-card-pix" className="sr-only">Valor Contado (Cartão/Pix)</Label>
                        <Input 
                            id="counted-card-pix" 
                            type="text"
                            placeholder="R$ 0,00"
                            value={countedCardPix}
                            onChange={(e) => setCountedCardPix(e.target.value)}
                            className="font-mono text-lg"
                        />
                    </div>
                    {isAdmin && (
                        <div className="space-y-2">
                            <Label className="text-xs">Diferença</Label>
                            <div className={cn(
                                "h-10 flex items-center justify-center rounded-md border text-lg font-bold",
                                cardPixDifference === 0 && "bg-muted",
                                cardPixDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50",
                                cardPixDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50",
                            )}>
                                {formatCurrency(cardPixDifference)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fiado */}
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1">
                        <Label htmlFor="counted-fiado" className="font-semibold">FIADO</Label>
                        {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(expectedFiado)}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="counted-fiado" className="sr-only">Valor Contado (Fiado)</Label>
                        <Input 
                            id="counted-fiado" 
                            type="text"
                            placeholder="R$ 0,00"
                            value={countedFiado}
                            onChange={(e) => setCountedFiado(e.target.value)}
                            className="font-mono text-lg"
                        />
                    </div>
                    {isAdmin && (
                        <div className="space-y-2">
                            <Label className="text-xs">Diferença</Label>
                            <div className={cn(
                                "h-10 flex items-center justify-center rounded-md border text-lg font-bold",
                                fiadoDifference === 0 && "bg-muted",
                                fiadoDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50",
                                fiadoDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50",
                            )}>
                                {formatCurrency(fiadoDifference)}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
          </Card>

          {isAdmin && (
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
           )}
        </CardContent>
      </Card>
    </div>
  )

    