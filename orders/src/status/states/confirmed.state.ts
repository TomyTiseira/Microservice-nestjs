import { OrderStates } from 'src/common';
import { OrderState } from './order-state.interface';
import { PaidState } from './paid.state';
import { CancelledState } from './cancelled.state';

export class ConfirmedState implements OrderState {
  confirm(): OrderState {
    throw new Error('Order is already confirmed.');
  }
  cancel(): OrderState {
    return new CancelledState();
  }
  pay(): OrderState {
    return new PaidState();
  }
  getName(): string {
    return OrderStates.CONFIRMED;
  }
}
