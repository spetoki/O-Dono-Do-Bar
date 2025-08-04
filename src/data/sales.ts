
import type { Sale } from '@/types';
import { products } from './products';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';

const getRandomItems = (): { product: any, quantity: number }[] => {
    const items = [];
    const numItems = Math.floor(Math.random() * 5) + 1;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numItems; i++) {
        const product = shuffled[i];
        if (product) {
            items.push({
                product,
                quantity: Math.floor(Math.random() * 3) + 1,
            });
        }
    }
    return items;
};

const createSale = (date: Date): Sale => {
    const items = getRandomItems();
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const paymentMethods = ['dinheiro', 'cartao', 'pix', 'fiado'] as const;

    return {
        id: `sale_${Math.random().toString(36).substr(2, 9)}`,
        date: date.toISOString(),
        items,
        subtotal,
        total,
        tax,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    };
};

const generateSalesData = (): Sale[] => {
    const sales: Sale[] = [];
    const now = new Date();

    // Today's sales
    for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        sales.push(createSale(date));
    }

    // This week's sales
    for (let i = 0; i < 30; i++) {
        sales.push(createSale(subDays(now, Math.floor(Math.random() * 7))));
    }

    // This month's sales
    for (let i = 0; i < 100; i++) {
        sales.push(createSale(subDays(now, Math.floor(Math.random() * 30))));
    }

    // This year's sales
     for (let i = 0; i < 500; i++) {
        sales.push(createSale(subDays(now, Math.floor(Math.random() * 365))));
    }
    
    return sales.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export const salesData: Sale[] = generateSalesData();
