import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";

import { CreateAttendanceDto }
from "./dto/create-attendance.dto";


import { CreateLeaveDto }
from "./dto/create-leave.dto";

import { HrService }
from "./hr.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("HR")

@ApiBearerAuth()

@Controller("hr")
export class HrController {

  constructor(
    private service:
    HrService
  ) {}

  // GET ATTENDANCE
  @Get("attendance")
  @Roles("ADMIN", "HR")
  getAttendance(
    @Req() req: any
  ) {

    return this.service.getAttendance(
      req.user.tenantId
    );
  }

  // CREATE ATTENDANCE
  @Post("attendance")
  @Roles("ADMIN", "HR")
  createAttendance(
    @Body() body: CreateAttendanceDto,
    @Req() req: any
  ) {

    return this.service.createAttendance(

      body,

      req.user.tenantId
    );
  }

  // GET LEAVES
  @Get("leave")
  @Roles("ADMIN", "HR")
  getLeaves(
    @Req() req: any
  ) {

    return this.service.getLeaves(
      req.user.tenantId
    );
  }

  // CREATE LEAVE
  @Post("leave")
  @Roles("ADMIN", "HR", "EMPLOYEE")
  createLeave(
    @Body() body: CreateLeaveDto,
    @Req() req: any
  ) {

    return this.service.createLeave(

      body,

      req.user.tenantId
    );
  }

  // APPROVE LEAVE
  @Put("leave/:id/approve")
  @Roles("ADMIN", "HR")
  approveLeave(
    @Param("id") id: string
  ) {

    return this.service.approveLeave(id);
  }

  // REJECT LEAVE
  @Put("leave/:id/reject")
  @Roles("ADMIN", "HR")
  rejectLeave(
    @Param("id") id: string
  ) {

    return this.service.rejectLeave(id);
  }
}