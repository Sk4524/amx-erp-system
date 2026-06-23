import {
  IsString,
  IsNumber,
  IsDateString,
} from "class-validator";

import { ApiProperty }
from "@nestjs/swagger";

export class CreateInvoiceDto {

  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}