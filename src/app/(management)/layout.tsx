
import Header from '@/components/header';

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background text-foreground">
        <div className="mx-auto w-full max-w-6xl">
            {children}
        </div>
      </main>
    </div>
  );
}
