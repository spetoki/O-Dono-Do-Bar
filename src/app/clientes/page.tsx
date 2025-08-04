
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { customers as initialCustomers } from '@/data/customers';
import type { Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X, UserPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  useEffect(() => {
    // Carrega clientes do localStorage e mescla com os clientes iniciais
    const storedCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const allCustomerIds = new Set(initialCustomers.map(c => c.id));
    const uniqueStoredCustomers = storedCustomers.filter(c => !allCustomerIds.has(c.id));
    
    setCustomers([...initialCustomers, ...uniqueStoredCustomers].sort((a,b) => a.name.localeCompare(b.name)));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <CardTitle>Gerenciamento de Clientes</CardTitle>
            <CardDescription>Cadastre, edite e consulte os clientes.</CardDescription>
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
            <Link href="/clientes/novo" className="flex-1 md:flex-none">
             <Button className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Cliente
            </Button>
            </Link>
            <Link href="/" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Saldo Devedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.cpf}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(customer.debt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
