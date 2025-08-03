
import type { FC } from 'react';
import { ShoppingCart } from 'lucide-react';

const Header: FC = () => {
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
       <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold tracking-tight text-right">
          DOMTEC SISTEMAS
        </h1>
      </div>
    </header>
  );
};

export default Header;
