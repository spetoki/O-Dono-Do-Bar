
'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ProductCatalog from './product-catalog';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface ProductCatalogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToOrder: (product: Product) => void;
}

const ProductCatalogDialog: FC<ProductCatalogDialogProps> = ({
  isOpen,
  onClose,
  products,
  onAddToOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = useMemo(() => {
    const allCategories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
    return allCategories;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
      )
      .filter(p => selectedCategory === 'Todos' || p.category === selectedCategory);
  }, [products, searchTerm, selectedCategory]);

  const handleSelectAndClose = (product: Product) => {
    onAddToOrder(product);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Catálogo de Produtos</DialogTitle>
          <DialogDescription>
            Pesquise por nome ou código para adicionar um produto à venda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <Input 
            placeholder="Pesquisar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex-1 overflow-y-auto">
            <ProductCatalog products={filteredProducts} onAddToOrder={handleSelectAndClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCatalogDialog;
