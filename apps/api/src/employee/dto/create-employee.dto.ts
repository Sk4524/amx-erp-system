import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateEmployeeDto {
  @ApiProperty({
    example: "Rahul Sharma",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Frontend Developer",
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: 55000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary: number;
}