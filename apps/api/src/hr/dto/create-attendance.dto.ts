import {
  IsDateString,
  IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateAttendanceDto {

  @ApiProperty()
  @IsString()
  employeeId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  status: string;
}