
import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Cerveja Artesanal IPA',
    description: 'Uma IPA lupulada com notas cítricas e de pinho, final amargo e refrescante.',
    price: 15.50,
    imageUrl: 'https://placehold.co/400x400/FFC107/000000',
    category: 'Cervejas',
  },
  {
    id: 2,
    name: 'Refrigerante de Cola',
    description: 'O clássico refrigerante de cola, servido gelado para máxima refrescância.',
    price: 5.00,
    imageUrl: 'https://placehold.co/400x400/E53935/FFFFFF',
    category: 'Refrigerantes',
  },
  {
    id: 3,
    name: 'Vinho Tinto Seco',
    description: 'Um vinho tinto encorpado com sabores de frutas escuras e um toque de carvalho.',
    price: 45.00,
    imageUrl: 'https://placehold.co/400x400/800020/F5F5DC',
    category: 'Vinhos',
  },
  {
    id: 4,
    name: 'Água Mineral com Gás',
    description: 'Água mineral pura e borbulhante, uma opção saudável e refrescante.',
    price: 3.50,
    imageUrl: 'https://placehold.co/400x400/4FC3F7/FFFFFF',
    category: 'Águas',
  },
  {
    id: 5,
    name: 'Tabaco para Enrolar',
    description: 'Tabaco de alta qualidade, de queima suave, para quem prefere enrolar o seu próprio cigarro.',
    price: 25.00,
    imageUrl: 'https://placehold.co/400x400/A1887F/FFFFFF',
    category: 'Tabacaria',
  },
  {
    id: 6,
    name: 'Suco de Laranja Natural',
    description: 'Suco de laranja 100% natural, espremido na hora e cheio de vitaminas.',
    price: 8.00,
    imageUrl: 'https://placehold.co/400x400/FF9800/FFFFFF',
    category: 'Sucos',
  },
  {
    id: 7,
    name: 'Energético',
    description: 'Bebida energética para dar aquele impulso extra de energia e foco.',
    price: 9.75,
    imageUrl: 'https://placehold.co/400x400/00E676/000000',
    category: 'Energéticos',
  },
    {
    id: 8,
    name: 'Cigarro Eletrônico Descartável',
    description: 'Um vape descartável com sabor de menta, prático e fácil de usar.',
    price: 35.50,
    imageUrl: 'https://placehold.co/400x400/7E57C2/FFFFFF',
    category: 'Tabacaria',
  },
];
