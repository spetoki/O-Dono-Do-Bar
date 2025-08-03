
import type { FC } from 'react';
import { Beer } from 'lucide-react';

const Header: FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Beer className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">
          Distribuidora
        </h1>
      </div>
    </header>
  );
};

export default Header;
