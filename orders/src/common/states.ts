export enum OrderStates {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum ActionState {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  PAY = 'pay'
}