import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  joiningDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;
}