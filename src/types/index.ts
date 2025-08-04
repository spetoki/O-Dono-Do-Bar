
export interface Product {
  id: number;
  barcode?: string;
  name: string;
  description: string;
  costPrice?: number; // Custo de compra do produto
  price: number; // Preço de venda para o cliente
  imageUrl: string;
  category: string;
  stock: number;
  dataAiHint?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO 8601 format
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'dinheiro' | 'cartao' | 'pix' | 'fiado';
}

export interface Customer {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  debt: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string; // Should be hashed in a real app
  role: 'admin' | 'caixa';
}
