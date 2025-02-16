import { IsEnum, IsOptional } from "class-validator";
import { OrderStates, PaginationDto } from "src/common";


export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStates, { message: `Status must be one of the following values: ${Object.values(OrderStates).join(', ')}` })
  status: OrderStates;
}
