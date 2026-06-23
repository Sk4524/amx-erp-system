import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuditService }
from "./audit.service";

import { Roles }
from "../auth/roles.decorator";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Audit")

@ApiBearerAuth()

@Controller("audit")
export class AuditController {

  constructor(
    private service:
    AuditService
  ) {}

  // GET LOGS
  @Get()
  @Roles("ADMIN")
  getLogs(
    @Req() req: any
  ) {

    return this.service.getLogs(
      req.user.tenantId
    );
  }
}