import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from "class-validator";

import { Type } from "class-transformer";

export class UpdateInventoryDto {

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;
}