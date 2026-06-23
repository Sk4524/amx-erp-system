import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateSalesOrderDto {

  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}