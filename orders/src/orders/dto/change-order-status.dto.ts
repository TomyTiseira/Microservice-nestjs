import { OrderStatus } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";

export class changeOrderStatusDto {
  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatus, { message: `Status must be one of the following values: ${Object.values(OrderStatus).join(', ')}` })
  status: OrderStatus;
}