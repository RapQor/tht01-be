export interface Cart {
  id?: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
  };
}
