import { OrderStates } from "src/common";
import { OrderState } from "./order-state.interface";

export class CancelledState implements OrderState {
  confirm(): OrderState {
    throw new Error("Cannot confirm a cancelled order.");
  }
  cancel(): OrderState {
    throw new Error("Order is already cancelled.");
  }
  pay(): OrderState {
    throw new Error("Cannot pay a cancelled order.");
  }
  getName(): string {
    return OrderStates.CANCELLED;
  }
}