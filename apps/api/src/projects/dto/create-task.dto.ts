import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  projectId: string;
}