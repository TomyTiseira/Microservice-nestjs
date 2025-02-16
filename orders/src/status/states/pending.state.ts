import { OrderStates } from "src/common";
import { OrderState } from "./order-state.interface";
import { ConfirmedState } from "./confirmed.state";
import { CancelledState } from "./cancelled.state";

export class PendingState implements OrderState {
  confirm(): OrderState {
    return new ConfirmedState();
  }

  pay(): OrderState {
    throw new Error("Cannot pay a pending order. Must be confirmed first");
  }

  cancel(): OrderState {
    return new CancelledState();
  }

  getName(): string {
    return OrderStates.PENDING;
  }
}