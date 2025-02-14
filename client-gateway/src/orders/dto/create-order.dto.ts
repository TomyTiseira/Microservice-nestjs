import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
