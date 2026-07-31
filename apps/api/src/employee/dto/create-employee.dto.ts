import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class CreateEmployeeDto {
  @ApiProperty({
    example: "Rahul Sharma",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "rahul@company.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Welcome@123",
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: "EMPLOYEE",
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    example: "9876543210",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: "IT",
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    example: "Frontend Developer",
    required: false,
  })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({
    example: "FULL_TIME",
    required: false,
  })
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiProperty({
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({
    example: "2026-07-22",
    required: false,
  })
  @IsOptional()
  joiningDate?: Date;
}