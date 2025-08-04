
'use client';

import type { FC } from 'react';
import { ShoppingCart, PackagePlus, Boxes, LineChart, Users, Menu, X, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';


const Header: FC = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const managementLinks = [
     {
      href: '/cadastro',
      label: 'Cadastrar Itens',
      icon: PackagePlus,
      active: pathname === '/cadastro' || pathname.startsWith('/cadastro/'),
    },
    {
      href: '/estoque',
      label: 'Estoque',
      icon: Boxes,
       active: pathname === '/estoque' || pathname.startsWith('/estoque/'),
    },
    {
      href: '/vendas',
      label: 'Histórico de Vendas',
      icon: LineChart,
      active: pathname === '/vendas',
    },
     {
      href: '/clientes',
      label: 'Clientes',
      icon: Users,
      active: pathname === '/clientes' || pathname.startsWith('/clientes/'),
    },
     {
      href: '/configuracoes',
      label: 'Configurações',
      icon: Cog,
      active: pathname === '/configuracoes',
    },
  ];
  
  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    <div className={cn("flex items-center gap-2", isMobile && "flex-col items-start w-full")}>
         {managementLinks.map(({ href, label, icon: Icon, active }) => {
            const buttonContent = (
              <>
                <Icon className={cn(isMobile ? "mr-4" : "mr-2")} />
                {label}
              </>
            );
            
            const buttonProps = {
                variant: active ? 'default' : 'secondary',
                className: cn(
                  active && 'bg-primary-foreground/90 text-primary hover:bg-primary-foreground', 
                  isMobile && "w-full justify-start text-lg p-6"
                  ),
            };

            return (
                <Link href={href} key={href} onClick={() => setSheetOpen(false)}>
                    <Button {...buttonProps}>
                        {buttonContent}
                    </Button>
                </Link>
            )
         })}
      </div>
  );


  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-primary px-4 md:px-6 text-primary-foreground">
      <Link href="/" className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8" />
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">
            O Dono Do Bar
          </h1>
          <p className="text-xs">Tudo no controle. Até o fiado.</p>
        </div>
      </Link>
      
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-secondary">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-secondary-foreground">Menu</h2>
             </div>
             <NavLinks isMobile />
          </SheetContent>
        </Sheet>
      ) : (
       <NavLinks />
      )}
    </header>
  );
};

export default Header;
