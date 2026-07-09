import {
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class UpdateAccountDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

}