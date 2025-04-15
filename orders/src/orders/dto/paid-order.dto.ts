import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePaymentId: string;

  @IsUUID()
  orderId: boolean;

  @IsString()
  @IsUrl()
  receiptUrl: string;
}
