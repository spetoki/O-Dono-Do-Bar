
'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { OrderItem, Product } from '@/types';
import { products as allProducts } from '@/data/products';
import Header from '@/components/header';
import ProductCatalog from '@/components/product-catalog';
import OrderSummary from '@/components/order-summary';
import ProductRecommender from '@/components/product-recommender';
import { Separator } from '@/components/ui/separator';

const Home: FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addToOrder = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
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

  const tax = useMemo(() => subtotal * 0.08, [subtotal]); // 8% tax
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <ProductCatalog products={allProducts} onAddToOrder={addToOrder} />
        </main>
        <aside className="flex w-full flex-col border-t bg-card p-4 md:w-96 md:border-l md:border-t-0 lg:w-[450px]">
          <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="font-headline text-2xl font-semibold text-primary">Pedido Atual</h2>
            <OrderSummary
              items={orderItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromOrder}
              onClearOrder={clearOrder}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          </div>
          <Separator className="my-4" />
          <div className='overflow-y-auto pr-2'>
            <ProductRecommender />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
