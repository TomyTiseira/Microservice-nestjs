import { IsEnum, IsUUID } from "class-validator";
import { ActionState } from "src/common";

export class changeOrderStatusDto {
  @IsUUID(4)
  id: string;

  @IsEnum(ActionState, { message: 'Invalid action'})
  action: ActionState;
}