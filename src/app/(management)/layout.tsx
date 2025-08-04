
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/header';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

// Only routes starting with these paths require admin role
const adminRoutes = ['/funcionarios', '/funcionarios/novo', '/funcionarios/editar'];

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAccessingAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // If it's an admin route and the user is not an admin, redirect them.
    if (isAccessingAdminRoute && user.role !== 'admin') {
       console.log("Redirecting non-admin from admin route:", pathname);
       router.push('/');
    }
  }, [user, loading, router, pathname, isAccessingAdminRoute]);

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
  
  // If the user data has loaded, but they are not an admin and trying to access an admin route
  if (isAccessingAdminRoute && user.role !== 'admin') {
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
