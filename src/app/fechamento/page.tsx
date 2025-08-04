
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { salesData as initialSalesData, type Sale } from '@/data/sales';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Printer, Calculator, CreditCard, ClipboardList, BookUser, Check, Library } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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

const calculateTotals = (sales: Sale[]) => {
    const totals = sales.reduce((acc, sale) => {
      if (sale.paymentMethod === 'dinheiro') {
        acc.cash += sale.total;
      } else if (sale.paymentMethod === 'cartao' || sale.paymentMethod === 'pix') {
        acc.cardPix += sale.total;
      } else if (sale.paymentMethod === 'fiado') {
        acc.fiado += sale.total;
      }
      return acc;
    }, { cash: 0, cardPix: 0, fiado: 0 });

    const totalRevenue = totals.cash + totals.cardPix + totals.fiado;
    return { ...totals, totalRevenue };
};


export default function CloseoutPage() {
  const [countedCash, setCountedCash] = useState('');
  const [countedCardPix, setCountedCardPix] = useState('');
  const [countedFiado, setCountedFiado] = useState('');
  const [allSales, setAllSales] = useState<Sale[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
        const initialSalesIds = new Set(initialSalesData.map(s => s.id));
        const uniqueStoredSales = storedSales.filter(s => !initialSalesIds.has(s.id));

        const combinedSales = [...initialSalesData, ...uniqueStoredSales];
        setAllSales(combinedSales.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  // Memoized sales data for today
  const todaysSales = useMemo(() => {
    const now = new Date();
    return allSales.filter(sale => new Date(sale.date).toDateString() === now.toDateString());
  }, [allSales]);

  // Filter sales for the logged-in operator
  const operatorSales = useMemo(() => {
    if (!user) return [];
    return todaysSales.filter(sale => sale.operatorId === user.id);
  }, [todaysSales, user]);

  // Totals for the logged-in operator
  const { 
    cash: operatorExpectedCash, 
    cardPix: operatorExpectedCardPix, 
    fiado: operatorExpectedFiado, 
    totalRevenue: operatorTotalRevenue 
  } = useMemo(() => calculateTotals(operatorSales), [operatorSales]);

  // Totals for all of today's sales (for admin view)
  const { 
    cash: totalExpectedCash, 
    cardPix: totalExpectedCardPix, 
    fiado: totalExpectedFiado, 
    totalRevenue: totalRevenueAll 
  } = useMemo(() => calculateTotals(todaysSales), [todaysSales]);

  // Memoized differences, calculated based on the form inputs against admin's view of all sales
  const { cashDifference, cardPixDifference, fiadoDifference } = useMemo(() => {
    const parseInput = (value: string) => parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;

    const countedCashNum = parseInput(countedCash);
    const countedCardPixNum = parseInput(countedCardPix);
    const countedFiadoNum = parseInput(countedFiado);

    return {
      cashDifference: countedCashNum - totalExpectedCash,
      cardPixDifference: countedCardPixNum - totalExpectedCardPix,
      fiadoDifference: countedFiadoNum - totalExpectedFiado,
    };
  }, [countedCash, countedCardPix, countedFiado, totalExpectedCash, totalExpectedCardPix, totalExpectedFiado]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleFinalizeCloseout = () => {
     if (!isAdmin) {
      toast({
        title: 'Acesso Negado',
        description: 'Apenas administradores podem finalizar o fechamento do dia.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, you would save this to a backend database.
    // For this demo, we'll archive sales in localStorage.
    const now = new Date();
    const todaysDateString = now.toDateString();
    
    const salesToArchive = allSales.filter(sale => new Date(sale.date).toDateString() === todaysDateString);
    const salesToKeep = allSales.filter(sale => new Date(sale.date).toDateString() !== todaysDateString);
    
    // 1. Get existing archives or create a new one
    const existingArchives: Record<string, any> = JSON.parse(localStorage.getItem('sales_archive') || '{}');
    const archiveKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 2. Add today's sales to the archive
    existingArchives[archiveKey] = {
      closeoutDate: now.toISOString(),
      closedBy: user?.name,
      sales: salesToArchive,
      conference: {
        countedCash,
        countedCardPix,
        countedFiado,
        cashDifference,
        cardPixDifference,
        fiadoDifference,
      },
      ...calculateTotals(salesToArchive)
    };

    // 3. Save the updated archive
    localStorage.setItem('sales_archive', JSON.stringify(existingArchives));

    // 4. Update the active sales list to remove today's sales
    localStorage.setItem('sales', JSON.stringify(salesToKeep));

    // 5. Update the state to reflect the change on the screen
    setAllSales(salesToKeep);

    toast({
      title: 'Caixa Fechado e Arquivado!',
      description: `As vendas de hoje foram salvas e o caixa foi zerado para o próximo dia.`,
    });

    // Clear inputs after finalizing
    setCountedCash('');
    setCountedCardPix('');
    setCountedFiado('');
  };


  const SalesTable = ({ sales, showOperator = false }: { sales: Sale[], showOperator?: boolean }) => (
     <div className="w-full overflow-x-auto border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Horário</TableHead>
                {showOperator && <TableHead>Operador</TableHead>}
                <TableHead>Itens</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={showOperator ? 5 : 4} className="text-center h-24 text-muted-foreground">
                       Nenhuma venda registrada neste período.
                     </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale) => (
                      <TableRow key={sale.id}>
                          <TableCell className="font-mono text-xs">{formatDate(new Date(sale.date))}</TableCell>
                          {showOperator && <TableCell className="text-xs">{sale.operatorName}</TableCell>}
                          <TableCell className="truncate max-w-[200px] text-xs">{sale.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}</TableCell>
                          <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                      </TableRow>
                  ))
                )}
            </TableBody>
            {sales.length > 0 && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={showOperator ? 4 : 3} className="text-right font-bold text-base">Total</TableCell>
                        <TableCell className="text-right font-bold font-mono text-base">{formatCurrency(calculateTotals(sales).totalRevenue)}</TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    </div>
  )

  const SummaryCard = ({ title, value, icon, salesCount }: { title: string, value: number, icon: React.ReactNode, salesCount?: number }) => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(value)}</div>
            {salesCount !== undefined && <p className="text-xs text-muted-foreground">{salesCount} vendas</p>}
        </CardContent>
    </Card>
  )

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
            <CardDescription>Relatórios de vendas e conferência do caixa do dia de hoje.</CardDescription>
          </div>
          <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
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
             <Tabs defaultValue="operator-report" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                    <TabsTrigger value="operator-report"><BookUser className="mr-2 h-4 w-4"/>Meu Relatório</TabsTrigger>
                    <TabsTrigger value="conference"><Check className="mr-2 h-4 w-4"/>Conferência</TabsTrigger>
                    {isAdmin && <TabsTrigger value="general-report"><Library className="mr-2 h-4 w-4"/>Geral do Dia</TabsTrigger>}
                </TabsList>
                
                {/* Operator's Personal Report Tab */}
                <TabsContent value="operator-report" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Relatório do Operador: {user?.name}</CardTitle>
                            <CardDescription>Resumo das suas vendas de hoje para auxiliar no fechamento do caixa.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                               <SummaryCard title="Minha Receita Total" value={operatorTotalRevenue} icon={<Calculator />} salesCount={operatorSales.length} />
                               <SummaryCard title="Recebido em Dinheiro" value={operatorExpectedCash} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>} />
                               <SummaryCard title="Recebido em Cartão/Pix" value={operatorExpectedCardPix} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
                               <SummaryCard title="Registrado em Fiado" value={operatorExpectedFiado} icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Minhas Vendas de Hoje</h3>
                                <div className="max-h-[400px] overflow-y-auto">
                                    <SalesTable sales={operatorSales} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Cash Conference Tab */}
                <TabsContent value="conference" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conferência de Caixa</CardTitle>
                            <CardDescription>
                            Após conferir seu relatório, insira os valores totais apurados em seu turno. Apenas administradores podem finalizar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Dinheiro */}
                            <div className="grid md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-1">
                                    <Label htmlFor="counted-cash" className="font-semibold">DINHEIRO</Label>
                                    {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(totalExpectedCash)}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="counted-cash" className="sr-only">Valor Contado (Dinheiro)</Label>
                                    <Input id="counted-cash" type="text" placeholder="R$ 0,00" value={countedCash} onChange={(e) => setCountedCash(e.target.value)} className="font-mono text-lg"/>
                                </div>
                                {isAdmin && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Diferença</Label>
                                        <div className={cn("h-10 flex items-center justify-center rounded-md border text-lg font-bold", countedCash.trim() !== '' && cashDifference === 0 && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-500/50", cashDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50", cashDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50", countedCash.trim() === '' && "bg-muted")}>
                                            {countedCash.trim() !== '' ? formatCurrency(cashDifference) : '...'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cartão / PIX */}
                            <div className="grid md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-1">
                                    <Label htmlFor="counted-card-pix" className="font-semibold">CARTÃO / PIX</Label>
                                    {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(totalExpectedCardPix)}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="counted-card-pix" className="sr-only">Valor Contado (Cartão/Pix)</Label>
                                    <Input id="counted-card-pix" type="text" placeholder="R$ 0,00" value={countedCardPix} onChange={(e) => setCountedCardPix(e.target.value)} className="font-mono text-lg"/>
                                </div>
                                {isAdmin && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Diferença</Label>
                                        <div className={cn("h-10 flex items-center justify-center rounded-md border text-lg font-bold", countedCardPix.trim() !== '' && cardPixDifference === 0 && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-500/50", cardPixDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50", cardPixDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50", countedCardPix.trim() === '' && "bg-muted")}>
                                            {countedCardPix.trim() !== '' ? formatCurrency(cardPixDifference) : '...'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fiado */}
                            <div className="grid md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-1">
                                    <Label htmlFor="counted-fiado" className="font-semibold">FIADO</Label>
                                    {isAdmin && <p className="text-xs text-muted-foreground">Esperado: {formatCurrency(totalExpectedFiado)}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="counted-fiado" className="sr-only">Valor Contado (Fiado)</Label>
                                    <Input id="counted-fiado" type="text" placeholder="R$ 0,00" value={countedFiado} onChange={(e) => setCountedFiado(e.target.value)} className="font-mono text-lg"/>
                                </div>
                                {isAdmin && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Diferença</Label>
                                        <div className={cn("h-10 flex items-center justify-center rounded-md border text-lg font-bold", countedFiado.trim() !== '' && fiadoDifference === 0 && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-500/50", fiadoDifference > 0 && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-500/50", fiadoDifference < 0 && "bg-destructive/10 text-destructive border-destructive/50",  countedFiado.trim() === '' && "bg-muted")}>
                                            {countedFiado.trim() !== '' ? formatCurrency(fiadoDifference) : '...'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full md:w-auto ml-auto" onClick={handleFinalizeCloseout}>Finalizar e Arquivar Caixa</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                 {/* Admin-only General Report Tab */}
                {isAdmin && (
                    <TabsContent value="general-report" className="mt-4">
                        <Card>
                        <CardHeader>
                            <CardTitle>Relatório Geral do Dia</CardTitle>
                            <CardDescription>Visão completa de todas as vendas realizadas hoje por todos os operadores.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                               <SummaryCard title="Receita Total (Geral)" value={totalRevenueAll} icon={<Calculator />} salesCount={todaysSales.length} />
                               <SummaryCard title="Dinheiro (Geral)" value={totalExpectedCash} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>} />
                               <SummaryCard title="Cartão/Pix (Geral)" value={totalExpectedCardPix} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
                               <SummaryCard title="Fiado (Geral)" value={totalExpectedFiado} icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />} />
                            </div>
                             <div className="space-y-2">
                                <h3 className="font-semibold">Todas as Vendas de Hoje</h3>
                                 <div className="max-h-[400px] overflow-y-auto">
                                    <SalesTable sales={todaysSales} showOperator={true} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </TabsContent>
                )}
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
