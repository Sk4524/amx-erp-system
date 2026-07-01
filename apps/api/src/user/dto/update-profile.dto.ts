import {
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {

  @ApiProperty({
    required: false,
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    required: false,
    example: "9876543210",
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

}