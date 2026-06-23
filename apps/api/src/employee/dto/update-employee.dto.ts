import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from "class-validator";

import { Type } from "class-transformer";

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary?: number;
}