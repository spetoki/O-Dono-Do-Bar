
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { users as initialUsers } from '@/data/users';
import type { User } from '@/types';
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
import { X, UserPlus, Shield, Badge } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this from your backend.
    // For this demo, we merge initial users with users from localStorage.
    const storedUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Create a Set of initial usernames to check for duplicates
    const initialUsernames = new Set(initialUsers.map(u => u.username));
    
    // Filter out stored users that are already in the initial list
    const uniqueStoredUsers = storedUsers.filter(u => !initialUsernames.has(u.username));
    
    // Combine and sort users by name
    setUsers([...initialUsers, ...uniqueStoredUsers].sort((a,b) => a.name.localeCompare(b.name)));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <CardTitle>Gerenciamento de Funcionários</CardTitle>
            <CardDescription>Cadastre, edite e consulte os usuários do sistema.</CardDescription>
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
            <Link href="/funcionarios/novo" className="flex-1 md:flex-none">
             <Button className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Funcionário
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
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                {/* Add actions column in the future if needed */}
                {/* <TableHead className="text-right">Ações</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {user.role === 'admin' ? <Shield className="h-4 w-4 text-primary" /> : <Badge className="h-4 w-4 text-muted-foreground" />}
                        <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-right">
                     <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                     </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
