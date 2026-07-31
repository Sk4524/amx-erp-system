import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

import { Role } from "@prisma/client";

export class RegisterPendingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

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
  salary?: number;

  @IsOptional()
  joiningDate?: Date;

  @IsEnum(Role)
  role: Role;

  @MinLength(6)
  password: string;

  @IsString()
  companyCode: string;
}