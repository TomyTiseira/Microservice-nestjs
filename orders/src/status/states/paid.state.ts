import { OrderStates } from "src/common";
import { OrderState } from "./order-state.interface";

export class PaidState implements OrderState {
  confirm(): OrderState {
    throw new Error("Cannot confirm a paid order.");
  }
  cancel(): OrderState {
    throw new Error("Cannot cancel a paid order.");
  }
  pay(): OrderState {
    throw new Error("Order is already paid.");
  }
  getName(): string {
    return OrderStates.PAID;
  }

}