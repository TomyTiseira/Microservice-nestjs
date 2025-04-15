import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class OrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following values: ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}
