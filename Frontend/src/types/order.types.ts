export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

// export interface Category {
//   id: string;
//   name: string;
//   parentId: string ;
// }

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  categoryId: string;
}
