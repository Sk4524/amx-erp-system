import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}