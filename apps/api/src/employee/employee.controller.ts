import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Delete,
  Param,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";

import { EmployeeService } from "./employee.service";

import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Employees")
@ApiBearerAuth()
@Controller("employee")
export class EmployeeController {
  constructor(
    private service: EmployeeService
  ) {}

  // GET ALL EMPLOYEES
  @Get()
  @Roles("ADMIN", "HR" ,"MANAGER")
  @ApiOperation({
    summary: "Get employees",
  })
  @ApiQuery({
    name: "page",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    required: false,
  })
  @ApiQuery({
    name: "search",
    required: false,
  })
  getAll(
    @Req() req: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.service.getAll(
      req.user.tenantId,
      Math.max(Number(page) || 1, 1),

Math.min(
Math.max(Number(limit) || 10, 1),
100
),
      search || "",
    );
  }

  // CREATE EMPLOYEE
  @Post()
  @Roles("ADMIN")
  @ApiOperation({
    summary: "Create employee",
  })
  create(
    @Body() body: CreateEmployeeDto,
    @Req() req: any,
  ) {
    return this.service.create(
      body,
      req.user.tenantId,
      req.user.email,
    );
  }
@Post("bulk")
@Roles("ADMIN")
createBulk(
  @Body() body: CreateEmployeeDto[],
  @Req() req: any,
) {
  return this.service.createBulk(
    body,
    req.user.tenantId,
     req.user.email,
  );
}



// GET SINGLE EMPLOYEE
@Get(":id")
@Roles("ADMIN", "HR", "MANAGER")
@ApiOperation({
  summary: "Get employee by id",
})
getOne(
  @Param("id") id: string,
  @Req() req: any,
) {
  return this.service.getOne(
    id,
    req.user.tenantId,
  );
}
  // DELETE EMPLOYEE
  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({
    summary: "Delete employee",
  })
  delete(
    @Param("id") id: string,
    @Req() req: any,
  ) {
    return this.service.delete(
      id,
      req.user.tenantId,
      req.user.email,
    );
  }

  // UPDATE EMPLOYEE
  @Put(":id")
  @Roles("ADMIN")
  @ApiOperation({
    summary: "Update employee",
  })
  update(
    @Param("id") id: string,
    @Body() body: UpdateEmployeeDto,
    @Req() req: any,
  ) {
    return this.service.update(
      id,
      body,
      req.user.tenantId,
      req.user.email,
    );
  }
}