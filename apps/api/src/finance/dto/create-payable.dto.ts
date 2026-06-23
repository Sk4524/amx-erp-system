import {
  IsNumber,
  IsString,
} from "class-validator";

export class CreatePayableDto {

  @IsString()
  vendorName: string;

  @IsNumber()
  amount: number;

  @IsString()
  dueDate: string;
}