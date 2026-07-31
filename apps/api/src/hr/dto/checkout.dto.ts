import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckOutDto {

  @ApiProperty()
  @IsString()
  employeeId: string;

}