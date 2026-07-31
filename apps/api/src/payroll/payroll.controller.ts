import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { PayrollService } from "./payroll.service";
import { CreatePayrollDto } from "./dto/create-payroll.dto";

import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@ApiTags("Payroll")
@ApiBearerAuth()
@Controller("payroll")
export class PayrollController {

  constructor(
    private service: PayrollService,
  ) {}

  // GENERATE PAYROLL
  @Post()
  @Roles("ADMIN", "HR", "FINANCE")
  @ApiOperation({
    summary: "Generate payroll",
  })
  generatePayroll(
    @Body() body: CreatePayrollDto,
    @Req() req: any,
  ) {
    return this.service.generatePayroll(
      body,
      req.user.tenantId,
      req.user.email,
    );
  }

  // PAYROLL HISTORY
  @Get()
  @Roles("ADMIN", "HR", "FINANCE")
  @ApiOperation({
    summary: "Payroll history",
  })
  getHistory(
    @Req() req: any,
  ) {
    return this.service.getPayrollHistory(
      req.user.tenantId,
    );
  }

  // EMPLOYEE PAYROLL HISTORY
  @Get(":employeeId")
  @Roles(
    "ADMIN",
    "HR",
    "FINANCE",
    "EMPLOYEE",
  )
  @ApiOperation({
    summary: "Employee payroll history",
  })
  getEmployeePayroll(
    @Param("employeeId") employeeId: string,
    @Req() req: any,
  ) {
    return this.service.getEmployeePayroll(
      employeeId,
      req.user.tenantId,
    );
  }

}