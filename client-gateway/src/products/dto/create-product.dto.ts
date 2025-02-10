import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
  
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Type(() => Number) // Intenta hacer la transformación a Number
  public price: number;
}
