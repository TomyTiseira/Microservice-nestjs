import { IsEnum } from 'class-validator';
import { ActionState } from '../enum/order.enum';

export class changeOrderStatusDto {
  @IsEnum(ActionState, {
    message: `Status must be one of the following values: ${Object.values(ActionState).join(', ')}`,
  })
  action: ActionState;
}
