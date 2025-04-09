export interface OrderState {
  confirm(): OrderState;
  cancel(): OrderState;
  pay(): OrderState;
  getName(): string;
}
