import {
  IsDateString,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaveDto {

  @ApiProperty()
  @IsString()
  employeeId: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}