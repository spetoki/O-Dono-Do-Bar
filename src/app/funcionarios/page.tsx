
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { X, UserPlus, Shield, Badge, Pencil } from 'lucide-react';
import { useAuth } from '@/context/auth-context';


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const { user } = useAuth();

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
  
  const handleEdit = (userId: number) => {
    router.push(`/funcionarios/editar/${userId}`);
  };


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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {u.role === 'admin' ? <Shield className="h-4 w-4 text-primary" /> : <Badge className="h-4 w-4 text-muted-foreground" />}
                        <span className="capitalize">{u.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => handleEdit(u.id)} disabled={user?.id === u.id}>
                        <Pencil className="h-4 w-4" />
                         <span className="sr-only">Editar</span>
                     </Button>
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
