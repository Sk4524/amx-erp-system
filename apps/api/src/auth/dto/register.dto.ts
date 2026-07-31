import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

  @ApiProperty({
    example: "john@company.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "EMPLOYEE",
  })
  @IsIn([
    "ADMIN",
    "MANAGER",
    "HR",
    "FINANCE",
    "SALES",
    "EMPLOYEE",
  ])
  role: string;

  // Only for Company Registration
  @ApiProperty({
    required: false,
    example: "AMX Corporation",
  })
  @IsOptional()
  @IsString()
  tenantName?: string;

  // Only for Employee Registration
  @ApiProperty({
    required: false,
    example: "AMXA82F",
  })
  @IsOptional()
  @IsString()
  companyCode?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}