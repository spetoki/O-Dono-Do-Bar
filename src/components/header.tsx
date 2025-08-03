
'use client';

import type { FC } from 'react';
import { ShoppingCart, PackagePlus, Boxes, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Header: FC = () => {
  const { toast } = useToast();

  const handleComingSoon = (feature: string) => {
    toast({
      title: 'Em Breve!',
      description: `A funcionalidade de ${feature} está em desenvolvimento.`,
    });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-primary px-4 md:px-6 text-primary-foreground">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            YZIDRO - PDV
          </h1>
          <p className="text-xs">SISTEMAS ERP</p>
        </div>
      </div>
       <div className="flex items-center gap-2">
         <Button variant="secondary" onClick={() => handleComingSoon('Cadastrar Itens')}>
            <PackagePlus className="mr-2" />
            Cadastrar Itens
        </Button>
        <Button variant="secondary" onClick={() => handleComingSoon('Estoque')}>
            <Boxes className="mr-2" />
            Estoque
        </Button>
        <Button variant="secondary" onClick={() => handleComingSoon('Vendas')}>
            <LineChart className="mr-2" />
            Vendas
        </Button>
      </div>
    </header>
  );
};

export default Header;
