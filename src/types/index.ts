export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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
