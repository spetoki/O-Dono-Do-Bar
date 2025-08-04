
'use client';

import Link from 'next/link';
import { customers } from '@/data/customers';
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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Gerenciamento de Clientes</CardTitle>
            <CardDescription>Cadastre, edite e consulte os clientes.</CardDescription>
        </div>
        <div className='flex gap-2'>
             <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Cliente
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
        <ScrollArea className="h-[70vh]">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
