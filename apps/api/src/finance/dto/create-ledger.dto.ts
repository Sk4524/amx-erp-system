import {
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateLedgerDto {

  @IsString()
  description: string;

  @IsNumber()
  debit: number;

  @IsNumber()
  credit: number;

  @IsString()
  accountId: string;

  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  reference?: string;
}