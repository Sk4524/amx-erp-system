import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class CreateUserDto {

  @ApiProperty({
    example: "employee@amxerp.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Password123",
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.EMPLOYEE,
  })
  @IsEnum(Role)
  role: Role;

}