
'use client';

import type { FC } from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { OrderItem, Product } from '@/types';
import { products as allProducts } from '@/data/products';
import Header from '@/components/header';
import OrderSummary from '@/components/order-summary';
import ProductRecommender from '@/components/product-recommender';
import { Button } from '@/components/ui/button';
import { Search, DollarSign, X, Barcode } from 'lucide-react';
import ProductCatalogDialog from '@/components/product-catalog-dialog';
import { useToast } from '@/hooks/use-toast';
import BarcodeScannerDialog from '@/components/barcode-scanner-dialog';

const Home: FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { toast } = useToast();

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
     toast({
      title: "Produto Adicionado",
      description: `${product.name} foi adicionado ao seu pedido.`,
    });
  }, [toast]);
  
  const handleScan = (barcode: string) => {
    const product = allProducts.find(p => p.id.toString() === barcode);
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

  const updateQuantity = (productId: number, newQuantity: number) => {
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

  const removeFromOrder = (productId: number) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };
  
  const clearOrder = () => {
    setOrderItems([]);
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [orderItems]);

  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f7') {
        e.preventDefault();
        setIsCatalogOpen(true);
      }
      if (e.key.toLowerCase() === 'f8') {
        e.preventDefault();
        setIsScannerOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <div className="flex h-screen w-full flex-col bg-secondary text-secondary-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className='flex justify-between items-center bg-primary text-primary-foreground p-2 rounded-md'>
            <h2 className="font-headline text-xl font-bold">CAIXA ABERTO</h2>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Left Column */}
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="bg-background/80 text-foreground p-4 rounded-lg flex-1 flex flex-col gap-4">
                  <ProductRecommender />
                </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md flex justify-between items-center gap-2">
                <h3 className="font-bold">LISTA DE PRODUTOS</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setIsScannerOpen(true)}>
                    <Barcode className="mr-2"/>
                    Escanear (F8)
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setIsCatalogOpen(true)}>
                    <Search className="mr-2"/>
                    Pesquisar (F7)
                  </Button>
                </div>
              </div>
              <div className="flex-1 bg-background/80 rounded-lg p-2">
                 <OrderSummary
                    items={orderItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromOrder}
                  />
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center">
                    <h4 className="font-bold text-sm">SUBTOTAL</h4>
                    <p className="font-mono text-3xl font-extrabold">{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center">
                    <h4 className="font-bold text-sm">TOTAL PAGO</h4>
                    <p className="font-mono text-3xl font-extrabold">{formatCurrency(total)}</p>
                  </div>
                   <div className="bg-accent text-accent-foreground p-4 rounded-lg text-center">
                    <h4 className="font-bold text-sm">TROCO</h4>
                    <p className="font-mono text-3xl font-extrabold">{formatCurrency(0)}</p>
                  </div>
                </div>
                 <div className="flex gap-2">
                    <Button variant="destructive" onClick={clearOrder} className="flex-1 h-14 text-lg">
                      <X className="mr-2"/> CANCELAR VENDA (F5)
                      </Button>
                    <Button className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 text-white">
                      <DollarSign className="mr-2"/> FINALIZAR VENDA (F10)
                      </Button>
                  </div>
            </div>
          </div>
        </main>
      </div>
      <ProductCatalogDialog 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)}
        products={allProducts}
        onAddToOrder={(product) => addToOrder(product, 1)}
      />
      <BarcodeScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default Home;
