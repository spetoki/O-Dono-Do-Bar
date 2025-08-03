
export interface Wine {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  wine: Wine;
  quantity: number;
}
