
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Optional: Add role-based access control
    // if (!loading && user?.role !== 'admin') {
    //   router.push('/');
    // }
  }, [user, loading, router]);

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
