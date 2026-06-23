import {
  IsString,
  IsEmail,
  IsNotEmpty,
    IsIn
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateReportDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
@IsIn([
  "DAILY",
  "WEEKLY",
  "MONTHLY"
])
frequency: string;
}