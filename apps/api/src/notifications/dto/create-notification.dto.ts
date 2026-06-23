import {
  IsNotEmpty,
  IsString,
  IsIn,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
  example: "INFO",
})
@IsString()
@IsIn([
  "INFO",
  "SUCCESS",
  "WARNING",
  "ERROR",
])
type: string;
}