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
