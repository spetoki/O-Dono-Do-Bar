
import type { User } from '@/types';

// IMPORTANT: This is for demonstration purposes only.
// In a real application, NEVER store plain text passwords.
// Passwords should be hashed and salted securely on a server.

export const users: User[] = [
  { 
    id: 1, 
    name: 'Admin', 
    username: 'admin', 
    password: 'admin', // Demo password
    role: 'admin' 
  },
  { 
    id: 2, 
    name: 'Yzydro', 
    username: 'yzidro', 
    password: '123', // Demo password
    role: 'admin' 
  },
  { 
    id: 3, 
    name: 'Caixa 1', 
    username: 'caixa', 
    password: '123', // Demo password
    role: 'caixa' 
  },
];
