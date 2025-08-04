
'use client';

import type { FC } from 'react';
import { useState, useMemo, useCallback, useEffect, ChangeEvent } from 'react';
import type { OrderItem, Product, Sale } from '@/types';
import { getProducts } from '@/services/product-service';
import Header from '@/components/header';
import OrderSummary from '@/components/order-summary';
import ProductRecommender from '@/components/product-recommender';
import { Button } from '@/components/ui/button';
import { Search, DollarSign, X, Barcode } from 'lucide-react';
import ProductCatalogDialog from '@/components/product-catalog-dialog';
import { useToast } from '@/hooks/use-toast';
import BarcodeScannerDialog from '@/components/barcode-scanner-dialog';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import ReceiptDialog from '@/components/receipt-dialog';


const HomePage: FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState('Todos');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountPaidDisplay, setAmountPaidDisplay] = useState('');
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  useEffect(() => {
    async function fetchProducts() {
        setLoadingProducts(true);
        const productsFromDb = await getProducts();
        setProducts(productsFromDb);
        setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  const addToOrder = useCallback((product: Product, qty: number = 1) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [{ product, quantity: qty }, ...prevItems];
    });
  }, []);
  
  const handleScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToOrder(product, 1);
      setIsScannerOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Produto não encontrado",
        description: `Nenhum produto corresponde ao código de barras "${barcode}".`,
      });
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(productId);
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };
  
  const clearOrder = () => {
    setOrderItems([]);
    setAmountPaid(0);
    setAmountPaidDisplay('');
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [orderItems]);

  const openCatalog = (category: string = 'Todos') => {
    setInitialCategory(category);
    setIsCatalogOpen(true);
  };

  const handleFinalizeSale = () => {
    if (orderItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Carrinho Vazio',
        description: 'Adicione produtos antes de finalizar a venda.',
      });
      return;
    }
    
    if (!user) {
        toast({
            title: "Erro!",
            description: "Nenhum usuário logado. Não é possível finalizar a venda.",
            variant: "destructive"
        })
        return;
    }
    
    setIsReceiptOpen(true);
  };
  
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountPaidDisplay(value);
    
    // Allow empty string or valid number format up to 1,000,000
    if (value === '' || /^\d{1,7}([,.]\d{0,2})?$/.test(value)) {
       const numericValue = parseFloat(value.replace(',', '.')) || 0;
       if (numericValue <= 1000000) {
         setAmountPaid(numericValue);
       }
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  
  const total = useMemo(() => subtotal, [subtotal]);
  const change = useMemo(() => {
    return amountPaid > total ? amountPaid - total : 0;
  }, [amountPaid, total]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcuts for POS main page
      if (isCatalogOpen || isScannerOpen || isReceiptOpen) return;

      if (e.key.toLowerCase() === 'f7') {
        e.preventDefault();
        openCatalog();
      }
      if (e.key.toLowerCase() === 'f8') {
        e.preventDefault();
        setIsScannerOpen(true);
      }
      if (e.key.toLowerCase() === 'f10') {
        e.preventDefault();
        handleFinalizeSale();
      }
       if (e.key.toLowerCase() === 'f5') {
        e.preventDefault();
        clearOrder();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItems, total, isCatalogOpen, isScannerOpen, isReceiptOpen]);

  if (loading || !user || loadingProducts) {
    return (
       <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
        <Header />
         <main className="flex-1 overflow-y-auto p-2 md:p-4 flex flex-col gap-4">
           <Skeleton className="h-12 w-full" />
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 flex flex-col gap-4">
                 <Skeleton className="h-full w-full rounded-lg" />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="flex-1 rounded-lg min-h-[250px]" />
                 <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </div>
                 <div className="flex gap-2">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                 </div>
              </div>
           </div>
         </main>
      </div>
    )
  }


  return (
    <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-2 md:p-4 flex flex-col gap-4">
          <div className='flex justify-between items-center bg-primary text-primary-foreground p-2 rounded-md'>
            <h2 className="font-headline text-lg md:text-xl font-bold">CAIXA ABERTO</h2>
            {user && <span className='text-sm font-medium'>Operador: {user.name}</span>}
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
             {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-background/80 text-foreground p-2 md:p-4 rounded-lg flex-1 flex flex-col gap-4">
                  <ProductRecommender onAddToOrder={(product) => addToOrder(product, 1)} onCategoryClick={openCatalog} products={products} />
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md flex-wrap flex justify-between items-center gap-2">
                <h3 className="font-bold text-sm md:text-base">LISTA DE PRODUTOS</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setIsScannerOpen(true)}>
                    <Barcode className="mr-1 md:mr-2"/>
                    {isMobile ? '' : 'Escanear'} (F8)
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => openCatalog()}>
                    <Search className="mr-1 md:mr-2"/>
                    {isMobile ? '' : 'Pesquisar'} (F7)
                  </Button>
                </div>
              </div>
              <div className="flex-1 bg-background/80 rounded-lg p-1 md:p-2 min-h-[250px]">
                 <OrderSummary
                    items={orderItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromOrder}
                  />
              </div>
              <div className="grid grid-cols-3 gap-2">
                  <div className="bg-background text-foreground p-2 rounded-lg text-center flex flex-col justify-between">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase">Valor Recebido</h4>
                    <Input 
                      value={amountPaidDisplay} 
                      onChange={handleAmountChange} 
                      className="text-right font-mono text-base md:text-xl h-10 border-2 border-primary" 
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="bg-primary text-primary-foreground p-2 rounded-lg text-center">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase">Total</h4>
                    <p className="font-mono text-lg md:text-2xl font-extrabold flex items-center justify-center h-full">{formatCurrency(total)}</p>
                  </div>
                   <div className="bg-accent text-accent-foreground p-2 rounded-lg text-center">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase">Troco</h4>
                    <p className="font-mono text-lg md:text-2xl font-extrabold flex items-center justify-center h-full">{formatCurrency(change)}</p>
                  </div>
                </div>
                 <div className="flex gap-2">
                    <Button variant="destructive" onClick={clearOrder} className="flex-1 h-14 text-sm md:text-lg">
                      <X className="mr-2"/> {isMobile ? '' : 'CANCELAR'} (F5)
                      </Button>
                    <Button onClick={handleFinalizeSale} className="flex-1 h-14 text-sm md:text-lg">
                      <DollarSign className="mr-2"/> {isMobile ? '' : 'FINALIZAR'} (F10)
                      </Button>
                  </div>
            </div>
          </div>
        </main>
      </div>
      <ProductCatalogDialog 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)}
        products={products}
        onAddToOrder={(product) => addToOrder(product, 1)}
        initialCategory={initialCategory}
      />
      <BarcodeScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
      <ReceiptDialog
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onFinalize={() => {
            setIsReceiptOpen(false);
            clearOrder();
        }}
        orderItems={orderItems}
        subtotal={subtotal}
      />
    </div>
  );
};

export default HomePage;
