
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}
