
'use client';

import type { FC } from 'react';
import { ShoppingCart, PackagePlus, Boxes, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header: FC = () => {
  const { toast } = useToast();
  const pathname = usePathname();

  const handleComingSoon = (feature: string) => {
    toast({
      title: 'Em Breve!',
      description: `A funcionalidade de ${feature} está em desenvolvimento.`,
    });
  };

  const managementLinks = [
     {
      href: '/cadastro',
      label: 'Cadastrar Itens',
      icon: PackagePlus,
      active: pathname === '/cadastro',
      onClick: () => handleComingSoon('Cadastrar Itens'),
    },
    {
      href: '/estoque',
      label: 'Estoque',
      icon: Boxes,
      active: pathname === '/estoque',
    },
    {
      href: '/vendas',
      label: 'Vendas',
      icon: LineChart,
      active: pathname === '/vendas',
    },
  ];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-primary px-4 md:px-6 text-primary-foreground">
      <Link href="/" className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            YZIDRO - PDV
          </h1>
          <p className="text-xs">SISTEMAS ERP</p>
        </div>
      </Link>
       <div className="flex items-center gap-2">
         {managementLinks.map(({ href, label, icon: Icon, active, onClick }) => {
            const buttonContent = (
              <>
                <Icon className="mr-2" />
                {label}
              </>
            );
            
            const buttonProps = {
                variant: active ? 'default' : 'secondary',
                className: cn(active && 'bg-primary-foreground/90 text-primary hover:bg-primary-foreground'),
                onClick: onClick
            };

            return onClick ? (
                 <Button {...buttonProps} onClick={onClick} key={href}>
                    {buttonContent}
                </Button>
            ) : (
                <Link href={href} key={href}>
                    <Button {...buttonProps}>
                        {buttonContent}
                    </Button>
                </Link>
            )
         })}
      </div>
    </header>
  );
};

export default Header;
