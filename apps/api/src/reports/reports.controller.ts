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

import { ReportsService }
from "./reports.service";

import { CreateReportDto }
from "./dto/create-report.dto";

import { Roles }
from "../auth/roles.decorator";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Reports")

@ApiBearerAuth()

@Controller("reports")
export class ReportsController {

  constructor(
    private service:
    ReportsService
  ) {}

  // GET REPORTS
  @ApiOperation({
  summary:
    "Get Reports"
})
  @Get()
  @Roles("ADMIN", "MANAGER", "FINANCE")
  getReports(
    @Req() req: any
  ) {

    return this.service.getReports(
      req.user.tenantId
    );
  }

  @ApiOperation({
  summary:
    "Get Report History"
})
@Get("history")
@Roles("ADMIN", "MANAGER", "FINANCE")
getHistory(
  @Req() req: any
) {

  return this.service.getHistory(
    req.user.tenantId
  );
}
  // CREATE REPORT
@ApiOperation({
  summary:
    "Create Scheduled Report"
})

  @Post()
  @Roles("ADMIN", "MANAGER")
  createReport(
    @Body() body: CreateReportDto,
    @Req() req: any
  ) {

   return this.service.createReport(

  body,

  req.user.tenantId,

  req.user.email
);
  }

  // MARK SENT
  @ApiOperation({
  summary:
    "Mark Report As Sent"
})
  @Put(":id/sent")
  @Roles("ADMIN")
 markSent(
  @Param("id") id: string,
  @Req() req: any
) {

  return this.service.markSent(

    id,

    req.user.tenantId,

    req.user.email
  );
}
}