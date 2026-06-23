import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  budget?: number;
}