import { OrderStates } from "src/common";

export interface OrderWithProducts {
  orderItems: {
    productName: string;
    productId: number;
    quantity: number;
    price: number;
  }[],
  status: {
    id: string;
    name: OrderStates
  }
  id: string;
  totalAmount: number;
  totalItems: number;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}