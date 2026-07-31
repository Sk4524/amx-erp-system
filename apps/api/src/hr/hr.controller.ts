import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
  Res,
  Query,
} from "@nestjs/common";

import { CreateAttendanceDto }
from "./dto/create-attendance.dto";
import { CheckInDto } from "./dto/checkin.dto";
import { CheckOutDto } from "./dto/checkout.dto";
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


@Get("dashboard")
@Roles("ADMIN", "HR", "MANAGER")
getDashboard(
  @Req() req: any,
) {
  return this.service.getDashboard(
    req.user.tenantId,
  );
}

@Get("dashboard/trend")
@Roles("ADMIN", "HR", "MANAGER")
getAttendanceTrend(
    @Req() req: any,
) {
    return this.service.getAttendanceTrend(
        req.user.tenantId,
    );
}

  // GET ATTENDANCE
@Get("attendance")
@Roles("ADMIN", "HR", "MANAGER")
getAttendance(
  @Req() req: any,

  @Query("employeeId")
  employeeId?: string,

  @Query("status")
  status?: string,

  @Query("from")
  from?: string,

  @Query("to")
  to?: string,
) {

  return this.service.getAttendance(

    req.user.tenantId,

    {
      employeeId,
      status,
      from,
      to,
    },

  );

}

@Get("attendance/export")
@Roles("ADMIN", "HR", "MANAGER")
exportAttendance(
  @Req() req: any,

  @Res() res: any,

  @Query("employeeId")
  employeeId?: string,

  @Query("status")
  status?: string,

  @Query("from")
  from?: string,

  @Query("to")
  to?: string,
) {

  return this.service.exportAttendance(

    req.user.tenantId,

    res,

    {
      employeeId,
      status,
      from,
      to,
    },

  );

}

  // CREATE ATTENDANCE
  @Post("attendance")
  @Roles("ADMIN", "HR", "MANAGER")
  createAttendance(
    @Body() body: CreateAttendanceDto,
    @Req() req: any
  ) {

    return this.service.createAttendance(

      body,

      req.user.tenantId
    );
  }

  @Post("attendance/checkin")
@Roles("EMPLOYEE")
checkIn(
  @Body() body: CheckInDto,
  @Req() req: any,
) {
  return this.service.checkIn(
    body.employeeId,
    req.user.tenantId,
  );
}

@Put("attendance/checkout")
@Roles("EMPLOYEE")
checkOut(
  @Body() body: CheckOutDto,
  @Req() req: any,
) {
  return this.service.checkOut(
    body.employeeId,
    req.user.tenantId,
  );
}
@Get("attendance/me")
@Roles("EMPLOYEE")
getMyAttendance(
  @Req() req: any,
) {

  return this.service.getMyAttendance(
    req.user.userId,
    req.user.tenantId,
  );

}
  // GET LEAVES
  @Get("leave")
  @Roles("ADMIN", "HR", "MANAGER")
  getLeaves(
    @Req() req: any
  ) {

    return this.service.getLeaves(
      req.user.tenantId
    );
  }
@Get("leave/pending")
@Roles("ADMIN", "HR", "MANAGER")
getPendingLeaves(
  @Req() req: any,
) {
  return this.service.getPendingLeaves(
    req.user.tenantId,
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
  req.user.userId,
  req.user.tenantId,
);
  }

  @Get("my-leaves")
@Roles("EMPLOYEE")
getMyLeaves(
  @Req() req: any,
) {
  return this.service.getMyLeaves(
    req.user.userId,
  );
}

  // APPROVE LEAVE
  @Put("leave/:id/approve")
  @Roles("ADMIN", "HR", "MANAGER")
  approveLeave(
    @Param("id") id: string
  ) {

    return this.service.approveLeave(id);
  }

  // REJECT LEAVE
  @Put("leave/:id/reject")
  @Roles("ADMIN", "HR", "MANAGER")
  rejectLeave(
    @Param("id") id: string
  ) {

    return this.service.rejectLeave(id);
  }
}