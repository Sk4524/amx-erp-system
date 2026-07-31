import {
  IsString,
  IsNumber,
  Min,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";

export class CreatePayrollDto {

  @ApiProperty()
  @IsString()
  employeeId: string;

  @ApiProperty({
    example: 50000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basicSalary: number;

  @ApiProperty({
    example: 5000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  allowances: number;

  @ApiProperty({
    example: 2000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deductions: number;

  @ApiProperty({
    example: "July 2026",
  })
  @IsString()
  month: string;
}