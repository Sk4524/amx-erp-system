import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({
  required: false,
})
@IsOptional()
@IsString()
address?: string;
}
