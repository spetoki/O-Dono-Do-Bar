
'use client';

import type { FC } from 'react';
import { useState, useMemo, useCallback } from 'react';
import type { OrderItem, Product } from '@/types';
import { products as allProducts } from '@/data/products';
import Header from '@/components/header';
import OrderSummary from '@/components/order-summary';
import ProductRecommender from '@/components/product-recommender';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Search, List, Trash, Plus, Minus, X, DollarSign } from 'lucide-react';
import ProductCatalogDialog from '@/components/product-catalog-dialog';

const Home: FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<'productCode' | 'quantity'>(
    'productCode'
  );
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState('1');

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
  
  const selectedItem = orderItems.length > 0 ? orderItems[0] : null;

  const clearOrder = () => {
    setOrderItems([]);
    setProductCode('');
    setQuantity('1');
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [orderItems]);

  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleNumpadInput = (value: string) => {
    if (activeInput === 'productCode') {
      setProductCode((prev) => prev + value);
    } else {
      setQuantity((prev) => (prev === '1' ? value : prev + value));
    }
  };

  const handleAddByCode = () => {
    const product = allProducts.find(p => p.id === parseInt(productCode, 10));
    if (product) {
      addToOrder(product, parseInt(quantity, 10));
      setProductCode('');
      setQuantity('1');
      setActiveInput('productCode');
    } else {
      // TODO: show error toast
      alert('Produto não encontrado!');
      setProductCode('');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);


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
               {/* Inputs and Numpad */}
                <div className="bg-background/80 text-foreground p-4 rounded-lg flex-1 flex flex-col gap-4 justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold" onClick={() => setActiveInput('productCode')}>CÓDIGO DE BARRAS</label>
                      <input
                        type="text"
                        value={productCode}
                        readOnly
                        onFocus={() => setActiveInput('productCode')}
                        className={`w-full p-2 mt-1 rounded-md bg-input text-foreground text-lg font-mono ${activeInput === 'productCode' ? 'ring-2 ring-ring' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold" onClick={() => setActiveInput('quantity')}>QUANTIDADE</label>
                       <input
                        type="text"
                        value={quantity}
                        readOnly
                        onFocus={() => setActiveInput('quantity')}
                        className={`w-full p-2 mt-1 rounded-md bg-input text-foreground text-lg font-mono ${activeInput === 'quantity' ? 'ring-2 ring-ring' : ''}`}
                      />
                    </div>
                     <div>
                      <label className="text-sm font-bold">TOTAL DO ITEM</label>
                       <div className="w-full p-2 mt-1 rounded-md bg-muted text-muted-foreground text-lg font-mono">
                         {selectedItem ? formatCurrency(selectedItem.product.price * selectedItem.quantity) : 'R$ 0,00'}
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', ','].map((key) => (
                      <Button key={key} onClick={() => handleNumpadInput(key)} variant="outline" className="h-16 text-2xl font-bold bg-card text-card-foreground">
                        {key}
                      </Button>
                    ))}
                  </div>
                   <Button onClick={handleAddByCode} className="h-16 text-2xl font-bold bg-accent text-accent-foreground">Adicionar Item</Button>
                </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-md flex justify-between items-center">
                <h3 className="font-bold">LISTA DE PRODUTOS</h3>
                <Button size="sm" variant="secondary" onClick={() => setIsCatalogOpen(true)}>
                  <Search className="mr-2"/>
                  Pesquisar Produto (F7)
                  </Button>
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
    </div>
  );
};

export default Home;
