
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { salesData, type Sale } from '@/data/sales';
import { subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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

export default function SalesPage() {
  const [timeRange, setTimeRange] = useState('day');

  const filterSalesByDate = (sales: Sale[], range: string): Sale[] => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      case 'day':
      default:
        startDate = subDays(now, 1);
        break;
    }
    
    if (range === 'day') {
        return sales.filter(sale => new Date(sale.date).toDateString() === now.toDateString());
    }

    return sales.filter(sale => new Date(sale.date) >= startDate);
  };
  
  const filteredSales = filterSalesByDate(salesData, timeRange);

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalSales = filteredSales.length;
  
  const salesByCategory = filteredSales
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      const category = item.product.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.quantity * item.product.price;
      return acc;
    }, {} as Record<string, number>);
    
  const chartData = Object.entries(salesByCategory).map(([name, total]) => ({
      name,
      total,
  })).sort((a, b) => b.total - a.total);


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Relatório de Vendas</CardTitle>
            <CardDescription>Analise o desempenho de suas vendas.</CardDescription>
          </div>
          <Link href="/">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="day">Hoje</TabsTrigger>
              <TabsTrigger value="week">Esta Semana</TabsTrigger>
              <TabsTrigger value="month">Este Mês</TabsTrigger>
              <TabsTrigger value="year">Este Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                    >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">{totalSales} vendas no período</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSales > 0 ? totalRevenue / totalSales : 0)}</div>
                  <p className="text-xs text-muted-foreground">Valor médio por venda</p>
              </CardContent>
          </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto">
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSales.slice(0,10).map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell className="font-mono text-xs">{formatDate(new Date(sale.date))}</TableCell>
                                <TableCell>{sale.items.map(i => i.product.name).join(', ')}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Receita gerada por cada categoria de produto.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value as number)} />
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
