
'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { OrderItem, Wine } from '@/types';
import { wines as allWines } from '@/data/wines';
import Header from '@/components/header';
import WineCatalog from '@/components/wine-catalog';
import OrderSummary from '@/components/order-summary';
import WineRecommender from '@/components/wine-recommender';
import { Separator } from '@/components/ui/separator';

const Home: FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addToOrder = (wine: Wine) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.wine.id === wine.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.wine.id === wine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { wine, quantity: 1 }];
    });
  };

  const updateQuantity = (wineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(wineId);
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.wine.id === wineId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromOrder = (wineId: number) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.wine.id !== wineId)
    );
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => acc + item.wine.price * item.quantity,
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
          <WineCatalog wines={allWines} onAddToOrder={addToOrder} />
        </main>
        <aside className="flex w-full flex-col border-t bg-card p-4 md:w-96 md:border-l md:border-t-0 lg:w-[450px]">
          <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="font-headline text-2xl font-semibold text-primary">Current Order</h2>
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
            <WineRecommender />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
