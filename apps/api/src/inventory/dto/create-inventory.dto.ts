import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateInventoryDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  category: string;
}