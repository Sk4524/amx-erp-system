import {
  IsDateString,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveDto {

 @ApiProperty({
    example: "Family Function",
  })
  @IsString()
  reason: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}