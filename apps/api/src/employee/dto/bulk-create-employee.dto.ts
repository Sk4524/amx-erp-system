import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, ValidateNested } from "class-validator";

import { CreateEmployeeDto } from "./create-employee.dto";

export class BulkCreateEmployeeDto {
  @ApiProperty({
    type: [CreateEmployeeDto],
  })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeDto)
  employees: CreateEmployeeDto[];
}