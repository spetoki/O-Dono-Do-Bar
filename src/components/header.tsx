
'use client';

import type { FC } from 'react';
import { ShoppingCart, PackagePlus, Boxes, LineChart, Users, Menu, X, Cog, LogOut, UserCircle, ShieldCheck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context';


const Header: FC = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user, logout } = useAuth();


  const managementLinks = [
     {
      href: '/cadastro',
      label: 'Cadastrar Itens',
      icon: PackagePlus,
      active: pathname === '/cadastro' || pathname.startsWith('/cadastro/'),
      adminOnly: false,
    },
    {
      href: '/estoque',
      label: 'Estoque',
      icon: Boxes,
       active: pathname === '/estoque' || pathname.startsWith('/estoque/'),
       adminOnly: false,
    },
    {
      href: '/vendas',
      label: 'Histórico de Vendas',
      icon: LineChart,
      active: pathname === '/vendas',
      adminOnly: false,
    },
     {
      href: '/clientes',
      label: 'Clientes',
      icon: Users,
      active: pathname === '/clientes' || pathname.startsWith('/clientes/'),
      adminOnly: false,
    },
    {
      href: '/fechamento',
      label: 'Fechar Caixa',
      icon: DollarSign,
      active: pathname === '/fechamento',
      adminOnly: false,
    },
    {
      href: '/funcionarios',
      label: 'Funcionários',
      icon: ShieldCheck,
      active: pathname === '/funcionarios' || pathname.startsWith('/funcionarios/'),
      adminOnly: true,
    },
     {
      href: '/configuracoes',
      label: 'Configurações',
      icon: Cog,
      active: pathname === '/configuracoes',
      adminOnly: false,
    },
  ];
  
  const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
    <div className={cn("flex items-center gap-2", isMobile && "flex-col items-start w-full")}>
         {managementLinks.map(({ href, label, icon: Icon, active, adminOnly }) => {
            if (adminOnly && user?.role !== 'admin') {
                return null;
            }

            const buttonContent = (
              <>
                <Icon className={cn(isMobile ? "mr-4" : "mr-2")} />
                {label}
              </>
            );
            
            const buttonProps = {
                variant: active ? 'default' : ('secondary' as any),
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
              {user && (
                <>
                <div className="absolute bottom-4 left-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="w-full justify-start gap-2">
                         <UserCircle />
                         <div className='text-left'>
                           <p className='text-sm font-bold'>{user.name}</p>
                           <p className='text-xs capitalize'>{user.role}</p>
                         </div>
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2">
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>
                </>
              )}
          </SheetContent>
        </Sheet>
      ) : (
      <div className='flex items-center gap-2'>
        <NavLinks />
        {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <UserCircle />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex flex-col items-start gap-1'>
                    <p className='font-bold'>{user.name}</p>
                    <p className='text-muted-foreground capitalize'>{user.role}</p>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
      )}
    </header>
  );
};

export default Header;
