
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/header';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

const adminRoutes = ['/funcionarios', '/funcionarios/novo'];

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Role-based access control
    if (!loading && user) {
       if (adminRoutes.some(route => pathname.startsWith(route)) && user.role !== 'admin') {
         console.log("Redirecting non-admin from admin route");
         router.push('/');
       }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-background text-foreground">
          <div className="mx-auto w-full max-w-6xl">
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <div className="pt-4">
                 <Skeleton className="h-[400px] w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Specific check again for the case where user loads but is not admin for admin routes
  if (adminRoutes.some(route => pathname.startsWith(route)) && user.role !== 'admin') {
      return (
         <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-background text-foreground">
               <div className="mx-auto w-full max-w-6xl text-center">
                  <h1 className="text-2xl font-bold">Acesso Negado</h1>
                  <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
               </div>
            </main>
         </div>
      )
  }


  return (
    <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
    <Header />
    <main className="flex-1 overflow-y-auto p-2 md:p-6 bg-background text-foreground">
        <div className="mx-auto w-full max-w-6xl">
            {children}
        </div>
    </main>
    </div>
  );
}
