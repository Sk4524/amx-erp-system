import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UpdateRoleDto {

  @ApiProperty({
    enum: Role,
    example: Role.MANAGER,
  })
  @IsEnum(Role)
  role: Role;

}