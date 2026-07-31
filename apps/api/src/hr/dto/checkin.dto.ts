import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckInDto {

  @ApiProperty()
  @IsString()
  employeeId: string;

}