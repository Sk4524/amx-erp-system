import {
  IsDateString,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateReceivableDto {

  @IsString()
  customerName: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;
}